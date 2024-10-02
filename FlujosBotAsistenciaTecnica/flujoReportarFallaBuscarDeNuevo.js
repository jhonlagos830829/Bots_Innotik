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

const flujoReportarFallaNombreTitular = require('./flujoReportarFallaNombreTitular')
const flujoDespedida = require('./flujoDespedida')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// EXPRESIONES REGULARES QUE SE USARAN

const ExpRegRespuestas = new RegExp("^[BV]+[uúÚ][sz]+[ckquea]+[rda enu]*[bvo]*|^[Ck]+o[nm]+t[iíÍ]+[nmuúareos]+", "i")
const ExpRegRespuestaBuscarDeNuevo = new RegExp("^[BV]+[uúÚ][sz]+[ckquea]+[rda enu]*[bvo]*", "i")
const ExpRegRespuestaContinuar = new RegExp("^[Ck]+o[nm]+t[iíÍ]+[nmuúareos]+", "i")
//const ExpRegDistinto = new RegExp("(Soli[cs]itar)+( algo )+|(di[sz]tinto)+|(diferente)+", "i")
//const ExpRegCambioClaveWifi = '/[kc]+(am)+[bviíaáeéoór]+|[ck]+(la)+[veb]+|[wifguafi]+/gmi'

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// VARIABLES QUE SE USARAN

////////////////////////////////////////////////////////////////////////////////

