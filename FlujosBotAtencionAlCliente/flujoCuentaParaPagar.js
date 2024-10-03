const {addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const { delay, downloadMediaMessage } = require('@whiskeysockets/baileys');
const { writeFile } = require("node:fs/promises")
const path = require('path')
const { createWorker } = require('tesseract.js')
const fs = require('fs')
require('dotenv').config()

//////////////////////////////////////// FUNCIONES ELABORADAS

const temporizador = require('../Funciones/temporizador.js')
const mensajes = require('../Configuracion/botAtencionAlCliente/mensajes.js')
const crm = require('../Funciones/crm.js')
const { constants } = require('node:buffer')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN


////////////////////////////////////////////////////////////////////////////////

const ExpRegFlujo = '/^2$/gmi'

module.exports = flujoCuentaParaPagar = addKeyword(ExpRegFlujo, { regex: true })
    .addAction({capture:false}, async (ctx, ctxFn) => {
        
        //Intentar
        try {
            
            //Si se encontró registrado el número que escribe en la base de datos
            if(ctxFn.state.get('identificacion') === undefined){

                //Pasar el nombre del proceso al siguiente flujo
                ctxFn.state.update({proceso: 'ConsultaCuentas'})
                    
                //Iniciar el temporizador de espera de respuesta del cliente
                temporizador.detenerTemporizador(ctx)
                temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAtencionAlCliente/flujoNoTengoRespuestaAtencionAlCliente')

                //Ir al flujo de despedida
                ctxFn.gotoFlow(require('./flujoNumeroNoRegistrado.js'))

            }
            else{
                
                //Variable para obtener el resumen de la cuenta
                let resumenCuenta = 'Banco: *' + ctxFn.state.get('cuentaBanco') + '* \nTipo: ' + ctxFn.state.get('cuentaTipo') + '\nNúmero: *' + ctxFn.state.get('cuentaNumero').slice(0, 3) + ' ' + ctxFn.state.get('cuentaNumero').slice(3, 6) + ' ' + ctxFn.state.get('cuentaNumero').slice(6) + '* \nNombre: ' + ctxFn.state.get('cuentaTitular') + '\nIdentificación: ' + ctxFn.state.get('cuentaIdentificacion')

                //Informar al cliente que en el momento no se pueden procesar sus notas de voz
                await ctxFn.flowDynamic(mensajes.MENSAJE_CUENTA_PAGAR.replace('{NOMBRE_CLIENTE}', ctxFn.state.get('nombre')) + '\n\n' + resumenCuenta)
                
                //Iniciar el temporizador de espera de respuesta del cliente
                temporizador.detenerTemporizador(ctx)
                temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAtencionAlCliente/flujoNoTengoRespuestaAtencionAlCliente')

                //Ir al flujo de despedida
                ctxFn.gotoFlow(require('./flujoAlgoMasAtencionAlCliente.js'))
                
            }

        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoTipoFalla, el sistema respondió: ' + error)

        } 

    })
