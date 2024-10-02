const {addKeyword, EVENTS} = require('@bot-whatsapp/bot')
const { delay } = require('@whiskeysockets/baileys');

async function enviarMensaje (ctx, provider, mensaje){
    
    //Pausar la simulación de escritura
    //console.log('Pausando simulación de ecribiendo  para ' + ctx?.key + ' con ' + ctx?.key?.remoteJid)
    const tiempo = ((mensaje.trim().split(/\s+/).length / 4) * 1000)

    console.log('Simular escribiendo durante ' + tiempo + ' milisegundos' + ctx?.key + ' ' + ctx?.key?.remoteJid)

    await provider.vendor.readMessages([ctx?.key])
    await provider.vendor.presenceSubscribe(ctx?.key?.remoteJid)
    await provider.vendor.sendPresenceUpdate('composing', ctx?.key?.remoteJid)

    await delay(tiempo)

    await provider.vendor.sendPresenceUpdate('paused', ctx?.key?.remoteJid)

    return mensaje

}

module.exports.enviarMensaje = enviarMensaje;