module.exports = flujoReportarFallaBuscarDeNuevo = addKeyword('xVCAF9LsnzWkexbp9AHDYIADB2DMPG7BS0JIpDyUI4UZKYrAcq')
    .addAction(async (ctx, ctxFn) => {
        
        //Registrar el mensaje
        try {
            
            //Registrar la conversación
            await registrarConversacion.guardarConversacion(ctx, 'El flujo flujoReportarFallaBuscarDeNuevo se disparó por el texto: ')

            //await dispositivo.ejecutarComando()
            
        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoReportarFallaBuscarDeNuevo, el sistema respondió: ' + error)

        } 

        //Iniciar el temporizador de espera de respuesta del cliente
        temporizador.detenerTemporizador(ctx)
        temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')
        
    })
    .addAnswer(mensajes.MENSAJE_BUSCAR_DE_NUEVO_CONTINUAR, {capture: true}, async (ctx, ctxFn) => {

        //Registrar el inicio de la conversación
        try {

            //Regisrar la conversacion
            await registrarConversacion.guardarConversacion(ctx, mensajes.MENSAJE_BUSCAR_DE_NUEVO_CONTINUAR)

            //Evaluar si el usuario envió una nota de voz
            if(ctx.body.includes('event_voice_note')==true){

                //Registrar la conversación
                await registrarConversacion.guardarConversacion(ctx, mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)

                //Hacer una pausa de 2 segundos
                await delay(1000)

                //Informar al cliente que en el momento no se pueden procesar sus notas de voz
                await ctxFn.flowDynamic(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)
                
                //Hacer una pausa de 2 segundos
                await delay(1000)
                
                //Retorar la respuesta a opción incorrecta
                ctxFn.fallBack(mensajes.MENSAJE_BUSCAR_DE_NUEVO_CONTINUAR)
                
            }
            else if(ExpRegRespuestas.test(ctx.body) == false){

                //Registrar la conversación
                await registrarConversacion.guardarConversacion(ctx, mensajes.ARGUMENTO_RESPUESTA_INVALIDA)
                
                //Solicitar una respuesta valida
                return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.MENSAJE_BUSCAR_DE_NUEVO_CONTINUAR)
                
            }
            
            //Si el cliente eligió buscar de nuevo
            if(ExpRegRespuestaBuscarDeNuevo.test(ctx.body) == true){

                //Volver al flujo principal
                return ctxFn.gotoFlow(require('./flujoReportarFallaNombreTitular.js'))

            }else if(ExpRegRespuestaContinuar.test(ctx.body) == true){

                //Hacer una pausa de 1 segundo
                //await delay(1000)

                //Volver al flujo principal
                return ctxFn.gotoFlow(require('./flujoReportarFallaTipoFalla.js'))
                
            }

        } catch (error) {

            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación, el sistema respondió: ' + error)

        }

    }, [flujoReportarFallaNombreTitular])/*
    .addAnswer([mensajes.MENSAJE_NOTIFICACION_CONSULTANDO_SISTEMA], {delay:1000, capture:false}, async (ctx, ctxFn) => {
        
        //Registrar el inicio de la conversación
        try {

            //Regisrar la conversacion
            await registrarConversacion.guardarConversacion(ctx, mensajes.MENSAJE_NOTIFICACION_CONSULTANDO_SISTEMA)

            //Declaración de variables
            let serviciosPppoe = []
            let mensajeResumen = ''
            let item = 1

            //Obtener los servicios
            serviciosPppoe = await dispositivo.ObtenerServiciosSuspendidosPppoe()

            //Obterner el nombre del titular indicado por el cliente
            let cliente = ctxFn.state.get('nombre_titular')

            //Reemplazar las vocales acentuadas y la ñ
            cliente = cliente.replaceAll('á', 'a').replaceAll('é', 'e').replaceAll('í', 'i').replaceAll('ó', 'o').replaceAll('ú', 'u').replaceAll('Á', 'A').replaceAll('É', 'E').replaceAll('Í', 'I').replaceAll('Ó', 'O').replaceAll('Ú', 'U').replaceAll('ñ', 'n').replaceAll('Ñ', 'N')

            //Construir la expresion regular con la que se va a comparar
            cliente = cliente.replaceAll(' ', '[-_]*')

            //Filtar los clientes a partir del apellido indicado por el cliente
            //let serviciosPppoeFiltrados = serviciosPppoe.filter( servicio => servicio.name.includes(cliente))
            //Filtar los clientes a partir de los datos indicados por el cliente
            let serviciosPppoeFiltrados = serviciosPppoe.filter( servicio => new RegExp(cliente, 'i').test(servicio.name))

            //Recorrer la lista de opciones devuelta
            for (const servicioPppoe of serviciosPppoeFiltrados){

                //Aramar el mensaje de resumen
                mensajeResumen = mensajeResumen + '\n' + '👉🏼  *' + item + '* ' + servicioPppoe.name.replaceAll('-', ' ').replaceAll('_', ' ')

                //Incrementar el número del item
                item = item + 1

            }

            //Realizar una pausa
            await delay(3000)
            
            //Si los clientes que coinciden son cero
            if(serviciosPppoeFiltrados.length == 0){
                
                //Regisrar la conversacion
                await registrarConversacion.guardarConversacion(ctx, mensajes.MENSAJE_NO_ENCONTRE_EL_TITULAR_SERVICIO + mensajeResumen)
                
                //Enviar mensaje con opción
                await ctxFn.flowDynamic(mensajes.MENSAJE_NO_ENCONTRE_EL_TITULAR_SERVICIO + mensajeResumen)

            }else if(serviciosPppoeFiltrados.length == 1){
                
                //Regisrar la conversacion
                await registrarConversacion.guardarConversacion(ctx, mensajes.MENSAJE_TITULAR_SERVICIO_ENCONTRADO + mensajeResumen)

                //Enviar mensaje con opción
                await ctxFn.flowDynamic(mensajes.MENSAJE_TITULAR_SERVICIO_ENCONTRADO + mensajeResumen + mensajes.MENU_OPCIONES_CONFIRMAR_TITULAR_SERVICIO)

            }else if(serviciosPppoeFiltrados.length > 1){
                
                //Regisrar la conversacion
                await registrarConversacion.guardarConversacion(ctx, mensajes.MENSAJE_CUAL_ES_TITULAR_SERVICIO + mensajeResumen)

                //Enviar mensaje con opción
                await ctxFn.flowDynamic(mensajes.MENSAJE_CUAL_ES_TITULAR_SERVICIO + mensajeResumen)

            }

        } catch (error) {

            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación, el sistema respondió: ' + error)

        }
        
        //Iniciar el temporizador de espera de respuesta del cliente
        temporizador.detenerTemporizador(ctx)
        temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')

    }, [flujoTipoFalla])*/
