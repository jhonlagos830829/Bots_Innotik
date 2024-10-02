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

const ExpRegFlujo = '/[1]{1}/gmi'

module.exports = flujoFacturasPendientesNombrePropio = addKeyword('ExpRegFlujo, { regex: true }')
    .addAction({capture:false}, async (ctx, ctxFn) => {
        
        //Intentar
        try {
            
            //Si se encontró registrado el número que escribe en la base de datos
            if(ctxFn.state.get('identificacion') === undefined){

                //Pasar el nombre del proceso al siguiente flujo
                ctxFn.state.update({proceso: 'ConsultaFacturas'})
                    
                //Iniciar el temporizador de espera de respuesta del cliente
                temporizador.detenerTemporizador(ctx)
                temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAtencionAlCliente/flujoNoTengoRespuestaAtencionAlCliente')

                //Ir al flujo de despedida
                ctxFn.gotoFlow(require('./flujoNumeroNoRegistrado.js'))

            }
            else{
                
                //Consultar al CRM las facturas del cliente
                let facturas = await crm.ObtenerFacturasCliente(ctxFn.state.get('identificacion'))
                let resumenFacturas = ''
                let tieneFacturasPorPagar = false

                //Recorrer la lista de facturas devuelta
                for (let factura of facturas){

                    //Si el estado de la factura es no pagado
                    if(factura.status == '1'){
                        
                        //Si tiene facturas pendientes por pagar
                        tieneFacturasPorPagar = true

                        //Armar el mensaje de las facturas
                        resumenFacturas = resumenFacturas + 'Factura: *' + factura.number + '*\n'

                        //Recorrer los items de la factura
                        for (let item of factura.items){

                            //Obtener la descripción de los servicios
                            resumenFacturas = resumenFacturas + '\n- ' + item.label

                        }

                        //Finalizar el armado del mensaje
                        resumenFacturas = resumenFacturas + '\n\nTotal: *' + parseInt(factura.total).toLocaleString("es-CO", {style: "currency", currency: "COP", minimumFractionDigits: 0, maximumFractionDigits: 0,}) + '*\n'

                    }
                    
                }

                //Si tiene facturas pendientes por pagar
                if(tieneFacturasPorPagar == true){

                    //Enviar mensaje de notificación de las facturas pendientes por pagar
                    await ctxFn.flowDynamic(mensajes.MENSAJE_FACTURAS_PENDIENTES_POR_PAGAR.replace('{NOMBRE_CLIENTE}', ctxFn.state.get('nombre')))

                    //Hacer una pausa de 1 segundo
                    await delay(1000)

                    //Enviar el mensaje de resumen de las factuas
                    await ctxFn.flowDynamic(resumenFacturas)
                
                }
                else{
                    
                    //Enviar el mensaje de resumen de las factuas
                    await ctxFn.flowDynamic(mensajes.MENSAJE_NO_FACTURAS_PENDIENTES_POR_PAGAR)
                    
                    //Hacer una pausa de 1 segundo
                    await delay(1000)
                
                }
                
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
