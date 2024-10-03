const { addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const { delay } = require('@whiskeysockets/baileys');

//////////////////////////////////////// FLUJOS QUE SE USARÁN

const flujoSaludoAtencionAlCliente = require('../FlujosBotAtencionAlCliente/flujoSaludoAtencionAlCliente.js')

//////////////////////////////////////// FUNCIONES ELABORADAS

const mensajes = require('../Configuracion/botAtencionAlCliente/mensajes.js')

////////////////////////////////////////////////////////////////////////////////

module.exports = flujoNotaDeVozEnviada = addKeyword(EVENTS.VOICE_NOTE)
    .addAction(async (ctx, ctxFn) => {
            
        //Registrar el mensaje
        try {

            //Enviar mensaje de no se reciben notas de voz
            ctxFn.flowDynamic(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)

            //Realizar una pausa de 1 segundo
            await delay(1000)

            //Volver al flujo principal
            return ctxFn.gotoFlow(require('../FlujosBotAtencionAlCliente/flujoSaludoAtencionAlCliente.js'))
            
        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoNotaDeVozEnviada, el sistema respondió: ' + error)

        } 

    })
    

