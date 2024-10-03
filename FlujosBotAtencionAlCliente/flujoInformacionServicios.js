const {addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const { delay, downloadMediaMessage } = require('@whiskeysockets/baileys');
// const { writeFile } = require("node:fs/promises")
// const path = require('path')
// const { createWorker } = require('tesseract.js')
// const fs = require('fs')
require('dotenv').config()

//////////////////////////////////////// FUNCIONES ELABORADAS

const mensajes = require('../Configuracion/botAtencionAlCliente/mensajes.js')
const temporizador = require('../Funciones/temporizador.js')
const cliente = require('../Funciones/cliente.js')
// const { constants } = require('node:buffer')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

const flujoFacturasPendientes = require('./flujoFacturasPendientes.js')
const flujoCuentaParaPagar = require('./flujoCuentaParaPagar.js')

////////////////////////////////////////////////////////////////////////////////

const ExpRegFlujo = '/^4$/gmi'
const ExpRegRespuesta = new RegExp("[a-zA-ZñÑáéíóúÁÉÍÓÚ ]{6,}", "i")

module.exports = flujoInformacionServicios = addKeyword(ExpRegFlujo, { regex: true })
    .addAnswer(mensajes.MENSAJE_SERVICIOS_PRESTADOS, {capture:true}, async (ctx, ctxFn) => {
        
        //Registrar el inicio de la conversación
        try {

            //Evaluar si el usuario envió una nota de voz
            if(ctx.body.includes('event_voice_note')==true){

                //Informar al cliente que en el momento no se pueden procesar sus notas de voz
                await ctxFn.flowDynamic(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)
                
                //Hacer una pausa de 2 segundos
                await delay(1000)

                //Retorar la respuesta a opción incorrecta
                return ctxFn.fallBack(mensajes.MENSAJE_SERVICIOS_PRESTADOS)
                
            }
            else if(ExpRegRespuesta.test(ctx.body) == false){

                //Solicitar una respuesta valida
                return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.MENSAJE_SERVICIOS_PRESTADOS)
                
            }
            else{

                //Solicitar una respuesta valida
                ctxFn.state.update({nombreClienteInformacion: ctx.body})

            }
            
        } catch (error) {

            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación en el flujo flujoFalla, el sistema respondió: ' + error)

        }
        
        //Iniciar el temporizador de espera de respuesta del cliente
        temporizador.detenerTemporizador(ctx)
        temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAtencionAlCliente/flujoNoTengoRespuestaAtencionAlCliente')

    })
    .addAnswer(mensajes.MENSAJE_TEMAS_ATENCION_AL_CLIENTE, {capture:true, delay:1000}, async (ctx, ctxFn) => {

        //Registrar el inicio de la conversación
        try {

            //Evaluar si el usuario envió una nota de voz
            if(ctx.body.includes('event_voice_note')==true){

                //Informar al cliente que en el momento no se pueden procesar sus notas de voz
                await ctxFn.flowDynamic(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)
                
                //Hacer una pausa de 2 segundos
                await delay(1000)

                //Retorar la respuesta a opción incorrecta
                return ctxFn.fallBack(mensajes.MENSAJE_TEMAS_ATENCION_AL_CLIENTE)
                
            }
            else if(ExpRegRespuestas.test(ctx.body) == false){

                //Solicitar una respuesta valida
                return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.MENSAJE_TEMAS_ATENCION_AL_CLIENTE)
                
            }
            
        } catch (error) {

            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación en el flujo flujoFalla, el sistema respondió: ' + error)

        }
        
        //Iniciar el temporizador de espera de respuesta del cliente
        temporizador.detenerTemporizador(ctx)
        temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAtencionAlCliente/flujoNoTengoRespuestaAtencionAlCliente')

    }, [flujoFacturasPendientes, flujoCuentaParaPagar])
