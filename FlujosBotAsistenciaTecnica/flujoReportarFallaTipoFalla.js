const {addKeyword} = require('@bot-whatsapp/bot')
const { delay } = require('@whiskeysockets/baileys');

//////////////////////////////////////// FUNCIONES ELABORADAS

const registrarConversacion = require('../Funciones/registrarConversacion')
const mensajes = require('../Configuracion/botAsistenciaTecnica/mensajes')
const temporizador = require('../Funciones/temporizador')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

const flujoFallaMasiva = require('./flujoFallaMasiva')
const flujoReportarFallaServicioLentoIntermitente = require('./flujoReportarFallaServicioLentoIntermitente')

////////////////////////////////////////////////////////////////////////////////

//const ExpRegFlujo = '/(fa)[ly]+[asoónd]+|(pro)[bv]+(lem)[as]+|(sin )([hi]+(nterne)[t]*|[sc]+(er)[rvbcsio]+)|([ck]+(a)[lyendoí]+)|((no )((ten)[goemsíia ]+|([ha]+(y ))))(([hi]+(nterne)[t]*|[scz](erv)[icso]+)|([r]+(ed)))|((sirv)[eindo]+)|((dañ)[andoó]+)|((no c)[ontamsuen]+)/gmi'
const ExpRegRespuestas = new RegExp("(no )(ten)[egoems]+|[ih]+(ntermiten)[tecia]+|(lent)[otiud]+", "i")

module.exports = flujoReportarFallaTipoFalla = addKeyword('xVCAF9LsnzWkexbp9AHDYIADB2DMPG7BS0JIpDyUI4UZKYrAcq')
.addAction(async (ctx, ctxFn) => {
    
    //Registrar el mensaje
    try {

        //Registrar la conversación
        await registrarConversacion.guardarConversacion(ctx, 'El flujo flujoReportarFallaTipoFalla se disparó por el texto: ')
        
    } catch (error) {

        //Solicitar una respuesta valida
        console.log('Error al registrar la conversación en el flujo flujoReportarFallaTipoFalla, el sistema respondió: ' + error)

    } 
    
    //Iniciar el temporizador de espera de respuesta del cliente
    temporizador.detenerTemporizador(ctx)
    temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')
        
})
.addAnswer(mensajes.PREGUNTA_FLUJO_TIPO_FALLA, {delay:1000, capture:true}, async (ctx, ctxFn) => {
    
    //Registrar el mensaje
    try {

        //Registrar la conversación
        await registrarConversacion.guardarConversacion(ctx, mensajes.PREGUNTA_FLUJO_TIPO_FALLA)

        //Evaluar si el usuario envió una nota de voz
        if(ctx.body.includes('event_voice_note')==true){

            //Registrar la conversación
            await registrarConversacion.guardarConversacion(ctx, mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)
                
            //Hacer una pausa de 2 segundos
            await delay(1000)

            //Informar al cliente que en el momento no se pueden procesar sus notas de voz
            await flowDynamic(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)
            
            //Hacer una pausa de 2 segundos
            await delay(1000)
            
            //Iniciar el temporizador de espera de respuesta del cliente
            temporizador.detenerTemporizador(ctx)
            temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')
        
            //Retorar la respuesta a opción incorrecta
            return ctxFn.fallBack(mensajes.PREGUNTA_FLUJO_TIPO_FALLA)

        }
        else if(ExpRegRespuestas.test(ctx.body) == false){

            //Registrar la conversación
            await registrarConversacion.guardarConversacion(ctx, mensajes.ARGUMENTO_RESPUESTA_INVALIDA)

            //Reiniciar el temporizador de espera de respuesta del cliente
            temporizador.detenerTemporizador(ctx)
            temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')

            //Solicitar una respuesta valida
            return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + mensajes.PREGUNTA_FLUJO_TIPO_FALLA)

        }

        //Detener el temporizador de espera de respuesta del cliente
        temporizador.detenerTemporizador(ctx)
                
    } catch (error) {

        //Solicitar una respuesta valida
        console.log('Error al registrar la conversación en el flujo flujoReportarFallaTipoFalla, el sistema respondió: ' + error)

    } 

}, [flujoFallaMasiva, flujoReportarFallaServicioLentoIntermitente])
