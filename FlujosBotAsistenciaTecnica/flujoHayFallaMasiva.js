
const {addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const { delay } = require('@whiskeysockets/baileys');

//////////////////////////////////////// FUNCIONES ELABORADAS

const registrarConversacion = require('../Funciones/registrarConversacion')
const temporizador = require('../Funciones/temporizador')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

const flujoFalla = require('./flujoFalla')
const flujoServicioZonaFalla = require('./flujoServicioZonaFalla');
const mensajes = require('../Configuracion/botAsistenciaTecnica/mensajes');

////////////////////////////////////////////////////////////////////////////////

const ExpRegFlujo = '/(no ten)+[goemsíia ]+|(no )+[hay ]+|(dañ)+[andoó]+|(urge)+[ntecia]+|(no c)+[ontamsuen]+( con )+|( sin )+[ ihn]+(terne)+/gmi'
const ExpRegRespuestas = new RegExp("^S[ií ]+$|^N[oó ]+$", "i")

module.exports = flujoHayFallaMasiva = addKeyword(ExpRegFlujo, { regex: true })
    .addAction(async (ctx, ctxFn) => {
        
        //Registrar el mensaje
        try {

            //Registrar la conversación
            await registrarConversacion.guardarConversacion(ctx, 'El flujo flujoHayFallaMasiva se disparó por el texto: ')
            
        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoHayFallaMasiva, el sistema respondió: ' + error)

        }

        //Iniciar el temporizador de espera de respuesta del cliente
        temporizador.detenerTemporizador(ctx)
        temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')

    })
    .addAnswer(mensajes.ARGUMENTO_FLUJO_HAY_FALLA_MASIVA, {delay:1000, capture:true}, async (ctx, { fallBack, flowDynamic, gotoFlow }) => {

        //Registrar el inicio de la conversación
        try {

            //Registrar la conversación
            await registrarConversacion.guardarConversacion(ctx, mensajes.ARGUMENTO_FLUJO_HAY_FALLA_MASIVA)

            //Evaluar si el usuario envió una nota de voz
            if(ctx.body.includes('event_voice_note')==true){

                //Registrar la conversación
                await registrarConversacion.guardarConversacion(ctx, mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)

                //Informar al cliente que en el momento no se pueden procesar sus notas de voz
                return fallBack(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ + '\n\n' + mensajes.ARGUMENTO_FLUJO_HAY_FALLA_MASIVA)

            }
            else if(ExpRegRespuestas.test(ctx.body) == false){

                //Registrar la conversación
                await registrarConversacion.guardarConversacion(ctx, mensajes.ARGUMENTO_RESPUESTA_INVALIDA)

                //Solicitar una respuesta valida
                return fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.ARGUMENTO_FLUJO_HAY_FALLA_MASIVA)

            }

        } catch (error) {

            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación en el flujo flujoTipoFalla, el sistema respondió: ' + error)

        }

        //Detener el temporizador de espera de respuesta del cliente
        temporizador.detenerTemporizador(ctx)
        
    }, [flujoFalla, flujoServicioZonaFalla])