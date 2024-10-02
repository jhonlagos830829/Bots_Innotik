const {addKeyword, EVENTS} = require('@bot-whatsapp/bot')
const { delay } = require('@whiskeysockets/baileys');

// NO OLVIDAR PROBAR strapi, excalidraw, dialogflow, railway

//////////////////////////////////////// FUNCIONES ELABORADAS

const registrarConversacion = require('../Funciones/registrarConversacion')
const mensajes = require('../Configuracion/botAsistenciaTecnica/mensajes')
const temporizador = require('../Funciones/temporizador')
const dispositivo = require('../Funciones/dispositivo')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

const flujoReportarFallaBuscarTitular = require('./flujoReportarFallaBuscarTitular')
const flujoDespedida = require('./flujoDespedida')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// EXPRESIONES REGULARES QUE SE USARAN

const ExpRegRespuesta = new RegExp("[a-z áéíóúÁÉÍÓÚñÑ]{3,}", "i")
const ExpRegDistinto = new RegExp("(Soli[cs]itar)+( algo )+|(di[sz]tinto)+|(diferente)+", "i")
//const ExpRegCambioClaveWifi = '/[kc]+(am)+[bviíaáeéoór]+|[ck]+(la)+[veb]+|[wifguafi]+/gmi'

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// VARIABLES QUE SE USARAN

////////////////////////////////////////////////////////////////////////////////

module.exports = flujoReportarFallaNombreTitular = addKeyword('xVCAF9LsnzWkexbp9AHDYIADB2DMPG7BS0JIpDyUI4UZKYrAcq')
    .addAction(async (ctx, ctxFn) => {
        
        //Registrar el mensaje
        try {
            
            //Registrar la conversación
            await registrarConversacion.guardarConversacion(ctx, 'El flujo flujoNombreTitular se disparó por el texto: ')

            //await dispositivo.ejecutarComando()
            
        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoNombreTitular, el sistema respondió: ' + error)

        } 

        //Iniciar el temporizador de espera de respuesta del cliente
        temporizador.detenerTemporizador(ctx)
        temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')
        
    })
    .addAnswer(mensajes.MENSAJE_NOMBRE_TITULAR_SERVICIO, {capture: true}, async (ctx, ctxFn) => {

        //Registrar el inicio de la conversación
        try {

            //Regisrar la conversacion
            await registrarConversacion.guardarConversacion(ctx, mensajes.MENSAJE_NOMBRE_TITULAR_SERVICIO)

            //Evaluar si el usuario envió una nota de voz
            if(ctx.body.includes('event_voice_note')==true){

                //Registrar la conversación
                await registrarConversacion.guardarConversacion(ctx, mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)

                //Hacer una pausa de 2 segundos
                await delay(1000)

                //Informar al cliente que en el momento no se pueden procesar sus notas de voz
                await ctxFn.flowDynamic(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)
                
                //Hacer una pausa de 2 segundos
                await delay(1000)

                //Retorar la respuesta a opción incorrecta
                return ctxFn.fallBack(mensajes.MENSAJE_NOMBRE_TITULAR_SERVICIO)
                
            }
            else if(ExpRegRespuesta.test(ctx.body) == false){

                //Registrar la conversación
                await registrarConversacion.guardarConversacion(ctx, mensajes.ARGUMENTO_RESPUESTA_INVALIDA)
                
                //Solicitar una respuesta valida
                return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.MENSAJE_NOMBRE_TITULAR_SERVICIO)
                
            }
            
            //Configurar el dia de la cita
            ctxFn.state.update({nombre_titular: ctx.body})
            
        } catch (error) {

            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación en el flujo flujoReportarFallaNombreTitular, el sistema respondió: ' + error)

        }

    }, [flujoReportarFallaBuscarTitular])