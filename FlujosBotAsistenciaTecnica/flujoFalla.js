const {addKeyword} = require('@bot-whatsapp/bot')

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

const ExpRegFlujo = '/(n)+[oó]+/gmi'
const ExpRegRespuestas = new RegExp("[ha]+(ntena)|((fibra)|[ oó]+(pti)[ck]+(a))|[ck]+(a)[bv](le)", "i")

module.exports = flujoFalla = addKeyword(ExpRegFlujo, { regex: true })
    .addAction(async (ctx, ctxFn) => {
        
        //Registrar el mensaje
        try {

            //Registrar la conversación
            await registrarConversacion.guardarConversacion(ctx, 'El flujo flujoFalla se disparó por el texto: ')

            
            //Iniciar el temporizador de espera de respuesta del cliente
            temporizador.detenerTemporizador(ctx)
            temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')
                    
            
        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoFalla, el sistema respondió: ' + error)

        } 

    })
    .addAnswer(mensajes.PREGUNTA_FLUJO_FALLA, {delay:2000, capture:true}, async (ctx, ctxFn) => {
        
        //Registrar el inicio de la conversación
        try {

            //Registrar la conversación
            await registrarConversacion.guardarConversacion(ctx, mensajes.PREGUNTA_FLUJO_FALLA)

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
                return ctxFn.fallBack(mensajes.PREGUNTA_FLUJO_FALLA)
                
            }
            else if(ExpRegRespuestas.test(ctx.body) == false){

                //Registrar la conversación
                await registrarConversacion.guardarConversacion(ctx, mensajes.ARGUMENTO_RESPUESTA_INVALIDA)
                
                //Solicitar una respuesta valida
                return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.PREGUNTA_FLUJO_FALLA)
                
            }
            
        } catch (error) {

            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación en el flujo flujoFalla, el sistema respondió: ' + error)

        }

    }, [flujoFallaAntena/*, flujoFallaFibra*/])