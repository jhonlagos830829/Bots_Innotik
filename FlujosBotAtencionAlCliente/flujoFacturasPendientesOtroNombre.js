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
const cliente = require('../Funciones/cliente.js')
const clientesConsultados = JSON.parse('{"datos":[]}')
const crm = require('../Funciones/crm.js')
const { constants } = require('node:buffer')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

//const flujoFacturasPendientesOtroNombre = require('./flujoReportarFallaTipoFalla')

////////////////////////////////////////////////////////////////////////////////

const ExpRegFlujo = '/^2$/gmi'
const ExpRegRespuestas = new RegExp("[a-z]{4,}", "i")

module.exports = flujoFacturasPendientesOtroNombre = addKeyword('ExpRegFlujo, { regex: true }')
    .addAnswer(mensajes.MENSAJE_FACTURAS_PENDIENTES_POR_PAGAR_OTRO_TITULAR, {capture:true}, async (ctx, ctxFn) => {
        
        //Intentar
        try {

            //Evaluar si el usuario envió una nota de voz
            if(ctx.body.includes('event_voice_note')==true){

                //Informar al cliente que en el momento no se pueden procesar sus notas de voz
                await ctxFn.flowDynamic(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)
                
                //Hacer una pausa de 2 segundos
                await delay(1000)

                //Retorar la respuesta a opción incorrecta
                return ctxFn.fallBack(mensajes.MENSAJE_FACTURAS_PENDIENTES_POR_PAGAR_OTRO_TITULAR)
                
            }
            else if(ExpRegRespuestas.test(ctx.body) == false){

                //Solicitar una respuesta valida
                return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.MENSAJE_FACTURAS_PENDIENTES_POR_PAGAR_OTRO_TITULAR)
                
            }
            else{
                
                //Eliminar los datos consultados anteriormente por el número que escribe
                for (const consultadosCliente of clientesConsultados.datos){

                    //Si dentro de la lista hay datos del usuario que inicia a conversacion
                    if (consultadosCliente["consultor"] == ctx.from){

                        //Eliminar los datos de pedidos anteriores del cliente
                        clientesConsultados.datos.splice(consultadosCliente, 1)
    
                    }
                    
                }

                //Armar la estructura de datos donde se almacenarán los clientes consultados identificados por el número que escribe
                clientesConsultados.datos.push({consultor: ctx.from, clientes: []})

                //Buscar el cliente por el nombre proporcionado
                let clientes = await cliente.obtenerCliente('', ctx.body, '')

                //Si la consulta arrojó resultados
                if (Object.keys(clientes.data).length == 0){

                    //Enviar el mensaje de resumen de las clientes
                    await ctxFn.fallBack(mensajes.MENSAJE_CLIENTE_NO_ENCONTRADO)

                }
                else if (Object.keys(clientes.data).length == 1){

                    //Filtrar la estructura de datos a patir del número que escribe
                    let consultados = clientesConsultados.datos.filter(clientes => clientes.consultor === ctx.from)

                    //Variables para el mensaje de resumen
                    let posicion = 1
                    let posicionElegir = ''

                    //Agregar a la lista de clientes consultados el cliente actual
                    consultados[0].clientes.push({posicion: posicion, id: clientes.data[0].id, identificacion: clientes.data[0].attributes.identificacion, nombre: clientes.data[0].attributes.nombre/*, idCuenta: datosCliente.attributes.cuenta.id*/})

                    //Agregar las opciones para que acepte Si o No en la expresion regular
                    posicionElegir = posicionElegir + '^S[íiÍI]$|^N[oOóÓ]$'

                    //Guardar en el estado de la conversación los valores para la expresión regular que evalue la opción seleccionada
                    ctxFn.state.update({posicionElegir: posicionElegir})

                    //Guardar en el estado el mensaje enviado para reenviarlo en el siguiente fallbask en caso de no responder correctamente
                    ctxFn.state.update({mensajePreguntaActual: mensajes.MENSAJE_TITULAR_ENCONTRADO.replace("{NOMBRE_CLIENTE}", clientes.data[0].attributes.nombre)})

                    //Enviar el mensaje de resumen de las clientes
                    await ctxFn.flowDynamic(mensajes.MENSAJE_TITULAR_ENCONTRADO.replace("{NOMBRE_CLIENTE}", clientes.data[0].attributes.nombre))

                }
                else{

                    //Filtrar la estructura de datos a patir del número que escribe
                    let consultados = clientesConsultados.datos.filter(clientes => clientes.consultor === ctx.from)

                    //Variables para el mensaje de resumen
                    let posicion = 1
                    let resumenClientes = ''
                    let posicionElegir = ''

                    //Recorrer la lista de clientes consultados
                    for (let datosCliente of clientes.data){

                        //Reinicializar la variable que contendrá los clientes consultados con los que se realizará la expresión regular
                        posicionElegir = posicionElegir + '^' + posicion + '$|'

                        //Armar el exto de resumen
                        resumenClientes = resumenClientes + '👉🏼  *' + posicion + '* ' + datosCliente.attributes.nombre + '\n'

                        //Agregar a la lista de clientes consultados el cliente actual
                        consultados[0].clientes.push({posicion: posicion, identificacion: datosCliente.attributes.identificacion, nombre: datosCliente.attributes.nombre})

                        //Incrementar la posición
                        posicion = posicion + 1

                    }

                    //Agregar las opciones para que acepte No o Ninguno en la expresion regular
                    posicionElegir = posicionElegir + '^N[oOóÓ]$|Ning[uUúÚnoa]+'

                    //Guardar en el estado de la conversación los valores para la expresión regular que evalue la opción seleccionada
                    ctxFn.state.update({posicionElegir: posicionElegir})

                    //Guardar en el estado el mensaje enviado para reenviarlo en el siguiente fallbask en caso de no responder correctamente
                    ctxFn.state.update({mensajePosiciones: resumenClientes.substring(0, resumenClientes.length - 1)})

                    //Guardar en el estado el mensaje enviado para reenviarlo en el siguiente fallbask en caso de no responder correctamente
                    ctxFn.state.update({mensajePreguntaActual: mensajes.MENSAJE_CUAL_ES_TITULAR_SERVICIO.replace('{LISTA_CLIENTES}', resumenClientes.substring(0, resumenClientes.length - 1))})

                    //Enviar el mensaje de resumen de las clientes
                    await ctxFn.flowDynamic(mensajes.MENSAJE_CUAL_ES_TITULAR_SERVICIO.replace('{LISTA_CLIENTES}', resumenClientes.substring(0, resumenClientes.length - 1)))

                }

            }

        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoFacturasPendientesOtroNombre, el sistema respondió: ' + error)

        }
        
        //Iniciar el temporizador de espera de respuesta del cliente
        temporizador.detenerTemporizador(ctx)
        temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAtencionAlCliente/flujoNoTengoRespuestaAtencionAlCliente')

    })
    .addAction({capture:true}, async (ctx, ctxFn) => {
        
        //Intentar
        try {
            
            //Expresiones regulares a usar
            const ExpRegEleccionCliente = new RegExp(ctxFn.state.get('posicionElegir'), "i")
            const ExpRegSi = new RegExp("^S[íiÍI]$", "i")
            const ExpRegNinguno = new RegExp('^N[oOóÓ]$|Ning[uUúÚnoa]+', "i")

            //Evaluar si el usuario envió una nota de voz
            if(ctx.body.includes('event_voice_note')==true){

                //Informar al cliente que en el momento no se pueden procesar sus notas de voz
                await ctxFn.flowDynamic(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)
                
                //Hacer una pausa de 2 segundos
                await delay(1000)

                //Retorar la respuesta a opción incorrecta
                return ctxFn.fallBack(ctxFn.state.get('mensajePreguntaActual'))
                
            }
            else if(ExpRegEleccionCliente.test(ctx.body) == false){

                //Solicitar una respuesta valida
                return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + ctxFn.state.get('mensajePreguntaActual'))
                
            }
            else{
                
                //Si la respuesta del cliente es diferente a ninguno
                if(ExpRegNinguno.test(ctx.body) == false){
                    
                    //Declaración de variable local
                    var clienteElegido

                    //Si el técnico eligió el único titular resutante de la búsqueda
                    if(ExpRegSi.test(ctx.body) == true){

                        //Informar al cliente que espere un momento que va a consultar el sistema
                        await ctxFn.flowDynamic(mensajes.MENSAJE_FACTURAS_PENDIENTES_CONSULTANDO)

                        //Hacer una pausa de 1 segundo
                        await delay(1000)

                        //Obtener los clientes consultados por el número
                        let todoConsultado = clientesConsultados.datos.filter(clientes => clientes.consultor === ctx.from)

                        //Obtener el cliente elegido
                        clienteElegido = todoConsultado[0].clientes[0]

                    }
                    else if(ExpRegNinguno.test(ctx.body) == false){

                        //Informar al cliente que espere un momento que va a consultar el sistema
                        await ctxFn.flowDynamic(mensajes.MENSAJE_FACTURAS_PENDIENTES_CONSULTANDO)
                        
                        //Hacer una pausa de 1 segundo
                        await delay(1000)

                        //Obtener los clientes consultados por el número
                        let todoConsultado = clientesConsultados.datos.filter(clientes => clientes.consultor === ctx.from)

                        //Obtener el cliente elegido
                        clienteElegido = todoConsultado[0].clientes.find(cliente => cliente.posicion == ctx.body)

                    }
                
                    //Consultar al CRM las facturas del cliente
                    let facturas = await crm.ObtenerFacturasCliente(clienteElegido.identificacion)
                    let resumenFacturas = ''
                    let tieneFacturasPorPagar = false
                    let deudaTotal = 0

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
                            resumenFacturas = resumenFacturas + '\n\nValor: *' + parseInt(factura.total).toLocaleString("es-CO", {style: "currency", currency: "COP", minimumFractionDigits: 0, maximumFractionDigits: 0,}) + '*\n\n'

                            //Sumar al valor total adeudado
                            deudaTotal = deudaTotal + factura.total

                        }
                        
                    }

                    //Agregar al resumen el valor total adeudado
                    resumenFacturas = resumenFacturas + '*Valor total a pagar: ' + parseInt(deudaTotal).toLocaleString("es-CO", {style: "currency", currency: "COP", minimumFractionDigits: 0, maximumFractionDigits: 0,}) + '*'

                    //Si tiene facturas pendientes por pagar
                    if(tieneFacturasPorPagar == true){

                        //Enviar mensaje de notificación de las facturas pendientes por pagar
                        await ctxFn.flowDynamic(mensajes.MENSAJE_FACTURAS_PENDIENTES_POR_PAGAR.replace('{NOMBRE_CLIENTE}', clienteElegido.nombre))

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
                    
                    //Ir al flujo de despedida
                    ctxFn.gotoFlow(require('./flujoAlgoMasAtencionAlCliente.js'))

                }
                else{

                    //Ir al flujo de despedida
                    ctxFn.gotoFlow(require('./flujoFacturasPendientesOtroNombre.js'))
                    
                }
                

            }

        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoFacturasPendientesOtroNombre, el sistema respondió: ' + error)

        }

    })