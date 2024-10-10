const {addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const { delay, downloadMediaMessage } = require('@whiskeysockets/baileys');
require('dotenv').config()

//////////////////////////////////////// FUNCIONES ELABORADAS

const mensajes = require('../Configuracion/botAsistente/mensajes.js')
const temporizador = require('../Funciones/temporizador.js')
const caja = require('../Funciones/caja.js')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

const flujoReportarPagoCliente = require('./flujoReportarPagoClienteNombre.js')
const vale = require('./flujoNoTengoRespuesta.js')

////////////////////////////////////////////////////////////////////////////////

const ExpRegRespuestas = new RegExp("^[1-6]{1}$|[CK]an[cs]el[aeo]", "i")
const ExpRegRespuestaCancelar = new RegExp("[CK]an[cs]el[aeo]", "i")
const ExpRegRespuesta1 = new RegExp("^1$", "i")

module.exports = flujoPrincipal = addKeyword(EVENTS.WELCOME)
    .addAction(async (ctx, ctxFn) => {
        
        //Intentar
        try {

            //Consultar si ya está registrado en el cliente en el sistema
            let datosEmpleado = await caja.obtenerCaja(ctx.from, '')
            
            //Si el ciente ya se encuentra registrado en el sistema
            if(Object.keys(datosEmpleado.data).length > 0){
                
                //Actualizar el estado con la existencia del cliente
                ctxFn.state.update({empleadoRegistrado: 'Si'})
                ctxFn.state.update({idCaja: datosEmpleado.data[0].id})
                ctxFn.state.update({numeroWhatsapp: datosEmpleado.data[0].attributes.numeroWhatsapp})
                ctxFn.state.update({nombre: datosEmpleado.data[0].attributes.nombre})
                
                //Extraer solo el primer nombre
                let primerNombre = datosEmpleado.data[0].attributes.nombre.split(' ')
                
                //Guardar en el estado el mensaje enviado para reenviarlo en el siguiente fallbask en caso de no responder correctamente
                ctxFn.state.update({mensajePreguntaActual: mensajes.MENSAJE_TEMAS_ASISTENTE})

                //Enviar mensaje de benvenida
                await ctxFn.flowDynamic(mensajes.SALUDO_INICIAL_ASISTENCIA.replace("{NOMBRE_CLIENTE}", primerNombre[0])+ '\n\n' + mensajes.MENSAJE_TEMAS_ASISTENTE)

            }
            else{

                //Informar al cliente que en el momento no se pueden procesar sus notas de voz
                await ctxFn.flowDynamic(mensajes.MENSAJE_NO_AUTORIZADO)
                
            }

        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoSaludoAtencionAlCliente, el sistema respondió: ' + error)

        }
        
        //Iniciar el temporizador de espera de respuesta del cliente
        temporizador.detenerTemporizador(ctx)
        temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAsistente/flujoNoTengoRespuesta')

    })
    .addAction( {capture:true}, async (ctx, ctxFn) => {

        //Registrar el inicio de la conversación
        try {

            //Evaluar si el usuario envió una nota de voz
            if(ctx.body.includes('event_voice_note')==true){

                //Informar al cliente que en el momento no se pueden procesar sus notas de voz
                await ctxFn.flowDynamic(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)
                
                //Hacer una pausa de 2 segundos
                await delay(1000)

                //Retorar la respuesta a opción incorrecta
                return ctxFn.fallBack(ctxFn.state.get('mensajePreguntaActual'))
                
            }
            else if(ExpRegRespuestas.test(ctx.body) == false){

                //Solicitar una respuesta valida
                return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + ctxFn.state.get('mensajePreguntaActual'))
                
            }
            else if(ExpRegRespuestaCancelar.test(ctx.body) == true){
                
                //Iniciar el temporizador de espera de respuesta del cliente
                temporizador.detenerTemporizador(ctx)
                
                //Ir al flujo de escaneo del comprobante
                ctxFn.gotoFlow(require('./flujoNoTengoRespuesta.js'), 1)

            }
            else if(ExpRegRespuesta1.test(ctx.body) == true){
                
                //Iniciar el temporizador de espera de respuesta del cliente
                temporizador.detenerTemporizador(ctx)
                temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAsistente/flujoNoTengoRespuesta')
                
                //Ir al flujo de escaneo del comprobante
                ctxFn.gotoFlow(require('./flujoNuevoCliente.js'))

            }
            
        } catch (error) {

            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación en el flujo flujoFalla, el sistema respondió: ' + error)

        }
        
    }/*, [flujoReportarPagoCliente]*/)
