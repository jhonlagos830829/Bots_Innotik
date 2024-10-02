const {addKeyword, EVENTS} = require('@bot-whatsapp/bot')
const { delay } = require('@whiskeysockets/baileys');

async function simularEsribiendo(ctx, provider){
    
    //Iniciar la simulación de escritura
    //console.log('Activando simulación de ecribiendo para ' + ctx?.key + ' con ' + ctx?.key?.remoteJid)
    await provider.vendor.readMessages([ctx?.key])
    await provider.vendor.presenceSubscribe(ctx?.key?.remoteJid)

    // simulare writing
    await provider.vendor.sendPresenceUpdate('composing', ctx?.key?.remoteJid)

}

async function simularEsribiendoPausarTerminar (ctx, provider){
    
    //Pausar la simulación de escritura
    //console.log('Pausando simulación de ecribiendo  para ' + ctx?.key + ' con ' + ctx?.key?.remoteJid)
    await provider.vendor.sendPresenceUpdate('paused', ctx?.key?.remoteJid)

}

module.exports.simularEsribiendo = simularEsribiendo;
module.exports.simularEsribiendoPausarTerminar = simularEsribiendoPausarTerminar;