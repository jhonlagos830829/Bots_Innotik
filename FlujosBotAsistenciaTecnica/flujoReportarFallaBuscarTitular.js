const {addKeyword, EVENTS} = require('@bot-whatsapp/bot')
const { delay } = require('@whiskeysockets/baileys');

// NO OLVIDAR PROBAR strapi, excalidraw, dialogflow, railway

//////////////////////////////////////// FUNCIONES ELABORADAS

const registrarConversacion = require('../Funciones/registrarConversacion')
const mensajes = require('../Configuracion/botAsistenciaTecnica/mensajes.js')
const temporizador = require('../Funciones/temporizador')
const dispositivo = require('../Funciones/dispositivo')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

const flujoTipoFalla = require('./flujoReportarFallaTipoFalla.js')
const flujoDespedida = require('./flujoDespedida')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// EXPRESIONES REGULARES QUE SE USARAN

const ExpRegFlujo = '/^[a-z áéíóúÁÉÍÓÚñÑ]{3,}/gmi'
const ExpRegRespuestas = new RegExp("^[BV]+[uúÚ][sz]+[ckquea]+[rda enu]*[bvo]*|^[Ck]+o[nm]+t[iíÍ]+[nmuúareos]+|^S[íiÍ]$|^N[oóÓ]$", "i")
const ExpRegRespuestaBuscarDeNuevo = RegExp("^[BV]+[uúÚ][sz]+[ckquea]+[rda enu]*[bvo]*", "i")
const ExpRegRespuestaSi = new RegExp("^S[íiÍ]$", "i")
const ExpRegRespuestaNo = new RegExp("^N[oóÓ]$", "i")
const ExpRegRespuestaContinuar = new RegExp("^[Ck]+o[nm]+t[iíÍ]+[nmuúareos]+", "i")

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// VARIABLES QUE SE USARAN

let mensajeResultadoConsulta = ''

////////////////////////////////////////////////////////////////////////////////

