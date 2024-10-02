const {addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const { delay } = require('@whiskeysockets/baileys');

//////////////////////////////////////// FUNCIONES ELABORADAS

const registrarConversacion = require('../Funciones/registrarConversacion')
const mensajes = require('../Configuracion/botAsistenciaTecnica/mensajes.js')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

const flujoTipoFalla = require('./flujoReportarFallaTipoFalla')

////////////////////////////////////////////////////////////////////////////////

const ExpRegPago = '/(pag)+[aroóueé]+/gmi'
const respuestasValidas = ['Sí', 'Si', 'No']

module.exports = flujoReportePago = addKeyword(EVENTS.MEDIA)
    .addAction(async (ctx, ctxFn) => {
        
        //Registrar el mensaje
        try {
            
            //Registrar la conversación
            await registrarConversacion.guardarConversacion(ctx, mensajes.SALUDO_INICIAL_FLUJO_REPORTE_PAGO)

            //Enviar mensaje informativo
            await ctxFn.flowDynamic(mensajes.SALUDO_INICIAL_FLUJO_REPORTE_PAGO)

            //Hacer una pausa de 1 segundo
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
            
            //Hacer una pausa de 1 segundo
            await delay(1000)

            //Enviar mensaje informativo
            await ctxFn.flowDynamic(mensajes.MENSAJE_DATOS_TITULAR_FLUJO_REPORTE_PAGO)

            //Volver al flujo principal
            return ctxFn.gotoFlow(require('./flujoDespedida.js'))

            
        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoTipoFalla, el sistema respondió: ' + error)

        } 

    })

