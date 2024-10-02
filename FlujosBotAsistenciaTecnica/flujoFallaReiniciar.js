const {addKeyword} = require('@bot-whatsapp/bot')

//////////////////////////////////////// FUNCIONES ELABORADAS

const mensajes = require('../Configuracion/botAsistenciaTecnica/mensajes')
const registrarConversacion = require('../Funciones/registrarConversacion')

const ExpRegRespuestas = new RegExp("^S[ií ]+$|^N[oó ]+$", "i")
    
module.exports = flujoFallaReiniciar = addKeyword(['Sí', 'No', 'Aún no', 'Aun'])
    .addAction(async (ctx, ctxFn) => {
                
        //Registrar el mensaje
        try {

            //Registrar la conversación
            await registrarConversacion.guardarConversacion(ctx, 'El flujo flujoFallaReiniciar se disparó por el texto: ')
            
        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoFallaReiniciar, el sistema respondió: ' + error)

        } 

    })
    .addAnswer(mensajes.ARGUMENTO_FLUJO_FALLA_REINICIAR, {delay:2000}, async (ctx, {fallBack, gotoFlow}) => {
                
        //Registrar el mensaje
        try {

            //Registrar la conversación
            await registrarConversacion.guardarConversacion(ctx, mensajes.ARGUMENTO_FLUJO_FALLA_REINICIAR)
            
        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoFallaReiniciar, el sistema respondió: ' + error)

        } 

    })
    .addAnswer(mensajes.PROCEDIMIENTO_FLUJO_FALLA_REINICIAR_1, {delay:2000, media:'https://innotik.com.co/INTERNET/Diagnostico/Antena/FallaAntenaPOECorriente.jpg'}, async (ctx, {fallBack, gotoFlow}) => {
                
        //Registrar el mensaje
        try {

            //Registrar la conversación
            await registrarConversacion.guardarConversacion(ctx, mensajes.PROCEDIMIENTO_FLUJO_FALLA_REINICIAR_1)
            
        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoFallaReiniciar, el sistema respondió: ' + error)

        } 

    })
    .addAnswer(mensajes.PROCEDIMIENTO_FLUJO_FALLA_REINICIAR_2, {delay:2000, media:'https://innotik.com.co/INTERNET/Diagnostico/Antena/FallaRouterCorriente.jpg'}, async (ctx, {fallBack, gotoFlow}) => {
                
        //Registrar el mensaje
        try {

            //Registrar la conversación
            await registrarConversacion.guardarConversacion(ctx, mensajes.PROCEDIMIENTO_FLUJO_FALLA_REINICIAR_2)
            
        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoFallaReiniciar, el sistema respondió: ' + error)

        } 

    })
    .addAnswer(mensajes.PROCEDIMIENTO_FLUJO_FALLA_REINICIAR_3, {delay:2000}, async (ctx, {fallBack, gotoFlow}) => {
                
        //Registrar el mensaje
        try {

            //Registrar la conversación
            await registrarConversacion.guardarConversacion(ctx, mensajes.PROCEDIMIENTO_FLUJO_FALLA_REINICIAR_3)
            
        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoFallaReiniciar, el sistema respondió: ' + error)

        } 

    })
    .addAnswer(mensajes.PREGUNTA_FLUJO_FALLA_TODO_EN_ORDEN, {delay:2000, capture:true}, async (ctx, {fallBack, gotoFlow}) => {
        
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
                return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.PREGUNTA_FLUJO_FALLA_TODO_EN_ORDEN)
                
            }
            
        } catch (error) {

            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación en el flujo flujoFalla, el sistema respondió: ' + error)

        }
        
    }/*, [flujoFallaYaTieneServicio, flujoFallaNoCorreccionConexiones]*/)
