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
const cliente = require('../Funciones/cliente.js')
const cuentaBancaria = require('../Funciones/cuenta.js')
const movimiento = require('../Funciones/movimiento.js')
const configuracion = require('../Configuracion/configuracion.js')
const fechas = require('../Funciones/fechas.js')
const temporizador = require('../Funciones/temporizador.js')
const { constants } = require('node:buffer')
const { ESLint } = require('eslint')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

//const flujoTipoFalla = require('./flujoReportarFallaTipoFalla')

////////////////////////////////////////////////////////////////////////////////

const clientesConsultados = JSON.parse('{"datos":[]}')
const ExpRegFlujo = '/[1]{1}/gmi'
const ExpRegRespuestas = new RegExp("^S[íiÍ]|^N[oóÓ]", "i")
const ExpRegRespuestaNo = new RegExp("^N[oóÓ]", "i")
const ExpRegRespuestaSi = new RegExp("^S[íiÍ]", "i")
const ExpRegRespuestasTitular = new RegExp("[a-zA-ZñÑáéíóúÁÉÍÓÚ ]{3,}", "i")
const ExpRegRespuestasMismo = new RegExp("^S[íiÍ]", "i")
const ExpRegRespuestasOtro = new RegExp("[a-zA-ZñÑáéíóúÁÉÍÓÚ ]{3,}", "i")
var nombreArchivo = ''
let primerNombre
let idClientePago

