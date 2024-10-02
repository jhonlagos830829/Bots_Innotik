const {addKeyword} = require('@bot-whatsapp/bot')
//const flujoFallaTodoEnOrden = require('./flujoFallaTodoEnOrden')
//const flujoFallaTodoNoEnOrden = require('./flujoFallaTodoNoEnOrden')

//////////////////////////////////////// FUNCIONES ELABORADAS

const registrarConversacion = require('../Funciones/registrarConversacion')
const mensajes = require('../Configuracion/botAsistenciaTecnica/mensajes')
const temporizador = require('../Funciones/temporizador')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

const flujoFallaTodoEnOrden = require('./flujoFallaTodoEnOrden')
const flujoFallaTodoNoEnOrden = require('./flujoFallaTodoNoEnOrden')

////////////////////////////////////////////////////////////////////////////////

const ExpRegFallaAntena = '/[han]+(nte)+[na]+/gmi'
const ExpRegRespuestas = new RegExp("^S[ií ]+$|^N[oó ]+$", "i")

module.exports = flujoFallaAntena = addKeyword(['Antena'])
    .addAction(async (ctx, ctxFn) => {
            
        //Registrar el mensaje
        try {

            //Registrar la conversación
            await registrarConversacion.guardarConversacion(ctx, 'El flujo flujoFallaAntena se disparó por el texto: ')
            
        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoFallaAntena, el sistema respondió: ' + error)

        } 

    })
    .addAnswer(mensajes.ARGUMENTO_FLUJO_FALLA_ANTENA, {delay:1000}, async (ctx, {fallBack, gotoFlow}) => {
    
        //Registrar la conversación
        await registrarConversacion.guardarConversacion(ctx, mensajes.ARGUMENTO_FLUJO_FALLA_ANTENA)

    })
    .addAnswer(mensajes.DIAGNOSTICO_FLUJO_FALLA_ANTENA_1, {delay:2000, media:'https://innotik.com.co/INTERNET/Diagnostico/Antena/FallaAntena01.jpeg'}, async (ctx, {fallBack, gotoFlow}) => {
    
        //Registrar la conversación
        await registrarConversacion.guardarConversacion(ctx, mensajes.DIAGNOSTICO_FLUJO_FALLA_ANTENA_1)

    })
    .addAnswer(mensajes.DIAGNOSTICO_FLUJO_FALLA_ANTENA_2, {delay:5000, media:'https://innotik.com.co/INTERNET/Diagnostico/Antena/FallaAntena02.jpeg'}, async (ctx, {fallBack, gotoFlow}) => {
    
        //Registrar la conversación
        await registrarConversacion.guardarConversacion(ctx, mensajes.DIAGNOSTICO_FLUJO_FALLA_ANTENA_2)

    })
    .addAnswer(mensajes.DIAGNOSTICO_FLUJO_FALLA_ANTENA_3, {delay:5000, media:'https://innotik.com.co/INTERNET/Diagnostico/Antena/FallaAntena03.jpeg'}, async (ctx, {fallBack, gotoFlow}) => {
    
        //Registrar la conversación
        await registrarConversacion.guardarConversacion(ctx, mensajes.DIAGNOSTICO_FLUJO_FALLA_ANTENA_3)

    })
    .addAnswer(mensajes.DIAGNOSTICO_FLUJO_FALLA_ANTENA_4, {delay:5000, media:'https://innotik.com.co/INTERNET/Diagnostico/Antena/FallaAntena04.jpeg'}, async (ctx, ctxFn) => {
    
        //Registrar la conversación
        await registrarConversacion.guardarConversacion(ctx, mensajes.DIAGNOSTICO_FLUJO_FALLA_ANTENA_4)

        //Iniciar el temporizador de espera de respuesta del cliente
        temporizador.detenerTemporizador(ctx)
        temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')

    })
    .addAnswer(mensajes.PREGUNTA_FLUJO_FALLA_ANTENA, {delay:6000, capture:true}, async (ctx, {fallBack, gotoFlow}) => {

        //Registrar el inicio de la conversación
        try {
    
            //Registrar la conversación
            await registrarConversacion.guardarConversacion(ctx, mensajes.PREGUNTA_FLUJO_FALLA_ANTENA)
            
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
                return ctxFn.fallBack(mensajes.PREGUNTA_FLUJO_FALLA_ANTENA)
                
            }
            else if(ExpRegRespuestas.test(ctx.body) == false){
                
                //Registrar la conversación
                await registrarConversacion.guardarConversacion(ctx, mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.PREGUNTA_FLUJO_FALLA_ANTENA)
        
                //Solicitar una respuesta valida
                return fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.PREGUNTA_FLUJO_FALLA_ANTENA)
        
            }

        } catch (error) {

            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación en el flujo flujoFallaAntena, el sistema respondió: ' + error)

        }
        
    }, [flujoFallaTodoEnOrden, flujoFallaTodoNoEnOrden])
