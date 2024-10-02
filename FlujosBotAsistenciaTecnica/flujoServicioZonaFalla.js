const {addKeyword} = require('@bot-whatsapp/bot')
const { delay } = require('@whiskeysockets/baileys');

//////////////////////////////////////// FUNCIONES ELABORADAS

const registrarConversacion = require('../Funciones/registrarConversacion')
const mensajes = require('../Configuracion/botAsistenciaTecnica/mensajes');

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

const flujoDespedida = require('./flujoDespedida')

////////////////////////////////////////////////////////////////////////////////

const ExpRegFallaServicioZonaFalla = '/(s)+[ií ]+/gmi'

module.exports = flujoServicioZonaFalla = addKeyword(ExpRegFallaServicioZonaFalla, { regex: true })
    .addAction(async (ctx, ctxFn) => {
        
        //Registrar el mensaje
        try {

            //Registrar la conversación
            await registrarConversacion.guardarConversacion(ctx, 'El flujo flujoServicioZonaFalla se disparó por el texto: ')
            
        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoServicioZonaFalla, el sistema respondió: ' + error)

        }
        
    })
    .addAnswer(mensajes.MENSAJE_SERVICIO_INSTALADO_ZONA_FALLA, {delay:1000}, async (ctx, ctxFn) => {
        
        //Registrar el mensaje
        try {

            //Registrar la conversación
            await registrarConversacion.guardarConversacion(ctx, mensajes.MENSAJE_SERVICIO_INSTALADO_ZONA_FALLA)
            
        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoServicioZonaFalla, el sistema respondió: ' + error)

        } 

        //Ir al flujo de despedida
        return ctxFn.gotoFlow(flujoDespedida)

    })