module.exports = flujoReportarPagoCliente = addKeyword('ExpRegFlujo, { regex: true }')
    .addAnswer(mensajes.MENSAJE_COMPROBANTE_NOMBRE_TITULAR, {capture:true}, async (ctx, ctxFn) => {

        //Registrar el inicio de la conversación
        try {

            //Evaluar si el usuario envió una nota de voz
            if(ctx.body.includes('event_voice_note')==true){

                //Informar al cliente que en el momento no se pueden procesar sus notas de voz
                await ctxFn.flowDynamic(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)
                
                //Retorar la respuesta a opción incorrecta
                return ctxFn.fallBack(mensajes.MENSAJE_COMPROBANTE_NOMBRE_TITULAR)
                
            }
            else if(ExpRegRespuestasTitular.test(ctx.body) == false){

                //Solicitar una respuesta valida
                return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.MENSAJE_COMPROBANTE_NOMBRE_TITULAR)
                
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
                
                //Si la consulta no arrojó resultados
                if (Object.keys(clientes.data).length == 0){

                    //Enviar el mensaje de cliente no encontrado
                    await ctxFn.fallBack(mensajes.MENSAJE_CLIENTE_NO_ENCONTRADO)

                }
                else if (Object.keys(clientes.data).length == 1){
                    
                    //Filtrar la estructura de datos a patir del número que escribe
                    let consultados = clientesConsultados.datos.filter(clientes => clientes.consultor === ctx.from)

                    //Variables para el mensaje de resumen
                    let posicion = 1
                    let resumenMensaje = ''
                    let posicionElegir = ''

                    //Mensaje a enviar
                    resumenMensaje = mensajes.MENSAJE_TITULAR_ENCONTRADO.replace("{NOMBRE_CLIENTE}", clientes.data[0].attributes.nombre)

                    //Agregar a la lista de clientes consultados el cliente actual
                    consultados[0].clientes.push({posicion: posicion, id: clientes.data[0].id, identificacion: clientes.data[0].attributes.identificacion, nombre: clientes.data[0].attributes.nombre/*, idCuenta: datosCliente.attributes.cuenta.id*/})

                    //Agregar las opciones para que acepte Si o No en la expresion regular
                    posicionElegir = posicionElegir + '^S[íiÍI]$|^N[oOóÓ]$'

                    //Guardar en el estado de la conversación los valores para la expresión regular que evalue la opción seleccionada
                    ctxFn.state.update({posicionElegir: posicionElegir})

                    //Guardar en el estado el mensaje enviado para reenviarlo en el siguiente fallbask en caso de no responder correctamente
                    ctxFn.state.update({mensajePreguntaActual: resumenMensaje})

                    //Enviar el mensaje de resumen de las clientes
                    await ctxFn.flowDynamic(resumenMensaje)

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

                        //Armar el texto de resumen de los clientes encontrados
                        resumenClientes = resumenClientes + '👉🏼  *' + posicion + '* ' + datosCliente.attributes.nombre + '\n'

                        //Agregar a la lista de clientes consultados el cliente actual
                        consultados[0].clientes.push({posicion: posicion, id: datosCliente.id, identificacion: datosCliente.attributes.identificacion, nombre: datosCliente.attributes.nombre/*, idCuenta: datosCliente.attributes.cuenta.id*/})

                        //Incrementar la posición
                        posicion = posicion + 1

                    }

                    //Agregar las opciones para que acepte No o Ninguno en la expresion regular
                    posicionElegir = posicionElegir + '^N[oOóÓ]$|Ning[uUúÚnoa]+'

                    //Guardar en el estado de la conversación los valores para la expresión regular que evalue la opción seleccionada
                    ctxFn.state.update({posicionElegir: posicionElegir})

                    //Guardar en el estado el mensaje enviado para reenviarlo en el siguiente fallbask en caso de no responder correctamente
                    ctxFn.state.update({mensajePreguntaActual: mensajes.MENSAJE_CUAL_ES_TITULAR_SERVICIO.replace('{LISTA_CLIENTES}', resumenClientes.substring(0, resumenClientes.length - 1))})

                    //Enviar el mensaje de resumen de las clientes
                    await ctxFn.flowDynamic(mensajes.MENSAJE_CUAL_ES_TITULAR_SERVICIO.replace('{LISTA_CLIENTES}', resumenClientes.substring(0, resumenClientes.length - 1)))

                }

            }
            
            //Iniciar el temporizador de espera de respuesta del cliente
            temporizador.detenerTemporizador(ctx)
            temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAsistente/flujoNoTengoRespuesta')

        } catch (error) {

            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación en el flujo flujoReportarPagoCliente, el sistema respondió: ' + error)

        }

    })
    .addAction({capture:true}, async (ctx, ctxFn) => {

        //Variables para las expresiones regulares que evaluaran la respuesta
        const ExpRegClienteElegido = new RegExp(ctxFn.state.get('posicionElegir'), "i")
        const ExpRegSi = new RegExp("^S[íiÍI]$", "i")
        const ExpRegNinguno = new RegExp("^N[oOóÓ]$|Ning[uUúÚnoa]+", "i")

        //Registrar el inicio de la conversación
        try {

            //Evaluar si el usuario envió una nota de voz
            if(ctx.body.includes('event_voice_note')==true){

                //Informar al cliente que en el momento no se pueden procesar sus notas de voz
                await ctxFn.flowDynamic(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)
                
                //Hacer una pausa de 2 segundos
                await delay(1000)

                //Retorar la respuesta a opción incorrecta
                return ctxFn.fallBack(ctxFn.state.get('mensajePreguntaActual'))
                
            }
            else if(ExpRegClienteElegido.test(ctx.body) == false){

                //Solicitar una respuesta valida
                return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + ctxFn.state.get('mensajePreguntaActual'))
                
            }
            else{

                //Si el técnico eligió el único titular resutante de la búsqueda
                if(ExpRegSi.test(ctx.body) == true){

                    //Obtener los clientes consultados por el número
                    let todoConsultado = clientesConsultados.datos.filter(clientes => clientes.consultor === ctx.from)

                    //console.log('todo lo consultado ' + JSON.stringify(todoConsultado))
                    
                    //Obtener el id del cliente al cual pertenece el pago
                    idClientePago = todoConsultado[0].clientes[0].id
                    
                    //Guardar en la variable de estado el id del cliente al cual se le cagará el pago
                    ctxFn.state.update({idCliente: todoConsultado[0].clientes[0].id})
                    
                    //Guardar en la variable de estado el nombre del cliente al cual se debe cargar el pago
                    ctxFn.state.update({nombreClientePago: todoConsultado[0].clientes[0].nombre})
                    
                }
                else if(ExpRegNinguno.test(ctx.body) == false){

                    //Obtener los clientes consultados por el número
                    let todoConsultado = clientesConsultados.datos.filter(clientes => clientes.consultor === ctx.from)

                    //Obtener el cliente elegido
                    const clienteElegido = todoConsultado[0].clientes.find(cliente => cliente.posicion == ctx.body)
                    
                    //Obtener el id del cliente al cual pertenece el pago
                    idClientePago = clienteElegido.id
                    
                    //Guardar en la variable de estado el id del cliente al cual se le cagará el pago
                    ctxFn.state.update({idCliente: clienteElegido.id})
                    
                    //Guardar en la variable de estado el nombre del cliente al cual se debe cargar el pago
                    ctxFn.state.update({nombreClientePago: clienteElegido.nombre})
                    
                    // //Iniciar el temporizador de espera de respuesta del cliente
                    // temporizador.detenerTemporizador(ctx)
                    // temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAtencionAlCliente/flujoNoTengoRespuestaAtencionAlCliente', mensajes.MENSAJE_SIN_DATOS_NECESARIOS)
                    
                    // //Ir al flujo de escaneo del comprobante
                    // ctxFn.gotoFlow(require('./flujoReportePagoEscaneoComprobante.js'))

                }
                else{

                    //Ir al flujo de despedida
                    ctxFn.gotoFlow(require('./flujoReportePagoDiferenteTitular.js'))
                    
                }

            }
            
        } catch (error) {

            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación en el flujo flujoReportarPagoCliente, el sistema respondió: ' + error)

        }

        //Iniciar el temporizador de espera de respuesta del cliente
        temporizador.detenerTemporizador(ctx)
        temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAsistente/flujoNoTengoRespuesta')

    })
    .addAnswer(mensajes.MENSAJE_VALOR_PAGADO, {capture:true}, async (ctx, ctxFn) => {

        //Variable para crear la expresión regular que evauará la respuesta
        const ExpRegValorPagado = new RegExp("^[0-9]{4,}$", "i")
        // const ExpRegConfirmarPagoSi = new RegExp("^S[íiÍ]", "i")
        // const ExpRegConfirmarPagoNo = new RegExp("^N[oóÓ]", "i")

        //Registrar el inicio de la conversación
        try {

            //Evaluar si el usuario envió una nota de voz
            if(ctx.body.includes('event_voice_note')==true){

                //Informar al cliente que en el momento no se pueden procesar sus notas de voz
                await ctxFn.flowDynamic(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)
                
                //Hacer una pausa de 2 segundos
                await delay(1000)

                //Retorar la respuesta a opción incorrecta
                return ctxFn.fallBack(mensajes.MENSAJE_VALOR_PAGADO)
                
            }
            else if(ExpRegValorPagado.test(ctx.body) == false){

                //Solicitar una respuesta valida
                return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.MENSAJE_VALOR_PAGADO)
                
            }
            else{
                
                //Guardar en el estado el mensaje enviado para reenviarlo en el siguiente fallbask en caso de no responder correctamente
                ctxFn.state.update({mensajePreguntaActual: mensajes.MENSAJE_CONFIRMAR_PAGO.replace("{NOMBRE_CLIENTE}", ctxFn.state.get('nombreClientePago')).replace("{VALOR_PAGADO}", parseInt(ctx.body).toLocaleString("es-CO", {style: "currency", currency: "COP", minimumFractionDigits: 0, maximumFractionDigits: 0,}))})

                //Enviar mensaje de confiración
                await ctxFn.flowDynamic(mensajes.MENSAJE_CONFIRMAR_PAGO.replace("{NOMBRE_CLIENTE}", ctxFn.state.get('nombreClientePago')).replace("{VALOR_PAGADO}", parseInt(ctx.body).toLocaleString("es-CO", {style: "currency", currency: "COP", minimumFractionDigits: 0, maximumFractionDigits: 0,})))

            }
            
            //Iniciar el temporizador de espera de respuesta del cliente
            temporizador.detenerTemporizador(ctx)
            temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAsistente/flujoNoTengoRespuesta')

        } catch (error) {

            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación en el flujo flujoReportarPagoCliente, el sistema respondió: ' + error)

        }

    })
    .addAction({capture:true}, async (ctx, ctxFn) => {

        //Variable para crear la expresión regular que evauará la respuesta
        const ExpRegConfirmarPago = new RegExp("^S[íiÍ]$|^N[oóÓ]$", "i")
        const ExpRegConfirmarPagoSi = new RegExp("^S[íiÍ]", "i")
        const ExpRegConfirmarPagoNo = new RegExp("^N[oóÓ]", "i")

        //Registrar el inicio de la conversación
        try {

            //Evaluar si el usuario envió una nota de voz
            if(ctx.body.includes('event_voice_note')==true){

                //Informar al cliente que en el momento no se pueden procesar sus notas de voz
                await ctxFn.flowDynamic(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)
                
                //Hacer una pausa de 2 segundos
                await delay(1000)

                //Retorar la respuesta a opción incorrecta
                return ctxFn.fallBack(ctxFn.state.get('mensajePreguntaActual'))
                
            }
            else if(ExpRegConfirmarPago.test(ctx.body) == false){

                //Solicitar una respuesta valida
                return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + ctxFn.state.get('mensajePreguntaActual'))
                
            }
            else{

                //Enviar mensaje de confiración
                await ctxFn.flowDynamic(mensajes.MENSAJE_CONFIRMAR_PAGO.replace("{NOMBRE_CLIENTE}", ctxFn.state.get('nombreClientePago')).replace("{VALOR_PAGADO}", parseInt(ctx.body).toLocaleString("es-CO", {style: "currency", currency: "COP", minimumFractionDigits: 0, maximumFractionDigits: 0,})))

                //Si el cliente respundió no
                if(ExpRegConfirmarPagoNo.test(ctx.body) == true){

                    //Enviar de nuevo al flujo para solicitar el nombre del cliente
                    //return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + ctxFn.state.get('mensajePreguntaActual'))
                    
                }

                //Si el cliente respundió si
                if(ExpRegConfirmarPagoSi.test(ctx.body) == true){

                    //Guardar el movimiento en la base de datos
                    //ACA SE DEBEN CONFIGURAR TODOS LOS DATOS DEL MOVIMIENTO
                    movimiento.Guardar(ctxFn.state.get('idCliente'), '', fecha, idCuenta, valor, referencia, conversacion, 'Cliente', ctx.from, '', cunico, recibo, ter, rrn, apro, comprobante, origen, false)

                    //console.log('Listo metí los datos')

                    //Mostrar las opciones de nuevo
                    ctxFn.flowDynamic(mensajes.MENSAJE_COMPROBANTE_RECIBIDO)
                    
                    //Iniciar el temporizador de espera de respuesta del cliente
                    temporizador.detenerTemporizador(ctx)
                    temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAtencionAlCliente/flujoNoTengoRespuestaAtencionAlCliente')
            
                    //Ir al flujo de despedida
                    ctxFn.gotoFlow(require('./flujoAlgoMasAtencionAlCliente.js'))

                }

            }
            
        } catch (error) {

            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación en el flujo flujoReportarPagoCliente, el sistema respondió: ' + error)

        }

    })
    
