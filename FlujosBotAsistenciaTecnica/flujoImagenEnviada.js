const { addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const { delay } = require('@whiskeysockets/baileys');

//////////////////////////////////////// FUNCIONES ELABORADAS

const mensajes = require('../Configuracion/botAsistenciaTecnica/mensajes')
const registrarConversacion = require('../Funciones/registrarConversacion')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

const flujoContactoAtencionAlCliente = require('./flujoContactoAtencionAlCliente')
const flujoServicioZonaFalla = require('./flujoServicioZonaFalla');

////////////////////////////////////////////////////////////////////////////////

const ExpRegRespuestas = new RegExp("^S[ií ]+$|^N[oó ]+$", "i")

module.exports = flujoImagenEnviada = addKeyword(EVENTS.MEDIA)
.addAction(async (ctx, { endflow }) => {
    
    //Declaracion de variables
    idConversacion = ctx.key.id
    nombreCliente = ctx.pushName
    telefonoCliente = ctx.from

    //Registrar el mensaje
    try {

        //Registrar la conversación
        await registrarConversacion.registrarConversacion('Asistencia', idConversacion, nombreCliente, telefonoCliente, 'El flujo flujoImagenEnviada se disparó por el texto: ', ctx.body)
        
    } catch (error) {

        //Solicitar una respuesta valida
        console.log('Error al registrar la conversación en el flujo flujoImagenEnviada, el sistema respondió: ' + error)

    } 

})
.addAnswer(mensajes.SALUDO_INICIAL, null, async (ctx, { endflow }) => {
    
    //Declaracion de variables
    idConversacion = ctx.key.id
    nombreCliente = ctx.pushName
    telefonoCliente = ctx.from

    //Registrar el mensaje
    try {

        //Registrar la conversación
        await registrarConversacion.registrarConversacion('Asistencia', idConversacion, nombreCliente, telefonoCliente, mensajes.SALUDO_INICIAL, ctx.body)
        
    } catch (error) {

        //Solicitar una respuesta valida
        console.log('Error al registrar la conversación en el flujo flujoImagenEnviada, el sistema respondió: ' + error)

    } 

})
.addAnswer(mensajes.PREGUNTA_FLUJO_IMAGEN_ENVIADA + '\n\n' + mensajes.MENU_OPCIONES_FLUJO_IMAGEN_ENVIADA, {delay:3000, capture:true}, async (ctx, { fallBack }) => {
    
    //Declaracion de variables
    idConversacion = ctx.key.id
    nombreCliente = ctx.pushName
    telefonoCliente = ctx.from

    //Registrar el mensaje
    try {

        //Registrar la conversación
        await registrarConversacion.registrarConversacion('Asistencia', idConversacion, nombreCliente, telefonoCliente, mensajes.PREGUNTA_FLUJO_IMAGEN_ENVIADA + '\n\n' + mensajes.MENU_OPCIONES_FLUJO_IMAGEN_ENVIADA, ctx.body)

        //Si la respuesta no es valida
        if(ExpRegRespuestas.test(ctx.body) == false){

            //Registrar el inicio de la conversación
            try {

                //Registrar la conversación
                await registrarConversacion.registrarConversacion('Asistencia', idConversacion, nombreCliente, telefonoCliente, mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.PREGUNTA_FLUJO_IMAGEN_ENVIADA + '\n\n' + mensajes.MENU_OPCIONES_FLUJO_IMAGEN_ENVIADA, ctx.body)

            } catch (error) {

                //Mostrar el mensaje de error en la consola
                console.log('Error al registrar la conversación en el flujo flujoImagenEnviada, el sistema respondió: ' + error)

            }

            //Solicitar una respuesta valida
            return fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.PREGUNTA_FLUJO_IMAGEN_ENVIADA + '\n\n' + mensajes.MENU_OPCIONES_FLUJO_IMAGEN_ENVIADA)

        }
        
    } catch (error) {

        //Solicitar una respuesta valida
        console.log('Error al registrar la conversación en el flujo flujoImagenEnviada, el sistema respondió: ' + error)

    } 

}, [flujoContactoAtencionAlCliente])


    

