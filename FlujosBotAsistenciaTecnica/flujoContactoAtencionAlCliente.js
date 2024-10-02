
const {addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const { delay } = require('@whiskeysockets/baileys');

//////////////////////////////////////// FUNCIONES ELABORADAS

const registrarConversacion = require('../Funciones/registrarConversacion')
const mensajes = require('../Configuracion/botAsistenciaTecnica/mensajes');

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

const flujoDespedida = require('./flujoDespedida')

////////////////////////////////////////////////////////////////////////////////

const ExpRegFlujo = '/^S[ií ]+$|^N[oó ]+$/gmi'

module.exports = flujoContactoAtencionAlCliente = addKeyword(ExpRegFlujo, { regex: true })
.addAnswer(mensajes.ARGUMENTO_FLUJO_ATENCION_AL_CLIENTE, {delay:2000}, async (ctx, { provider, flowDynamic, gotoFlow }) => {


    //Declaracion de variables
    idConversacion = ctx.key.id
    nombreCliente = ctx.pushName
    telefonoCliente = ctx.from

    //Registrar el inicio de la conversación
    try {

        //Registrar la conversación
        await registrarConversacion.registrarConversacion('Asistencia', idConversacion, nombreCliente, telefonoCliente, mensajes.ARGUMENTO_FLUJO_ATENCION_AL_CLIENTE, ctx.body)

        //Hacer una pausa de 2 segundos
        await delay(2000)
        
        const vcard = mensajes.CONTACTO_ATENCION_AL_CLIENTE
        const id = ctx.key.remoteJid
        const sock = await provider.getInstance()

        const sentMsg = await sock.sendMessage(id, {
            contacts: {
                displayName: 'Innotik Atención Al Cliente',
                contacts: [{ vcard }],
            },
        })

    } catch (error) {

        //Mostrar el mensaje de error en la consola
        console.log('Error al registrar la conversación en el flujo flujoContactoAtencionAlCliente, el sistema respondió: ' + error)

    }
     
    //Salir del flujo
    return gotoFlow(flujoDespedida)

})