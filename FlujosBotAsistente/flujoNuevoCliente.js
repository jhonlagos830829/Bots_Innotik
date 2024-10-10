const {addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const { delay, downloadMediaMessage } = require('@whiskeysockets/baileys');
const { writeFile } = require("node:fs/promises")
const path = require('path')
const { createWorker } = require('tesseract.js')
const fs = require('fs')
require('dotenv').config()

//////////////////////////////////////// FUNCIONES ELABORADAS

//const registrarConversacion = require('../Funciones/registrarConversacion.js')
const mensajes = require('../Configuracion/botAsistente/mensajes.js')
const cliente = require('../Funciones/cliente.js')
//const cuentaBancaria = require('../Funciones/cuenta.js')
//const movimiento = require('../Funciones/movimiento.js')
//const configuracion = require('../Configuracion/configuracion.js')
//const fechas = require('../Funciones/fechas.js')
const temporizador = require('../Funciones/temporizador.js')
//const { constants } = require('node:buffer')
//const { ESLint } = require('eslint')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

//const flujoTipoFalla = require('./flujoReportarFallaTipoFalla')

////////////////////////////////////////////////////////////////////////////////

const clientesConsultados = JSON.parse('{"datos":[]}')
// const ExpRegFlujo = '/^1$/gmi'
const ExpRegRespuestasTitular = new RegExp("[a-zA-ZñÑáéíóúÁÉÍÓÚ ]{3,}", "i")
const ExpRegRespuestaCancelar = new RegExp("[CK]an[cs]el[aeo]", "i")
const ExpRegRespuestaNo = new RegExp("^N[oóÓ]", "i")
const ExpRegRespuestaSi = new RegExp("^S[íiÍ]", "i")
// const ExpRegRespuestasOtro = new RegExp("[a-zA-ZñÑáéíóúÁÉÍÓÚ ]{3,}", "i")
// var nombreArchivo = ''
// let primerNombre
//let idClientePago

module.exports = flujoNuevoCliente = addKeyword('ExpRegFlujo, { regex: true }')
    .addAnswer(mensajes.MENSAJE_NUEVO_CLIENTE_NOMBRE, {capture:true}, async (ctx, ctxFn) => {

        //Registrar el inicio de la conversación
        try {
            
            //Evaluar si el usuario envió una nota de voz
            if(ctx.body.includes('event_voice_note')==true){

                //Informar al cliente que en el momento no se pueden procesar sus notas de voz
                await ctxFn.flowDynamic(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)
                
                //Retorar la respuesta a opción incorrecta
                return ctxFn.fallBack(mensajes.MENSAJE_NUEVO_CLIENTE_NOMBRE)
                
            }
            else if(ExpRegRespuestasTitular.test(ctx.body) == false){

                //Solicitar una respuesta valida
                return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.MENSAJE_NUEVO_CLIENTE_NOMBRE)
                
            }
            else if(ExpRegRespuestaCancelar.test(ctx.body) == true){
                
                //Iniciar el temporizador de espera de respuesta del cliente
                temporizador.detenerTemporizador(ctx)
                
                //Ir al flujo de escaneo del comprobante
                ctxFn.gotoFlow(require('./flujoNoTengoRespuesta.js'), 1)

            }
            else{
                
                //Guardar en el estado de la conversación los valores para la expresión regular que evalue la opción seleccionada
                ctxFn.state.update({nuevoClienteNombre: ctx.body.replaceAll('á', 'a').replaceAll('é', 'e').replaceAll('í', 'i').replaceAll('ó', 'o').replaceAll('ú', 'u').replaceAll('Á', 'A').replaceAll('É', 'E').replaceAll('Í', 'I').replaceAll('Ó', 'o').replaceAll('Ú', 'U').trim().toLowerCase().replace(/\b\w/g, s => s.toUpperCase())})
                
                // //Armar la estructura de datos donde se almacenarán los clientes consultados identificados por el número que escribe
                // clientesConsultados.datos.push({consultor: ctx.from, clientes: []})

                //Buscar el cliente por el nombre proporcionado
                let clientes = await cliente.obtenerCliente('', ctxFn.state.get('nuevoClienteNombre'), '')
                
                //Si la consulta arrojó resultados
                if (Object.keys(clientes.data).length > 0){

                    //Guardar en una variable de estado el mensaje enviado
                    ctxFn.state.update({mensajePreguntaActual: mensajes.MENSAJE_NUEVO_CLIENTE_YA_EXISTE.replace('{NOMBRE_CLIENTE}', ctxFn.state.get('nuevoClienteNombre'))})

                    //Enviar el mensaje de cliente no encontrado
                    await ctxFn.flowDynamic(mensajes.MENSAJE_NUEVO_CLIENTE_YA_EXISTE.replace('{NOMBRE_CLIENTE}', ctxFn.state.get('nuevoClienteNombre')))

                }
               
            }
            
            //Iniciar el temporizador de espera de respuesta del cliente
            temporizador.detenerTemporizador(ctx)
            temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAsistente/flujoNoTengoRespuesta')

        } catch (error) {

            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación en el flujo flujoReportarPagoCliente, el sistema respondió: ' + error)

        }

    })
    .addAction({capture:true}, async (ctx, ctxFn) => {

        //Variables para las expresiones regulares que evaluaran la respuesta
        const ExpRegRespuestas = new RegExp("^S[íiÍ]|^N[oóÓ]|^[CK]an[cs]el[aeo]|[a-z]{4,} [a-z]{4,}", "i")
        const ExpRegSi = new RegExp("^S[íiÍI]$", "i")
        const ExpRegNo = new RegExp("^N[oóOÓ]", "i")
        const ExpRegNCancelar = new RegExp("^[CK]an[cs]el[aeo]", "i")

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
            else{

                //Si el técnico eligió el único titular resutante de la búsqueda
                if(ExpRegNo.test(ctx.body) == true){

                    //Devolver al inicio del flujo
                    
                    //Volver a la primera parte del flujo
                    ctxFn.gotoFlow(require('./flujoReportarPagoClienteNombre.js'))
                
                    
                }
                else if(ExpRegNinguno.test(ctx.body) == false){

                    //Obtener los clientes consultados por el número
                    let todoConsultado = clientesConsultados.datos.filter(clientes => clientes.consultor === ctx.from)

                    //Obtener el cliente elegido
                    const clienteElegido = todoConsultado[0].clientes.find(cliente => cliente.posicion == ctx.body)
                    
                    //Obtener el id del cliente al cual pertenece el pago
                    idClientePago = clienteElegido.id
                    
                    //Guardar en la variable de estado el id del cliente al cual se le cagará el pago
                    ctxFn.state.update({idCliente: clienteElegido.id})
                    
                    //Guardar en la variable de estado el nombre del cliente al cual se debe cargar el pago
                    ctxFn.state.update({nombreClientePago: clienteElegido.nombre})
                    
                    // //Iniciar el temporizador de espera de respuesta del cliente
                    // temporizador.detenerTemporizador(ctx)
                    // temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAtencionAlCliente/flujoNoTengoRespuestaAtencionAlCliente', mensajes.MENSAJE_SIN_DATOS_NECESARIOS)
                    
                    // //Ir al flujo de escaneo del comprobante
                    // ctxFn.gotoFlow(require('./flujoReportePagoEscaneoComprobante.js'))

                }
                else{

                    //Volver a la primera parte del flujo
                    ctxFn.gotoFlow(require('./flujoReportarPagoClienteNombre.js'))
                
                }

            }
            
        } catch (error) {

            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación en el flujo flujoReportarPagoCliente, el sistema respondió: ' + error)

        }

        //Iniciar el temporizador de espera de respuesta del cliente
        temporizador.detenerTemporizador(ctx)
        temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAsistente/flujoNoTengoRespuesta')

    })
    // .addAnswer(mensajes.MENSAJE_VALOR_PAGADO, {capture:true}, async (ctx, ctxFn) => {

    //     //Variable para crear la expresión regular que evauará la respuesta
    //     const ExpRegValorPagado = new RegExp("^[0-9]{4,}$", "i")
    //     // const ExpRegConfirmarPagoSi = new RegExp("^S[íiÍ]", "i")
    //     // const ExpRegConfirmarPagoNo = new RegExp("^N[oóÓ]", "i")

    //     //Registrar el inicio de la conversación
    //     try {

    //         //Evaluar si el usuario envió una nota de voz
    //         if(ctx.body.includes('event_voice_note')==true){

    //             //Informar al cliente que en el momento no se pueden procesar sus notas de voz
    //             await ctxFn.flowDynamic(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)
                
    //             //Hacer una pausa de 2 segundos
    //             await delay(1000)

    //             //Retorar la respuesta a opción incorrecta
    //             return ctxFn.fallBack(mensajes.MENSAJE_VALOR_PAGADO)
                
    //         }
    //         else if(ExpRegValorPagado.test(ctx.body) == false){

    //             //Solicitar una respuesta valida
    //             return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.MENSAJE_VALOR_PAGADO)
                
    //         }
    //         else{
                
    //             //Guardar en el estado el mensaje enviado para reenviarlo en el siguiente fallbask en caso de no responder correctamente
    //             ctxFn.state.update({mensajePreguntaActual: mensajes.MENSAJE_CONFIRMAR_PAGO.replace("{NOMBRE_CLIENTE}", ctxFn.state.get('nombreClientePago')).replace("{VALOR_PAGADO}", parseInt(ctx.body).toLocaleString("es-CO", {style: "currency", currency: "COP", minimumFractionDigits: 0, maximumFractionDigits: 0,}))})

    //             //Enviar mensaje de confiración
    //             await ctxFn.flowDynamic(mensajes.MENSAJE_CONFIRMAR_PAGO.replace("{NOMBRE_CLIENTE}", ctxFn.state.get('nombreClientePago')).replace("{VALOR_PAGADO}", parseInt(ctx.body).toLocaleString("es-CO", {style: "currency", currency: "COP", minimumFractionDigits: 0, maximumFractionDigits: 0,})))

    //         }
            
    //         //Iniciar el temporizador de espera de respuesta del cliente
    //         temporizador.detenerTemporizador(ctx)
    //         temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAsistente/flujoNoTengoRespuesta')

    //     } catch (error) {

    //         //Mostrar el mensaje de error en la consola
    //         console.log('Error al registrar la conversación en el flujo flujoReportarPagoCliente, el sistema respondió: ' + error)

    //     }

    // })
    // .addAction({capture:true}, async (ctx, ctxFn) => {

    //     //Variable para crear la expresión regular que evauará la respuesta
    //     const ExpRegConfirmarPago = new RegExp("^S[íiÍ]$|^N[oóÓ]$", "i")
    //     const ExpRegConfirmarPagoSi = new RegExp("^S[íiÍ]", "i")
    //     const ExpRegConfirmarPagoNo = new RegExp("^N[oóÓ]", "i")

    //     //Registrar el inicio de la conversación
    //     try {

    //         //Evaluar si el usuario envió una nota de voz
    //         if(ctx.body.includes('event_voice_note')==true){

    //             //Informar al cliente que en el momento no se pueden procesar sus notas de voz
    //             await ctxFn.flowDynamic(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)
                
    //             //Hacer una pausa de 2 segundos
    //             await delay(1000)

    //             //Retorar la respuesta a opción incorrecta
    //             return ctxFn.fallBack(ctxFn.state.get('mensajePreguntaActual'))
                
    //         }
    //         else if(ExpRegConfirmarPago.test(ctx.body) == false){

    //             //Solicitar una respuesta valida
    //             return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + ctxFn.state.get('mensajePreguntaActual'))
                
    //         }
    //         else{

    //             //Enviar mensaje de confiración
    //             await ctxFn.flowDynamic(mensajes.MENSAJE_CONFIRMAR_PAGO.replace("{NOMBRE_CLIENTE}", ctxFn.state.get('nombreClientePago')).replace("{VALOR_PAGADO}", parseInt(ctx.body).toLocaleString("es-CO", {style: "currency", currency: "COP", minimumFractionDigits: 0, maximumFractionDigits: 0,})))

    //             //Si el cliente respundió no
    //             if(ExpRegConfirmarPagoNo.test(ctx.body) == true){

    //                 //Enviar de nuevo al flujo para solicitar el nombre del cliente
    //                 //return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + ctxFn.state.get('mensajePreguntaActual'))
                    
    //             }

    //             //Si el cliente respundió si
    //             if(ExpRegConfirmarPagoSi.test(ctx.body) == true){

    //                 //Guardar el movimiento en la base de datos
    //                 //ACA SE DEBEN CONFIGURAR TODOS LOS DATOS DEL MOVIMIENTO
    //                 movimiento.Guardar(ctxFn.state.get('idCliente'), '', fecha, idCuenta, valor, referencia, conversacion, 'Cliente', ctx.from, '', cunico, recibo, ter, rrn, apro, comprobante, origen, false)

    //                 //console.log('Listo metí los datos')

    //                 //Mostrar las opciones de nuevo
    //                 ctxFn.flowDynamic(mensajes.MENSAJE_COMPROBANTE_RECIBIDO)
                    
    //                 //Iniciar el temporizador de espera de respuesta del cliente
    //                 temporizador.detenerTemporizador(ctx)
    //                 temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAtencionAlCliente/flujoNoTengoRespuestaAtencionAlCliente')
            
    //                 //Ir al flujo de despedida
    //                 ctxFn.gotoFlow(require('./flujoAlgoMasAtencionAlCliente.js'))

    //             }

    //         }
            
    //     } catch (error) {

    //         //Mostrar el mensaje de error en la consola
    //         console.log('Error al registrar la conversación en el flujo flujoReportarPagoCliente, el sistema respondió: ' + error)

    //     }

    // })
    
