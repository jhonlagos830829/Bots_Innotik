const {addKeyword, EVENTS} = require('@bot-whatsapp/bot')
const { delay } = require('@whiskeysockets/baileys');
const path = require('path')

// NO OLVIDAR PROBAR strapi, excalidraw, dialogflow, railway

//////////////////////////////////////// FUNCIONES ELABORADAS

const registrarConversacion = require('../Funciones/registrarConversacion')
const mensajes = require('../Configuracion/mensajes')
const temporizador = require('../Funciones/temporizador')
const dispositivo = require('../Funciones/dispositivo')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

// const flujoBuscarTitular = require('./flujoBuscarTitular.js')
// const flujoDespedida = require('./flujoDespedida')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// EXPRESIONES REGULARES QUE SE USARAN

const ExpRegFlujo = '/^S[íiÍI]$/gmi'
const ExpRegRespuestas = new RegExp("^S[íiÍI]$|^N[oóOÓ]$|^[Ck]a[nm][cs]ela[r]*$", "i")
const ExpRegDistinto = new RegExp("(Soli[cs]itar)+( algo )+|(di[sz]tinto)+|(diferente)+", "i")
//const ExpRegCambioClaveWifi = '/[kc]+(am)+[bviíaáeéoór]+|[ck]+(la)+[veb]+|[wifguafi]+/gmi'

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// VARIABLES QUE SE USARAN

////////////////////////////////////////////////////////////////////////////////

