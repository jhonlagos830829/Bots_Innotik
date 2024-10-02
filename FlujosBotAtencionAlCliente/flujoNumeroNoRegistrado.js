const {addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const { delay, downloadMediaMessage } = require('@whiskeysockets/baileys');
const { writeFile } = require("node:fs/promises")
const path = require('path')
const { createWorker } = require('tesseract.js')
const fs = require('fs')
require('dotenv').config()

//////////////////////////////////////// FUNCIONES ELABORADAS

const mensajes = require('../Configuracion/botAtencionAlCliente/mensajes.js')
const temporizador = require('../Funciones/temporizador.js')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

//const flujoTipoFalla = require('./flujoReportarFallaTipoFalla')

////////////////////////////////////////////////////////////////////////////////

const ExpRegFlujo = '/[2]{1}/gmi'
const ExpRegRespuestas = new RegExp("^S[íiÍI]$|^N[oOóÓ]$", "i")
const ExpRegRespuestaSi = new RegExp("^S[íiÍI]$", "i")
const ExpRegRespuestaNo = new RegExp("^N[oOóÓ]$", "i")

module.exports = flujoNumeroNoRegistrado = addKeyword('ExpRegFlujo, { regex: true }')
    .addAnswer(mensajes.MENSAJE_NUMERO_NO_REGISTRADO, {capture:true}, async (ctx, ctxFn) => {
        
        //Intentar
        try {

            //Evaluar si el usuario envió una nota de voz
            if(ctx.body.includes('event_voice_note')==true){

                //Informar al cliente que en el momento no se pueden procesar sus notas de voz
                await ctxFn.flowDynamic(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)
                
                //Hacer una pausa de 2 segundos
                await delay(1000)

                //Retorar la respuesta a opción incorrecta
                return ctxFn.fallBack(mensajes.MENSAJE_NUMERO_NO_REGISTRADO)
                
            }
            else if(ExpRegRespuestas.test(ctx.body) == false){

                //Solicitar una respuesta valida
                return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.MENSAJE_NUMERO_NO_REGISTRADO)
                
            }
            else{

                //Si el cliente respondió Sí
                if(ExpRegRespuestaSi.test(ctx.body) == true){
                    
                    //Iniciar el temporizador de espera de respuesta del cliente
                    temporizador.detenerTemporizador(ctx)
                    temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAtencionAlCliente/flujoNoTengoRespuestaAtencionAlCliente')

                    //Si el proceso
                    if(ctxFn.state.get('proceso') == 'ConsultaFacturas'){
                        
                        //Ir al flujo principal
                        ctxFn.gotoFlow(require('./flujoFacturasPendientesOtroNombre.js'))
                    
                    }
                    if(ctxFn.state.get('proceso') == 'ConsultaCuentas'){
                        
                        //Ir al flujo principal
                        ctxFn.gotoFlow(require('./flujoCuentaParaPagarOtroNombre.js'))
                    
                    }
                    
                }
                
                //Si el cliente respondió No
                if(ExpRegRespuestaNo.test(ctx.body) == true){
                    
                    //Iniciar el temporizador de espera de respuesta del cliente
                    temporizador.detenerTemporizador(ctx)
                    temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAtencionAlCliente/flujoNoTengoRespuestaAtencionAlCliente')
                    
                    //Ir al flujo principal
                    ctxFn.gotoFlow(require('./flujoAlgoMasAtencionAlCliente.js'))
                    
                }
                
            }

        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoTipoFalla, el sistema respondió: ' + error)

        }
        
    })