module.exports = flujoReportarFallaBuscarTitular = addKeyword(ExpRegFlujo, { regex: true })
    .addAction(async (ctx, ctxFn) => {
        
        //Registrar el mensaje
        try {
            
            //Registrar la conversación
            await registrarConversacion.guardarConversacion(ctx, 'El flujo flujoReportarFallaBuscarTitular se disparó por el texto: ')
            
        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoReportarFallaBuscarTitular, el sistema respondió: ' + error)

        } 

        //Iniciar el temporizador de espera de respuesta del cliente
        temporizador.detenerTemporizador(ctx)
        //temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')
        
    })
    .addAnswer([mensajes.MENSAJE_NOTIFICACION_CONSULTANDO_SISTEMA], {capture:false}, async (ctx, ctxFn) => {
        
        //Registrar el inicio de la conversación
        try {

            //Regisrar la conversacion
            await registrarConversacion.guardarConversacion(ctx, mensajes.MENSAJE_NOTIFICACION_CONSULTANDO_SISTEMA)

            //Declaración de variables
            let serviciosPppoe = []
            let serviciosDhcp = []
            let mensajeResumen = ''
            let item = 1

            //Obterner el nombre del titular indicado por el cliente
            let cliente = ctxFn.state.get('nombre_titular')

            //Reemplazar las vocales acentuadas y la ñ
            cliente = cliente.replaceAll('á', 'a').replaceAll('é', 'e').replaceAll('í', 'i').replaceAll('ó', 'o').replaceAll('ú', 'u').replaceAll('Á', 'A').replaceAll('É', 'E').replaceAll('Í', 'I').replaceAll('Ó', 'O').replaceAll('Ú', 'U').replaceAll('ñ', 'n').replaceAll('Ñ', 'N')

            //Construir la expresion regular con la que se va a comparar
            cliente = cliente.replaceAll(' ', '[-_]*')

            //Variable para alacenar la configuración del bot         
            let dispositivos = await dispositivo.LeerConfiguracion()
    
            //Recorrer los dispositivos configurados
            for (const dispo of dispositivos[0].dispositivos){

                //Obtener los servicios
                serviciosPppoe = await dispositivo.ObtenerServiciosSuspendidosPppoe(dispo.direccionip, dispo.usuario, dispo.clave)
                serviciosDhcp = await dispositivo.ObtenerServiciosSuspendidosDhcp(dispo.direccionip, dispo.usuario, dispo.clave)

                //Filtar los clientes a partir del apellido indicado por el cliente
                let serviciosPppoeFiltrados = serviciosPppoe.filter( servicio => new RegExp(cliente, 'i').test(servicio.name))
                let serviciosDhcpFiltrados = serviciosDhcp.filter( servicio => new RegExp(cliente, 'i').test(servicio.comment))

                //Recorrer la lista de opciones devuelta
                for (const servicioPppoe of serviciosPppoeFiltrados){

                    //Si no se encontró más de un cliente
                    if(serviciosPppoeFiltrados.length == 1){

                        //Aramar el mensaje de resumen
                        mensajeResumen = mensajeResumen + '\n' + '👉🏼  *' + servicioPppoe.name.replaceAll('-', ' ').replaceAll('_', ' ') + '*'

                    }
                    else{

                        //Aramar el mensaje de resumen
                        mensajeResumen = mensajeResumen + '\n' + '👉🏼  *' + servicioPppoe.name.replaceAll('-', ' ').replaceAll('_', ' ') + '*'

                    }

                    //Incrementar el número del item
                    item = item + 1

                }

                //Recorrer la lista de opciones devuelta
                for (const servicioDhcp of serviciosDhcpFiltrados){

                    //Si no se encontró más de un cliente
                    if(serviciosDhcpFiltrados.length == 1){

                        //Aramar el mensaje de resumen
                        mensajeResumen = mensajeResumen + '\n' + '👉🏼  *' + servicioDhcp.comment.replaceAll('-', ' ').replaceAll('_', ' ') + '*'

                    }
                    else{

                        //Aramar el mensaje de resumen
                        mensajeResumen = mensajeResumen + '\n' + '👉🏼  *' + servicioDhcp.comment.replaceAll('-', ' ').replaceAll('_', ' ') + '*'

                    }

                    //Incrementar el número del item
                    item = item + 1

                }

            }

            //Realizar una pausa
            await delay(1000)

            //Inicializar el mensaje de respuesta
            mensajeResultadoConsulta = ''

            //Si los clientes que coinciden son cero
            if(mensajeResumen.split(/\r\n|\r|\n/).length == 1){
                
                //Regisrar la conversacion
                await registrarConversacion.guardarConversacion(ctx, mensajes.MENSAJE_NO_ENCONTRE_EL_TITULAR_SERVICIO)

                //Obtener el mensaje de respuesta
                mensajeResultadoConsulta = mensajes.MENSAJE_NO_ENCONTRE_EL_TITULAR_SERVICIO
                
                //Enviar mensaje informativo
                await ctxFn.flowDynamic(mensajes.MENSAJE_NO_ENCONTRE_EL_TITULAR_SERVICIO)

                //Realizar una pausa
                await delay(2000)

                //Enviar mensaje con opción
                await ctxFn.flowDynamic(mensajes.MENSAJE_BUSCAR_DE_NUEVO_CONTINUAR)

            }else if(mensajeResumen.split(/\r\n|\r|\n/).length == 2){
                
                //Regisrar la conversacion
                await registrarConversacion.guardarConversacion(ctx, mensajes.MENSAJE_TITULAR_SERVICIO_ENCONTRADO + mensajeResumen)

                //Obtener el mensaje de respuesta
                mensajeResultadoConsulta = mensajes.MENSAJE_TITULAR_SERVICIO_ENCONTRADO + mensajeResumen

                //Enviar mensaje con opción
                await ctxFn.flowDynamic(mensajes.MENSAJE_TITULAR_SERVICIO_ENCONTRADO + mensajeResumen + mensajes.MENU_OPCIONES_CONFIRMAR_TITULAR_SERVICIO)

            }else if(mensajeResumen.split(/\r\n|\r|\n/).length > 2){
                
                //Regisrar la conversacion
                await registrarConversacion.guardarConversacion(ctx, mensajes.MENSAJE_CUAL_ES_TITULAR_SERVICIO + mensajeResumen)

                //Obtener el mensaje de respuesta
                mensajeResultadoConsulta = mensajes.MENSAJE_CUAL_ES_TITULAR_SERVICIO + mensajeResumen + mensajes.MENU_OPCIONES_CONFIRMAR_TITULAR_SERVICIO

                //Enviar mensaje con opción
                await ctxFn.flowDynamic(mensajes.MENSAJE_CUAL_ES_TITULAR_SERVICIO + mensajeResumen + mensajes.MENU_OPCIONES_CONFIRMAR_TITULAR_SERVICIO)

            }

        } catch (error) {

            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación, el sistema respondió: ' + error)

        }
        
        //Iniciar el temporizador de espera de respuesta del cliente
        temporizador.detenerTemporizador(ctx)
        temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')

    })
    .addAction({capture: true}, async (ctx, ctxFn) => {
        
        //Registrar el inicio de la conversación
        try {

            //Registrar la conversación
            await registrarConversacion.guardarConversacion(ctx, mensajeResultadoConsulta)

            //Evaluar si el usuario envió una nota de voz
            if(ctx.body.includes('event_voice_note')==true){
                
                //Registrar la conversación
                await registrarConversacion.guardarConversacion(ctx, mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)
                
                //Hacer una pausa de 2 segundos
                await delay(1000)

                //Informar al cliente que en el momento no se pueden procesar sus notas de voz
                await ctxFn.flowDynamic(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)

                //Hacer una pausa de 2 segundos
                await delay(2000)
                
                //Iniciar el temporizador de espera de respuesta del cliente
                temporizador.detenerTemporizador(ctx)
                temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')

                //Mostrar las opciones de nuevo
                ctxFn.fallBack(mensajeResultadoConsulta)

            }
            else if(ExpRegRespuestas.test(ctx.body) == false){
                
                //Registrar la conversación
                await registrarConversacion.guardarConversacion(ctx, mensajes.ARGUMENTO_RESPUESTA_INVALIDA)
                
                //Iniciar el temporizador de espera de respuesta del cliente
                temporizador.detenerTemporizador(ctx)
                temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')
                
                //Solicitar una respuesta valida
                return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajeResultadoConsulta)
                
            }

            //Si el cliente eligió buscar de nuevo
            if(ExpRegRespuestaBuscarDeNuevo.test(ctx.body) == true){

                //Volver al flujo principal
                return ctxFn.gotoFlow(require('./flujoReportarFallaNombreTitular.js'))

            }else if(ExpRegRespuestaSi.test(ctx.body) == true){

                //Registrar la conversación
                await registrarConversacion.guardarConversacion(ctx, mensajes.MENSAJE_CONFIRMACION_SERVICIO_SUSPENDIDO)

                //Hacer una pausa de 1 segundo
                await delay(1000)

                //Enviar mensaje de confirmación de servicio suspendido por falta de pago
                await ctxFn.flowDynamic(mensajes.MENSAJE_CONFIRMACION_SERVICIO_SUSPENDIDO)
                
                //Hacer una pausa de 2 segundos
                await delay(1000)
                
                //Declaración de la tajeta de presentación
                const vcard = mensajes.CONTACTO_ATENCION_AL_CLIENTE

                const id = ctx.key.remoteJid
                const sock = await ctxFn.provider.getInstance()

                const sentMsg = await sock.sendMessage(id, {
                    contacts: {
                        displayName: 'Innotik Atención Al Cliente',
                        contacts: [{ vcard }],
                    },
                })
                
                //Volver al flujo principal
                return ctxFn.gotoFlow(require('./flujoDespedida.js'))

            }else if(ExpRegRespuestaNo.test(ctx.body) == true){

                //Hacer una pausa de 1 segundo
                await delay(1000)

                //Volver al flujo principal
                return ctxFn.gotoFlow(require('./flujoReportarFallaBuscarDeNuevo.js'))

            }else if(ExpRegRespuestaContinuar.test(ctx.body) == true){
                
                //Hacer una pausa de 1 segundo
                await delay(1000)

                //Volver al flujo principal
                return ctxFn.gotoFlow(require('./flujoReportarFallaTipoFalla.js'))
                
            }

        } catch (error) {

            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación en el flujo flujoReportarFallaBuscarTitular, el sistema respondió: ' + error)

        }
        
    })