const {addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const { delay, downloadMediaMessage } = require('@whiskeysockets/baileys');
const { writeFile } = require("node:fs/promises")
const path = require('path')
const { createWorker } = require('tesseract.js')
const fs = require('fs')
require('dotenv').config()

//////////////////////////////////////// FUNCIONES ELABORADAS

//const registrarConversacion = require('../Funciones/registrarConversacion.js')
const mensajes = require('../Configuracion/botAtencionAlCliente/mensajes.js')
const crm = require('../Funciones/crm.js')
const { constants } = require('node:buffer')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

const flujoFacturasPendientesNombrePropio = require('./flujoFacturasPendientesNombrePropio')
const flujoFacturasPendientesOtroNombre = require('./flujoFacturasPendientesOtroNombre')

////////////////////////////////////////////////////////////////////////////////

const ExpRegFlujo = '/[1]{1}/gmi'
const ExpRegRespuestas = new RegExp("[1-2]{1}", "i")
const ExpRegRespuestaUno = new RegExp("[1]{1}", "i")
const ExpRegRespuestaDos = new RegExp("[2]{1}", "i")

module.exports = flujoFacturasPendientes = addKeyword(ExpRegFlujo, { regex: true })
    .addAnswer(mensajes.MENSAJE_FACTURAS_PENDIENTES_A_NOMBRE, {capture:true}, async (ctx, ctxFn) => {
        
        //Intentar
        try {

            //Evaluar si el usuario envió una nota de voz
            if(ctx.body.includes('event_voice_note')==true){

                //Informar al cliente que en el momento no se pueden procesar sus notas de voz
                await ctxFn.flowDynamic(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)
                
                //Hacer una pausa de 2 segundos
                await delay(1000)

                //Retorar la respuesta a opción incorrecta
                return ctxFn.fallBack(mensajes.MENSAJE_FACTURAS_PENDIENTES_A_NOMBRE)
                
            }
            else if(ExpRegRespuestas.test(ctx.body) == false){

                //Solicitar una respuesta valida
                return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.MENSAJE_FACTURAS_PENDIENTES_A_NOMBRE)
                
            }
            else if(ExpRegRespuestaUno.test(ctx.body) == true){

                //Ir al flujo de despedida
                ctxFn.gotoFlow(require('./flujoFacturasPendientesNombrePropio.js'))

            }
            else if(ExpRegRespuestaDos.test(ctx.body) == true){

                //Ir al flujo de despedida
                ctxFn.gotoFlow(require('./flujoFacturasPendientesOtroNombre.js'))

            }

        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoTipoFalla, el sistema respondió: ' + error)

        } 

    }/*, [flujoFacturasPendientesNombrePropio, flujoFacturasPendientesOtroNombre]*/)