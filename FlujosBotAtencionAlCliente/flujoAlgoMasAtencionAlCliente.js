const {addKeyword, EVENTS} = require('@bot-whatsapp/bot')
const { delay } = require('@whiskeysockets/baileys');

// NO OLVIDAR PROBAR strapi, excalidraw, dialogflow, railway

////////////////////////// FUNCIONES ELABORADAS

const mensajes = require('../Configuracion/botAtencionAlCliente/mensajes.js')
const temporizador = require('../Funciones/temporizador.js')
const configuracionBot = require('../Configuracion/configuracion.js');

////////////////////////////////////////////////////////////////////////////////

////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

const configuracion = require('../Configuracion/configuracion.js');

////////////////////////////////////////////////////////////////////////////////

////////////////////////// EXPRESIONES REGULARES QUE SE USARAN

const ExpRegRespuestas = new RegExp("^S[íiÍ]$|^N[oóÓ]$", "i")
const ExpRegRespuestaAfirmativa = new RegExp("^S[íiÍ]$", "i")
const ExpRegRespuestaNegativa = new RegExp("^N[oóÓ]$", "i")

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// VARIABLES QUE SE USARAN

////////////////////////////////////////////////////////////////////////////////

module.exports = flujoAlgoMasAtencionAlCliente = addKeyword('bLoNWYmBEttxyzhcXO0CyT0bTDGYCYNc91qmwZVhFyn7Jlzbja')
    .addAnswer(mensajes.MENSAJE_FLUJO_ALGO_MAS, {capture: true}, async (ctx, ctxFn) => {

        //Registrar el inicio de la conversación
        try {

            //Evaluar si el usuario envió una nota de voz
            if(ctx.body.includes('event_voice_note')==true){
                
                //Hacer una pausa de 2 segundos
                await delay(1000)

                //Informar al cliente que en el momento no se pueden procesar sus notas de voz
                await ctxFn.flowDynamic(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)

                //Hacer una pausa de 2 segundos
                await delay(1000)
                
                //Iniciar el temporizador de espera de respuesta del cliente
                temporizador.detenerTemporizador(ctx)
                temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAtencionAlCliente/flujoNoTengoRespuestaAtencionAlCliente')

                //Mostrar las opciones de nuevo
                ctxFn.fallBack(mensajes.MENSAJE_FLUJO_ALGO_MAS)

            }
            else if(ExpRegRespuestas.test(ctx.body) == false){
                
                //Iniciar el temporizador de espera de respuesta del cliente
                temporizador.detenerTemporizador(ctx)
                temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAtencionAlCliente/flujoNoTengoRespuestaAtencionAlCliente')
                
                //Solicitar una respuesta valida
                return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.MENSAJE_FLUJO_ALGO_MAS)
                
            }
            else{

                //Si el cliente respondió que si
                if(ExpRegRespuestaAfirmativa.test(ctx.body) == true){
                
                    //Iniciar el temporizador de espera de respuesta del cliente
                    temporizador.detenerTemporizador(ctx)
                    temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAtencionAlCliente/flujoNoTengoRespuestaAtencionAlCliente')
                    
                    //Ir al flujo principal
                    return ctxFn.gotoFlow(require('./flujoSaludoAtencionAlCliente.js'), 1)
                    
                }
                else if(ExpRegRespuestaNegativa.test(ctx.body) == true){

                    //Iniciar el temporizador de espera de respuesta del cliente
                    temporizador.detenerTemporizador(ctx)

                    //Ir al flujo de despedida
                    return ctxFn.gotoFlow(require('./flujoDespedida.js'))

                }

            }

        } catch (error) {

            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación en el flujo flujoAlgoMas, el sistema respondió: ' + error)

        }

    })