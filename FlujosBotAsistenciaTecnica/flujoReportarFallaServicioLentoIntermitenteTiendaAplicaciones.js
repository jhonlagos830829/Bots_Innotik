const {addKeyword, EVENTS} = require('@bot-whatsapp/bot')
const { delay } = require('@whiskeysockets/baileys');
const path = require('path')

// NO OLVIDAR PROBAR strapi, excalidraw, dialogflow, railway

//////////////////////////////////////// FUNCIONES ELABORADAS

const registrarConversacion = require('../Funciones/registrarConversacion')
const mensajes = require('../Configuracion/botAsistenciaTecnica/mensajes.js')
const temporizador = require('../Funciones/temporizador')
const dispositivo = require('../Funciones/dispositivo')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

const flujoReportarFallaServicioLentoIntermitenteBuscarWifiman = require('./flujoReportarFallaServicioLentoIntermitenteBuscarWifiman.js')
// const flujoDespedida = require('./flujoDespedida')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// EXPRESIONES REGULARES QUE SE USARAN

const ExpRegFlujo = '/lent[oitud]*|i[nm]+ter[mn]it[en]*te/gmi'
const ExpRegRespuestas = new RegExp("^S[íiÍI]$|^N[oóOÓ]$|^[Ck]a[nm][cs]ela[r]*$", "i")

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// VARIABLES QUE SE USARAN

////////////////////////////////////////////////////////////////////////////////

module.exports = flujoReportarFallaServicioLentoIntermitenteTiendaAplicaciones = addKeyword(/*ExpRegFlujo, { regex: true }*/'Dele')
    .addAction(async (ctx, ctxFn) => {
        
        //Registrar el mensaje
        try {
            
            //Registrar la conversación
            await registrarConversacion.guardarConversacion(ctx, 'El flujo flujoReportarFallaServicioLentoIntermitenteTiendaAplicaciones se disparó por el texto: ')

            //Informar al cliente que en el momento no se pueden procesar sus notas de voz
            await ctxFn.flowDynamic(mensajes.MENSAJE_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR)

            //Realizar una pausa
            await delay(2000)

            //Construir la ruta de la imagen a enviar
            rutaArchivo = path.join(process.cwd(), '/Archivos/Wifiman/Wifiman.jpg')

            //Enviar mensaje con opción
            await ctxFn.provider.sendImage(ctx.key.remoteJid, rutaArchivo)

            //Realizar una pausa
            await delay(2000)

            //Informar al cliente que en el momento no se pueden procesar sus notas de voz
            await ctxFn.flowDynamic(mensajes.MENSAJE_WIFIMAN_INSTALADO_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR)

            //Iniciar el temporizador de espera de respuesta del cliente
            temporizador.detenerTemporizador(ctx)
            temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')
        
        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoReportarFallaServicioLentoIntermitenteTiendaAplicaciones, el sistema respondió: ' + error)

        } 

    })
    .addAction({capture:true}, async (ctx, ctxFn) => {
    
        //Registrar el mensaje
        try {
    
            //Registrar la conversación
            await registrarConversacion.guardarConversacion(ctx, mensajes.MENSAJE_WIFIMAN_INSTALADO_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR)
    
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
                return ctxFn.fallBack(mensajes.MENSAJE_WIFIMAN_INSTALADO_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR)
    
            }
            else if(ExpRegRespuestas.test(ctx.body) == false){
    
                //Registrar la conversación
                await registrarConversacion.guardarConversacion(ctx, mensajes.ARGUMENTO_RESPUESTA_INVALIDA)
    
                //Reiniciar el temporizador de espera de respuesta del cliente
                temporizador.detenerTemporizador(ctx)
                temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')
    
                //Solicitar una respuesta valida
                return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.MENSAJE_WIFIMAN_INSTALADO_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR)
    
            }
            else{
                
                const ExpRegRespuestaSi = new RegExp("^S[íiÍI]$", "i")
                const ExpRegRespuestaNo = new RegExp("^N[oóOÓ]$", "i")
                const ExpRegRespuestaCancelar = new RegExp("^[Ck]a[nm][cs]ela[r]*$", "i")

                //Si el cliente respondió si
                if (ExpRegRespuestaSi.test(ctx.body) == true){

                }
                else if (ExpRegRespuestaNo.test(ctx.body) == true){
                        
                    //Hacer una pausa de 2 segundos
                    await delay(1000)
    
                    //Informar al cliente que en el momento no se pueden procesar sus notas de voz
                    await ctxFn.flowDynamic(mensajes.MENSAJE_DESEA_INSTALAR_WIFIMAN_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR)
                    
                    //Iniciar el temporizador de espera de respuesta del cliente
                    temporizador.detenerTemporizador(ctx)
                    temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')

                }
                else if (ExpRegRespuestaCancelar.test(ctx.body) == true){
                    
                    //Ir al flujo de despedida
                    return ctxFn.gotoFlow(flujoDespedida)

                }

            }

            //Detener el temporizador de espera de respuesta del cliente
            temporizador.detenerTemporizador(ctx)
                    
        } catch (error) {
    
            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoReportarFallaServicioLentoIntermitenteTiendaAplicaciones, el sistema respondió: ' + error)
    
        } 
    
    })
    .addAction({capture:true}, async (ctx, ctxFn) => {

        //Registrar el mensaje
        try {
    
            //Registrar la conversación
            await registrarConversacion.guardarConversacion(ctx, mensajes.MENSAJE_DESEA_INSTALAR_WIFIMAN_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR)
    
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
                return ctxFn.fallBack(mensajes.MENSAJE_DESEA_INSTALAR_WIFIMAN_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR)
    
            }
            else if(ExpRegRespuestas.test(ctx.body) == false){
    
                //Registrar la conversación
                await registrarConversacion.guardarConversacion(ctx, mensajes.ARGUMENTO_RESPUESTA_INVALIDA)
    
                //Reiniciar el temporizador de espera de respuesta del cliente
                temporizador.detenerTemporizador(ctx)
                temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')
    
                //Solicitar una respuesta valida
                return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.MENSAJE_DESEA_INSTALAR_WIFIMAN_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR)
    
            }
            else{
                
                const ExpRegRespuestaSi = new RegExp("^S[íiÍI]$", "i")
                const ExpRegRespuestaNo = new RegExp("^N[oóOÓ]$", "i")
                const ExpRegRespuestaCancelar = new RegExp("^[Ck]a[nm][cs]ela[r]*$", "i")

                //Si el cliente respondió si
                if (ExpRegRespuestaNo.test(ctx.body) == true){
                    
                    //Ir al flujo de despedida
                    return ctxFn.gotoFlow(flujoDespedida)

                }
                else if (ExpRegRespuestaCancelar.test(ctx.body) == true){
                    
                    //Ir al flujo de despedida
                    return ctxFn.gotoFlow(flujoDespedida)

                }

            }

            //Reiniciar el temporizador de espera de respuesta del cliente
            temporizador.detenerTemporizador(ctx)
            temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')
         
        } catch (error) {
    
            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoReportarFallaServicioLentoIntermitenteTiendaAplicaciones, el sistema respondió: ' + error)
    
        } 

    }, [flujoReportarFallaServicioLentoIntermitenteBuscarWifiman])