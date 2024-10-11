const {addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const { delay, downloadMediaMessage } = require('@whiskeysockets/baileys');
// const { writeFile } = require("node:fs/promises")
// const path = require('path')
// const { createWorker } = require('tesseract.js')
// const fs = require('fs')
require('dotenv').config()

//////////////////////////////////////// FUNCIONES ELABORADAS

const mensajes = require('../Configuracion/botAtencionAlCliente/mensajes.js')
const temporizador = require('../Funciones/temporizador.js')
const cliente = require('../Funciones/cliente.js')
// const { constants } = require('node:buffer')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

const flujoFacturasPendientes = require('./flujoFacturasPendientes.js')
const flujoCuentaParaPagar = require('./flujoCuentaParaPagar.js')
const flujoInformacionServicios = require('./flujoInformacionServicios.js')

////////////////////////////////////////////////////////////////////////////////

const ExpRegRespuestas = new RegExp("[1-4]{1}", "i")

module.exports = flujoSaludoAtencionAlCliente = addKeyword(EVENTS.WELCOME)
    .addAction(async (ctx, ctxFn) => {
        
        //Intentar
        try {

            //Consultar si ya está registrado en el cliente en el sistema
            let datosCliente = await cliente.obtenerCliente('', '', ctx.from)
            
            //Si el ciente ya se encuentra registrado en el sistema
            if(Object.keys(datosCliente.data).length > 0){
                
                //Actualizar el estado con la existencia del cliente
                ctxFn.state.update({cliente_registrado: 'Si'})
                ctxFn.state.update({idCliente: datosCliente.data[0].attributes.id})
                ctxFn.state.update({identificacion: datosCliente.data[0].attributes.identificacion})
                ctxFn.state.update({nombre: datosCliente.data[0].attributes.nombre})
                ctxFn.state.update({numeroTelefonico: datosCliente.data[0].attributes.numeroTelefonico})
                ctxFn.state.update({cuentaBanco: datosCliente.data[0].attributes.cuenta.data.attributes.banco.split(' ')[0]})
                ctxFn.state.update({cuentaTipo: datosCliente.data[0].attributes.cuenta.data.attributes.tipo})
                ctxFn.state.update({cuentaNumero: datosCliente.data[0].attributes.cuenta.data.attributes.numero})
                ctxFn.state.update({cuentaTitular: datosCliente.data[0].attributes.cuenta.data.attributes.titular})
                ctxFn.state.update({cuentaIdentificacion: datosCliente.data[0].attributes.cuenta.data.attributes.identificacion})
                
                //Extraer solo el primer nombre
                let primerNombre = datosCliente.data[0].attributes.nombre.split(' ')
                
                //Enviar mensaje de benvenida
                await ctxFn.flowDynamic(mensajes.SALUDO_INICIAL_ATENCION_AL_CLIENTE.replace("{NOMBRE_CLIENTE}", primerNombre[0]))

            }
            else{

                //Actualizar el estado con la existencia del cliente
                ctxFn.state.update({cliente_registrado: 'No'})

                //Obtener el nombre para mostrar de Whatsapp
                let nombreWhatsApp = ctx.pushName.replace('~', '')
                let primerNombre = nombreWhatsApp.split(' ')

                //Si el nombre para mostrar en Whatsapp tiene más de 2 caracteres
                if(primerNombre[0].length > 2){

                    //Informar al cliente que en el momento no se pueden procesar sus notas de voz
                    await ctxFn.flowDynamic(mensajes.SALUDO_INICIAL_ATENCION_AL_CLIENTE.replace("{NOMBRE_CLIENTE}", primerNombre[0]))

                }
                else{

                    //Informar al cliente que en el momento no se pueden procesar sus notas de voz
                    await ctxFn.flowDynamic(mensajes.SALUDO_INICIAL_ATENCION_AL_CLIENTE.replace("*{NOMBRE_CLIENTE}* ", ''))

                }
                
            }

            //Hacer una pausa de 1 segundos
            await delay(1000)
            
            //Enviar mensaje de recordatorio de la línea de soporte
            await ctxFn.flowDynamic(mensajes.MENSAJE_LINEA_REPORTE_FALLAS_ATENCION_AL_CLIENTE)
            
        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoSaludoAtencionAlCliente, el sistema respondió: ' + error)

        }
        
        //Iniciar el temporizador de espera de respuesta del cliente
        temporizador.detenerTemporizador(ctx)
        temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAtencionAlCliente/flujoNoTengoRespuestaAtencionAlCliente')

    })
    .addAnswer(mensajes.MENSAJE_TEMAS_ATENCION_AL_CLIENTE, {delay:1000, capture:true}, async (ctx, ctxFn) => {

        //Registrar el inicio de la conversación
        try {

            //Evaluar si el usuario envió una nota de voz
            if(ctx.body.includes('event_voice_note')==true){

                //Informar al cliente que en el momento no se pueden procesar sus notas de voz
                await ctxFn.flowDynamic(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)
                
                //Hacer una pausa de 2 segundos
                await delay(1000)

                //Retorar la respuesta a opción incorrecta
                ctxFn.fallBack(mensajes.MENSAJE_TEMAS_ATENCION_AL_CLIENTE)
                
            }
            else if(ExpRegRespuestas.test(ctx.body) == false){

                //Solicitar una respuesta valida
                return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.MENSAJE_TEMAS_ATENCION_AL_CLIENTE)
                
            }
            else if(ctx.body == '3'){

                // //Solicitar una respuesta valida
                // return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.MENSAJE_TEMAS_ATENCION_AL_CLIENTE)
                //Enviar al flujo de reporte de pago
                ctxFn.flowDynamic('Por favor envíe la foto del comprobante de pago')

                //Ir al flujo de despedida
                ctxFn.gotoFlow(require('./flujoReportePago.js'))
                
            }
            
            
        } catch (error) {

            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación en el flujo flujoFalla, el sistema respondió: ' + error)

        }
        
        //Iniciar el temporizador de espera de respuesta del cliente
        temporizador.detenerTemporizador(ctx)
        temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAtencionAlCliente/flujoNoTengoRespuestaAtencionAlCliente')

    }, [flujoFacturasPendientes, flujoCuentaParaPagar, flujoInformacionServicios])
