const {addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const { delay, downloadMediaMessage } = require('@whiskeysockets/baileys');
const { writeFile } = require("node:fs/promises")
const path = require('path')
const { createWorker } = require('tesseract.js')
const fs = require('fs')
require('dotenv').config()

//////////////////////////////////////// FUNCIONES ELABORADAS

//const registrarConversacion = require('../Funciones/registrarConversacion.js')
const mensajes = require('../Configuracion/botAsistente/mensajes.js')
const escaneo = require('../Funciones/comprobante.js')
const temporizador = require('../Funciones/temporizador.js')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

//const flujoTipoFalla = require('./flujoReportarFallaTipoFalla')

////////////////////////////////////////////////////////////////////////////////

const clientesConsultados = JSON.parse('{"datos":[]}')
// const ExpRegFlujo = '/^1$/gmi'
const ExpRegRespuestasTitular = new RegExp("[a-zA-ZñÑáéíóúÁÉÍÓÚ ]{3,}", "i")
const ExpRegRespuestaCancelar = new RegExp("[CK]an[cs]el[aeo]", "i")
const ExpRegRespuestaNo = new RegExp("^N[oóÓ]", "i")
const ExpRegRespuestaSi = new RegExp("^S[íiÍ]", "i")

module.exports = flujoNuevoCliente = addKeyword('ExpRegFlujo, { regex: true }')
    // .addAnswer(mensajes.MENSAJE_NUEVO_CLIENTE_NOMBRE, {capture:true}, async (ctx, ctxFn) => {

    //     //Registrar el inicio de la conversación
    //     try {
            
    //         //Evaluar si el usuario envió una nota de voz
    //         if(ctx.body.includes('event_voice_note') == true){

    //             //Informar al cliente que en el momento no se pueden procesar sus notas de voz
    //             await ctxFn.flowDynamic(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)
                
    //             //Retorar la respuesta a opción incorrecta
    //             return ctxFn.fallBack(mensajes.MENSAJE_NUEVO_CLIENTE_NOMBRE)
                
    //         }
    //         else if(ExpRegRespuestasTitular.test(ctx.body) == false){

    //             //Solicitar una respuesta valida
    //             return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.MENSAJE_NUEVO_CLIENTE_NOMBRE)
                
    //         }
    //         else if(ExpRegRespuestaCancelar.test(ctx.body) == true){
                
    //             //Iniciar el temporizador de espera de respuesta del cliente
    //             temporizador.detenerTemporizador(ctx)
                
    //             //Ir al flujo de escaneo del comprobante
    //             ctxFn.gotoFlow(require('./flujoNoTengoRespuesta.js'), 1)

    //         }
    //         else{
                
    //             //Guardar en el estado de la conversación los valores para la expresión regular que evalue la opción seleccionada
    //             ctxFn.state.update({nuevoClienteNombre: ctx.body.replaceAll('á', 'a').replaceAll('é', 'e').replaceAll('í', 'i').replaceAll('ó', 'o').replaceAll('ú', 'u').replaceAll('Á', 'A').replaceAll('É', 'E').replaceAll('Í', 'I').replaceAll('Ó', 'o').replaceAll('Ú', 'U').trim().toLowerCase().replace(/\b\w/g, s => s.toUpperCase())})
                
    //             //Buscar el cliente por el nombre proporcionado
    //             let clientes = await cliente.obtenerCliente('', ctxFn.state.get('nuevoClienteNombre'), '')
                
    //             //Si la consulta arrojó resultados
    //             if (Object.keys(clientes.data).length > 0){

    //                 //Iniciar el temporizador de espera de respuesta del cliente
    //                 temporizador.detenerTemporizador(ctx)
    //                 temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAsistente/flujoNoTengoRespuesta')

    //                 //Enviar el mensaje de cliente no encontrado
    //                 await ctxFn.fallBack(mensajes.MENSAJE_NUEVO_CLIENTE_YA_EXISTE.replace('{NOMBRE_CLIENTE}', ctxFn.state.get('nuevoClienteNombre')))

    //             }
               
    //         }
            
    //     } catch (error) {

    //         //Mostrar el mensaje de error en la consola
    //         console.log('Error al registrar la conversación en el flujo flujoNuevoCliente, el sistema respondió: ' + error)

    //     }

    //     //Iniciar el temporizador de espera de respuesta del cliente
    //     temporizador.detenerTemporizador(ctx)
    //     temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAsistente/flujoNoTengoRespuesta')

    // })
    // .addAnswer(mensajes.MENSAJE_NUEVO_CLIENTE_IDENTIFICACION, {capture:true}, async (ctx, ctxFn) => {

    //     //Variable para crear la expresión regular que evauará la respuesta
    //     const ExpRegIdentificacion = new RegExp("^[0-9]{7,}$", "i")

    //     //Registrar el inicio de la conversación
    //     try {

    //         //Evaluar si el usuario envió una nota de voz
    //         if(ctx.body.includes('event_voice_note')==true){

    //             //Informar al cliente que en el momento no se pueden procesar sus notas de voz
    //             await ctxFn.flowDynamic(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)
                
    //             //Retorar la respuesta a opción incorrecta
    //             return ctxFn.fallBack(mensajes.MENSAJE_NUEVO_CLIENTE_IDENTIFICACION)
                
    //         }
    //         else if(ExpRegRespuestaCancelar.test(ctx.body) == true){
                
    //             //Iniciar el temporizador de espera de respuesta del cliente
    //             temporizador.detenerTemporizador(ctx)
                
    //             //Ir al flujo de escaneo del comprobante
    //             ctxFn.gotoFlow(require('./flujoNoTengoRespuesta.js'), 1)

    //         }
    //         else if(ExpRegIdentificacion.test(ctx.body) == false){

    //             //Solicitar una respuesta valida
    //             return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.MENSAJE_NUEVO_CLIENTE_IDENTIFICACION)
                
    //         }
    //         else{
                
    //             //Guardar en el estado de la conversación el número de identificación del cliente
    //             ctxFn.state.update({nuevoClienteNombre: ctx.body})
                
    //         }
            
    //     } catch (error) {

    //         //Mostrar el mensaje de error en la consola
    //         console.log('Error al registrar la conversación en el flujo flujoNuevoCliente, el sistema respondió: ' + error)

    //     }

    //     //Iniciar el temporizador de espera de respuesta del cliente
    //     temporizador.detenerTemporizador(ctx)
    //     temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAsistente/flujoNoTengoRespuesta')

    // })
    // .addAnswer(mensajes.MENSAJE_NUEVO_CLIENTE_TELEFONO, {capture:true}, async (ctx, ctxFn) => {

    //     //Variable para crear la expresión regular que evauará la respuesta
    //     const ExpRegTelefono = new RegExp("^[0-9]{10,}$", "i")

    //     //Registrar el inicio de la conversación
    //     try {

    //         //Evaluar si el usuario envió una nota de voz
    //         if(ctx.body.includes('event_voice_note')==true){

    //             //Informar al cliente que en el momento no se pueden procesar sus notas de voz
    //             await ctxFn.flowDynamic(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)
                
    //             //Retorar la respuesta a opción incorrecta
    //             return ctxFn.fallBack(mensajes.MENSAJE_NUEVO_CLIENTE_TELEFONO)
                
    //         }
    //         else if(ExpRegRespuestaCancelar.test(ctx.body) == true){
                
    //             //Iniciar el temporizador de espera de respuesta del cliente
    //             temporizador.detenerTemporizador(ctx)
                
    //             //Ir al flujo de escaneo del comprobante
    //             ctxFn.gotoFlow(require('./flujoNoTengoRespuesta.js'), 1)

    //         }
    //         else if(ExpRegTelefono.test(ctx.body) == false){

    //             //Solicitar una respuesta valida
    //             return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.MENSAJE_NUEVO_CLIENTE_TELEFONO)
                
    //         }
    //         else{
                
    //             //Guardar en el estado de la conversación el número de identificación del cliente
    //             ctxFn.state.update({nuevoClienteTelefono: ctx.body})
                
    //         }
            
    //     } catch (error) {

    //         //Mostrar el mensaje de error en la consola
    //         console.log('Error al registrar la conversación en el flujo flujoNuevoCliente, el sistema respondió: ' + error)

    //     }

    //     //Iniciar el temporizador de espera de respuesta del cliente
    //     temporizador.detenerTemporizador(ctx)
    //     temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAsistente/flujoNoTengoRespuesta')

    // })
    // .addAnswer(mensajes.MENSAJE_NUEVO_CLIENTE_WHATSAPP, {capture:true}, async (ctx, ctxFn) => {

    //     //Variable para crear la expresión regular que evauará la respuesta
    //     const ExpRegWhatsapp = new RegExp("^[0-9]{10,}$", "i")

    //     //Registrar el inicio de la conversación
    //     try {

    //         //Evaluar si el usuario envió una nota de voz
    //         if(ctx.body.includes('event_voice_note')==true){

    //             //Informar al cliente que en el momento no se pueden procesar sus notas de voz
    //             await ctxFn.flowDynamic(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)
                
    //             //Retorar la respuesta a opción incorrecta
    //             return ctxFn.fallBack(mensajes.MENSAJE_NUEVO_CLIENTE_WHATSAPP)
                
    //         }
    //         else if(ExpRegRespuestaCancelar.test(ctx.body) == true){
                
    //             //Iniciar el temporizador de espera de respuesta del cliente
    //             temporizador.detenerTemporizador(ctx)
                
    //             //Ir al flujo de escaneo del comprobante
    //             ctxFn.gotoFlow(require('./flujoNoTengoRespuesta.js'), 1)

    //         }
    //         else if(ExpRegWhatsapp.test(ctx.body) == false){

    //             //Solicitar una respuesta valida
    //             return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.MENSAJE_NUEVO_CLIENTE_WHATSAPP)
                
    //         }
    //         else{
                
    //             //Guardar en el estado de la conversación el número de identificación del cliente
    //             ctxFn.state.update({nuevoClienteWhatsapp: ctx.body})
                
    //         }
            
    //     } catch (error) {

    //         //Mostrar el mensaje de error en la consola
    //         console.log('Error al registrar la conversación en el flujo flujoNuevoCliente, el sistema respondió: ' + error)

    //     }

    //     //Iniciar el temporizador de espera de respuesta del cliente
    //     temporizador.detenerTemporizador(ctx)
    //     temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAsistente/flujoNoTengoRespuesta')

    // })
    // .addAnswer(mensajes.MENSAJE_NUEVO_CLIENTE_CORREO, {capture:true}, async (ctx, ctxFn) => {

    //     //Variable para crear la expresión regular que evauará la respuesta
    //     const ExpRegCorreo = new RegExp("^[a-z0-9]{4,}@[a-z0-9]{2,}[.][a-z.]{2,}$", "i")

    //     //Registrar el inicio de la conversación
    //     try {

    //         //Evaluar si el usuario envió una nota de voz
    //         if(ctx.body.includes('event_voice_note')==true){

    //             //Informar al cliente que en el momento no se pueden procesar sus notas de voz
    //             await ctxFn.flowDynamic(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)
                
    //             //Retorar la respuesta a opción incorrecta
    //             return ctxFn.fallBack(mensajes.MENSAJE_NUEVO_CLIENTE_CORREO)
                
    //         }
    //         else if(ExpRegRespuestaCancelar.test(ctx.body) == true){
                
    //             //Iniciar el temporizador de espera de respuesta del cliente
    //             temporizador.detenerTemporizador(ctx)
                
    //             //Ir al flujo de escaneo del comprobante
    //             ctxFn.gotoFlow(require('./flujoNoTengoRespuesta.js'), 1)

    //         }
    //         else if(ExpRegCorreo.test(ctx.body) == false){

    //             //Solicitar una respuesta valida
    //             return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.MENSAJE_NUEVO_CLIENTE_CORREO)
                
    //         }
    //         else{
                
    //             //Guardar en el estado de la conversación el número de identificación del cliente
    //             ctxFn.state.update({nuevoClienteCorreo: ctx.body})
                
    //         }
            
    //     } catch (error) {

    //         //Mostrar el mensaje de error en la consola
    //         console.log('Error al registrar la conversación en el flujo flujoNuevoCliente, el sistema respondió: ' + error)

    //     }

    //     //Iniciar el temporizador de espera de respuesta del cliente
    //     temporizador.detenerTemporizador(ctx)
    //     temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAsistente/flujoNoTengoRespuesta')

    // })
    // .addAnswer(mensajes.MENSAJE_NUEVO_CLIENTE_UBICACION, {capture:true}, async (ctx, ctxFn) => {

    //     //Registrar el inicio de la conversación
    //     try {

    //         //Evaluar si el usuario envió una nota de voz
    //         if(ctx.body.includes('event_voice_note') == true){

    //             //Informar al cliente que en el momento no se pueden procesar sus notas de voz
    //             await ctxFn.flowDynamic(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)
                
    //             //Retorar la respuesta a opción incorrecta
    //             return ctxFn.fallBack(mensajes.MENSAJE_NUEVO_CLIENTE_UBICACION)
                
    //         }
    //         else if(ctx.body.includes('_event_location_') == true){

    //             //Guardar en el estado de la conversación el número de identificación del cliente
    //             ctxFn.state.update({nuevoClienteUbicacion: ctx.message.locationMessage.degreesLatitude + ', ' + ctx.message.locationMessage.degreesLongitude})

    //         }
    //         else if(ExpRegRespuestaCancelar.test(ctx.body) == true){
                
    //             //Iniciar el temporizador de espera de respuesta del cliente
    //             temporizador.detenerTemporizador(ctx)
                
    //             //Ir al flujo de escaneo del comprobante
    //             ctxFn.gotoFlow(require('./flujoNoTengoRespuesta.js'), 1)

    //         }
    //         else{
                
    //             //Solicitar una respuesta valida
    //             return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.MENSAJE_NUEVO_CLIENTE_UBICACION)
                
    //         }
            
    //     } catch (error) {

    //         //Mostrar el mensaje de error en la consola
    //         console.log('Error al registrar la conversación en el flujo flujoNuevoCliente, el sistema respondió: ' + error)

    //     }

    //     //Iniciar el temporizador de espera de respuesta del cliente
    //     temporizador.detenerTemporizador(ctx)
    //     temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAsistente/flujoNoTengoRespuesta')

    // })
    .addAnswer(mensajes.MENSAJE_NUEVO_CLIENTE_TECNOLOGIA, {capture:true}, async (ctx, ctxFn) => {

        //Variable para crear la expresión regular que evauará la respuesta
        const ExpRegTecnologia = new RegExp("^[1-2]{1}$", "i")

        //Registrar el inicio de la conversación
        try {

            //Evaluar si el usuario envió una nota de voz
            if(ctx.body.includes('event_voice_note')==true){

                //Informar al cliente que en el momento no se pueden procesar sus notas de voz
                await ctxFn.flowDynamic(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)
                
                //Retorar la respuesta a opción incorrecta
                return ctxFn.fallBack(mensajes.MENSAJE_NUEVO_CLIENTE_TECNOLOGIA)
                
            }
            else if(ExpRegTecnologia.test(ctx.body) == false){

                //Solicitar una respuesta valida
                return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.MENSAJE_NUEVO_CLIENTE_TECNOLOGIA)
                
            }
            else if(ExpRegRespuestaCancelar.test(ctx.body) == true){
                
                //Iniciar el temporizador de espera de respuesta del cliente
                temporizador.detenerTemporizador(ctx)
                
                //Ir al flujo de escaneo del comprobante
                ctxFn.gotoFlow(require('./flujoNoTengoRespuesta.js'), 1)

            }
            else{

                //Si el técnico respondió PON
                if(ctx.body == '1'){

                    //Guardar en el estado de la conversación el número de identificación del cliente
                    ctxFn.state.update({nuevoClienteTecnologia: 'PON'})

                    //Informar al cliente que en el momento no se pueden procesar sus notas de voz
                    await ctxFn.flowDynamic(mensajes.MENSAJE_NUEVO_CLIENTE_FOTO_ONU)
                
                }
                else{

                    //Guardar en el estado de la conversación el número de identificación del cliente
                    ctxFn.state.update({nuevoClienteTecnologia: 'Radio'})
                
                }
                
            }
            
        } catch (error) {

            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación en el flujo flujoNuevoCliente, el sistema respondió: ' + error)

        }

        //Iniciar el temporizador de espera de respuesta del cliente
        temporizador.detenerTemporizador(ctx)
        temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAsistente/flujoNoTengoRespuesta')

    })
    .addAction({capture:true}, async (ctx, ctxFn) => {
        
        //Registrar el inicio de la conversación
        try {

            //Evaluar si el usuario envió una nota de voz
            if(ctx.body.includes('event_voice_note') == true){

                //Informar al cliente que en el momento no se pueden procesar sus notas de voz
                await ctxFn.flowDynamic(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)
                
                //Retorar la respuesta a opción incorrecta
                return ctxFn.fallBack(mensajes.MENSAJE_NUEVO_CLIENTE_TECNOLOGIA)
                
            }
            else if(ctx.body.includes('_event_media_') == true){
                
                //Obtener la fecha del sistema
                fechaBruta = new Date()

                //Elaborar el nombde del directorio donde se guardarán las imagenes
                const nombreDirectorioComprobantes = 'Archivos/Instalaciones/' + fechaBruta.getFullYear() + '-' + (fechaBruta.getMonth() + 1) + '-' + fechaBruta.getDate() + '_' + ctxFn.state.get('nuevoClienteNombre')
                
                //Si el directorio no existe
                if (!fs.existsSync(nombreDirectorioComprobantes)){

                    //Crear el directorio
                    fs.mkdirSync(nombreDirectorioComprobantes, { recursive: true });

                }
                
                //Elaborar el nombre  con el cual se guardará el comprobante
                const nombreComprobante = 'ONU_' + ctx.from + '_' + Date.now()

                //ALmacenar en buffer la imagen
                const buffer = await downloadMediaMessage(ctx, "buffer")

                //Guardar la imagen
                await writeFile(nombreDirectorioComprobantes + "/" + nombreComprobante + ".jpg", buffer)

                //Guardar en una variable de estado el nombre del archivo del comprobante
                ctxFn.state.update({fotoOnu: nombreDirectorioComprobantes + "/" + nombreComprobante + ".jpg"})

                //let salida = await escaneo.escanearConTesseract(ctxFn.state.get('fotoOnu'))
                let salida = await escaneo.escanearConGoogle(ctxFn.state.get('fotoOnu'))

                console.log(salida)

                //Variable para crear la expresión regular que evauará la respuesta
                const ExpRegSerialEquipo = new RegExp("SN[a-zA-Z0-9:]{4,}|Serial:[ a-zA-Z0-9]{4,}", "i")
                const ExpRegMacEquipo = new RegExp("MAC[ a-zA-Z0-9:]{4,}", "i")
                const ExpRegModeloEquipo = new RegExp("Model[a-zA-Z0-9- :]{2,}", "i")

                //Guardar en una variable de estado el nombre del archivo del comprobante
                ctxFn.state.update({ModeloEquipo: salida.match(ExpRegModeloEquipo)[0].replace('Modelo', '').replace('Model', '').replaceAll(':', '').replaceAll(' ', '')})

                //Guardar en una variable de estado el nombre del archivo del comprobante
                ctxFn.state.update({SerialEquipo: salida.match(ExpRegSerialEquipo)[0].replace('Serial:', '').replace('SN:', '').replaceAll(' ', '')})

                //Guardar en una variable de estado el nombre del archivo del comprobante
                ctxFn.state.update({MacEquipo: salida.match(ExpRegMacEquipo)[0].replace('MAC:', '').replace('MAC ', '').replaceAll(' ', '')})

                //Instanciar un elemento
                const elemento = require('../Funciones/elemento.js')
                const articulo = require('../Funciones/articulo.js')

                //Buscar el elemento en la base de datos
                let datosElemento = await elemento.obtenerElemento(ctxFn.state.get('MacEquipo'), ctxFn.state.get('SerialEquipo'))

                //console.log(JSON.stringify(datosElemento))

                //Si la consulta arrojó resultados
                if(Object.keys(datosElemento.data).length > 0){

                    console.log('Si se encontró el elemento')

                }
                else{

                    console.log('No se encontró el elemento')
                    console.log('Lo voy a crear')
                    articulo.obtenerArticulo('', '', '', '', '', ctxFn.state.get('ModeloEquipo'))


                }

                //console.log(JSON.stringify(datosElemento))

                // console.log(ctxFn.state.get('SerialEquipo'))
                // console.log(ctxFn.state.get('MacEquipo'))
                

            }
            else if(ExpRegRespuestaCancelar.test(ctx.body) == true){
                
                //Iniciar el temporizador de espera de respuesta del cliente
                temporizador.detenerTemporizador(ctx)
                
                //Ir al flujo de escaneo del comprobante
                ctxFn.gotoFlow(require('./flujoNoTengoRespuesta.js'), 1)

            }
            else{

                //Solicitar una respuesta valida
                return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.MENSAJE_NUEVO_CLIENTE_TECNOLOGIA)
                
            }
            
        } catch (error) {

            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación en el flujo flujoNuevoCliente, el sistema respondió: ' + error)

        }

        //Iniciar el temporizador de espera de respuesta del cliente
        temporizador.detenerTemporizador(ctx)
        temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAsistente/flujoNoTengoRespuesta')

    })
    