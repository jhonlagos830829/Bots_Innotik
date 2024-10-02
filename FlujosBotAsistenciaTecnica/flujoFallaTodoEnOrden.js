const {addKeyword} = require('@bot-whatsapp/bot')
const { delay } = require('@whiskeysockets/baileys');

//////////////////////////////////////// FUNCIONES ELABORADAS

const registrarConversacion = require('../Funciones/registrarConversacion')
const mensajes = require('../Configuracion/botAsistenciaTecnica/mensajes')
const temporizador = require('../Funciones/temporizador')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

const flujoFallaAntena = require('./flujoFallaAntena')
//const flujoFallaFibraLedsApagados = require('./flujoFallaFibraLedsApagados')
//const flujoFallaFibra = require('./flujoFallaFibra')

////////////////////////////////////////////////////////////////////////////////

const flujoDespedida = require('./flujoDespedida')
const flujoFallaReiniciar = require('./flujoFallaReiniciar')
const ExpRegRespuestas = new RegExp("^S[ií ]+$|^N[oó ]+$", "i")

module.exports = flujoFallaTodoEnOrden = addKeyword(['Sí', 'Si'])
    .addAction(async (ctx, ctxFn) => {
            
        //Registrar el mensaje
        try {

            //Registrar la conversación
            await registrarConversacion.guardarConversacion(ctx, 'El flujo flujoFallaTodoEnOrden se disparó por el texto: ')
            
            //Iniciar el temporizador de espera de respuesta del cliente
            temporizador.detenerTemporizador(ctx)
            temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')
            
        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoFallaTodoEnOrden, el sistema respondió: ' + error)

        } 

    })
    .addAnswer(mensajes.PREGUNTA_FLUJO_FALLA_TODO_EN_ORDEN, {delay:1000, capture:true}, async (ctx, {fallBack, gotoFlow}) => {
        
        //Registrar el inicio de la conversación
        try {

            //Registrar la conversación
            await registrarConversacion.guardarConversacion(ctx, mensajes.PREGUNTA_FLUJO_FALLA_TODO_EN_ORDEN)
            
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
                return ctxFn.fallBack(mensajes.PREGUNTA_FLUJO_FALLA_TODO_EN_ORDEN)
                
            }
            else if(ExpRegRespuestas.test(ctx.body) == false){
                
                //Registrar la conversación
                await registrarConversacion.guardarConversacion(ctx, mensajes.ARGUMENTO_RESPUESTA_INVALIDA)


                //Solicitar una respuesta valida
                return fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.PREGUNTA_FLUJO_FALLA_TODO_EN_ORDEN)

            }

        } catch (error) {

            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación en el flujo flujoTipoFalla, el sistema respondió: ' + error)

        }

        //Ir al flujo de despedida
        //return gotoFlow(flujoDespedida)

    }, [flujoDespedida, flujoFallaReiniciar])