module.exports = flujoReportarFallaServicioLentoIntermitenteBuscarWifiman = addKeyword(ExpRegFlujo, { regex: true })
    .addAction(async (ctx, ctxFn) => {
        
        //Registrar el mensaje
        try {
            
            //Registrar la conversación
            await registrarConversacion.guardarConversacion(ctx, 'El flujo flujoReportarFallaServicioLentoIntermitenteBuscarWifiman se disparó por el texto: ')

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
            console.log('Error al registrar la conversación en el flujo flujoReportarFallaServicioLentoIntermitenteBuscarWifiman, el sistema respondió: ' + error)

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
            console.log('Error al registrar la conversación en el flujo flujoReportarFallaServicioLentoIntermitenteBuscarWifiman, el sistema respondió: ' + error)
    
        } 
    
    }/*, [flujoFallaMasiva, flujoReportarFallaServicioLentoIntermitente]*/)
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
            console.log('Error al registrar la conversación en el flujo flujoReportarFallaServicioLentoIntermitenteBuscarWifiman, el sistema respondió: ' + error)
    
        } 

        // //Iniciar el temporizador de espera de respuesta del cliente
        // temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')

    })
    .addAnswer([mensajes.MENSAJE_ENVIARE_FOTOS_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR], {delay:1000, capture:true}, async (ctx, ctxFn) => {
        
        //Registrar el inicio de la conversación
        try {
            
            //Registrar la conversación
            await registrarConversacion.guardarConversacion(ctx, mensajes.MENSAJE_ENVIARE_FOTOS_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR)
    
            //Realizar una pausa
            await delay(1000)

            //Informar al cliente que en el momento no se pueden procesar sus notas de voz
            await ctxFn.flowDynamic(mensajes.MENSAJE_ABRIR_TIENDA_APLICACIONES_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR)
            
            //Realizar una pausa
            await delay(3000)

            //Construir la ruta de la imagen a enviar
            rutaArchivo = path.join(process.cwd(), '/Archivos/Wifiman/PlayStore.jpg')

            //Enviar mensaje con opción
            await ctxFn.provider.sendImage(ctx.key.remoteJid, rutaArchivo, mensajes.MENSAJE_TIENDA_APLICACIONES_ANDROID_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR)

            //Realizar una pausa
            await delay(5000)

            //Construir la ruta de la imagen a enviar
            rutaArchivo = path.join(process.cwd(), '/Archivos/Wifiman/AppStore.jpg')

            //Enviar mensaje con opción
            await ctxFn.provider.sendImage(ctx.key.remoteJid, rutaArchivo, mensajes.MENSAJE_TIENDA_APLICACIONES_IOS_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR)

        } catch (error) {
            
            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación, el sistema respondió: ' + error)

        }
        
    })
    .addAnswer([mensajes.MENSAJE_VAMOS_BIEN_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR], {delay:1000, capture:true}, async (ctx, ctxFn) => {
        
        //Registrar el inicio de la conversación
        try {
            
            //Registrar la conversación
            await registrarConversacion.guardarConversacion(ctx, mensajes.MENSAJE_VAMOS_BIEN_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR)
    
            //Construir la ruta de la imagen a enviar
            rutaArchivo = path.join(process.cwd(), '/Archivos/Wifiman/BuscarWifiman.jpg')

            //Enviar mensaje con opción
            await ctxFn.provider.sendImage(ctx.key.remoteJid, rutaArchivo, mensajes.MENSAJE_BUSCAR_WIFIMAN_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR)

            //Realizar una pausa
            await delay(8000)

            //Construir la ruta de la imagen a enviar
            rutaArchivo = path.join(process.cwd(), '/Archivos/Wifiman/InstalarWifiman.jpg')

            //Enviar mensaje con opción
            await ctxFn.provider.sendImage(ctx.key.remoteJid, rutaArchivo, mensajes.MENSAJE_INSTALAR_WIFIMAN_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR)

            //Realizar una pausa
            await delay(8000)

            //Construir la ruta de la imagen a enviar
            rutaArchivo = path.join(process.cwd(), '/Archivos/Wifiman/ProcesoInstalacionWifiman.jpg')

            //Enviar mensaje con opción
            await ctxFn.provider.sendImage(ctx.key.remoteJid, rutaArchivo, mensajes.MENSAJE_PROCESO_INSTALACION_WIFIMAN_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR)

            //Realizar una pausa
            await delay(8000)


        } catch (error) {
            
            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación, el sistema respondió: ' + error)

        }
        
    })/*
    .addAnswer([mensajes.MENSAJE_VAMOS_BIEN_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR], {delay:1000, capture:true}, async (ctx, ctxFn) => {
        
        //Registrar el inicio de la conversación
        try {
            
            //Registrar la conversación
            await registrarConversacion.guardarConversacion(ctx, mensajes.MENSAJE_ENVIARE_FOTOS_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR)
    
            //Construir la ruta de la imagen a enviar
            rutaArchivo = path.join(process.cwd(), '/Archivos/Wifiman/PlayStore.jpg')

            //Enviar mensaje con opción
            await ctxFn.provider.sendImage(ctx.key.remoteJid, rutaArchivo, mensajes.MENSAJE_TIENDA_APLICACIONES_ANDROID_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR)

            //Realizar una pausa
            await delay(8000)

            //Construir la ruta de la imagen a enviar
            rutaArchivo = path.join(process.cwd(), '/Archivos/Wifiman/AppStore.jpg')

            //Enviar mensaje con opción
            await ctxFn.provider.sendImage(ctx.key.remoteJid, rutaArchivo, mensajes.MENSAJE_TIENDA_APLICACIONES_IOS_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR)

            //Realizar una pausa
            await delay(8000)

            //Construir la ruta de la imagen a enviar
            rutaArchivo = path.join(process.cwd(), '/Archivos/Wifiman/BuscarWifiman.jpg')

            //Enviar mensaje con opción
            await ctxFn.provider.sendImage(ctx.key.remoteJid, rutaArchivo, mensajes.MENSAJE_BUSCAR_WIFIMAN_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR)

            //Realizar una pausa
            await delay(8000)

            //Construir la ruta de la imagen a enviar
            rutaArchivo = path.join(process.cwd(), '/Archivos/Wifiman/InstalarWifiman.jpg')

            //Enviar mensaje con opción
            await ctxFn.provider.sendImage(ctx.key.remoteJid, rutaArchivo, mensajes.MENSAJE_INSTALAR_WIFIMAN_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR)

            //Realizar una pausa
            await delay(8000)

            //Construir la ruta de la imagen a enviar
            rutaArchivo = path.join(process.cwd(), '/Archivos/Wifiman/ProcesoInstalacionWifiman.jpg')

            //Enviar mensaje con opción
            await ctxFn.provider.sendImage(ctx.key.remoteJid, rutaArchivo, mensajes.MENSAJE_PROCESO_INSTALACION_WIFIMAN_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR)

            //Realizar una pausa
            await delay(8000)


        } catch (error) {
            
            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación, el sistema respondió: ' + error)

        }
        
    })*/