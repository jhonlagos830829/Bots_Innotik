const { addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const { delay } = require('@whiskeysockets/baileys');

//////////////////////////////////////// FUNCIONES ELABORADAS

const mensajes = require('../Configuracion/botAsistenciaTecnica/mensajes')

////////////////////////////////////////////////////////////////////////////////

module.exports = flujoNotaDeVozEnviada = addKeyword(EVENTS.VOICE_NOTE)
    .addAnswer(mensajes.SALUDO_INICIAL, {delay:2000})
    .addAnswer(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ, {delay:3000}, async (ctx, { endflow }) => {
        return endflow
    })
    

