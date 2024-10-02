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

const flujoBuscarTitular = require('./flujoReportarFallaBuscarTitular.js')
const flujoDespedida = require('./flujoDespedida')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// EXPRESIONES REGULARES QUE SE USARAN

const ExpRegFlujo = '/(fa)+[ly]+[asoónd]+|(problem)+[as]|(sin )+[internscvod]+|[ck]+[ae]+[lyí]+[aenídoó]+|(no ten)+[goemsíia ]+[internscvo]+|(sirv)+[eindo]+|(dañ)+[andoó]+|(no c)+[ontamsuen]+/gmi'
const ExpRegRespuesta = new RegExp("(fa)+[ly]+[asoónd]+|(problem)+[as]|(sin )+[internscvo]+|[ck]+[aely]+[andoó]+|(no ten)+[goemsíia ]+[internscvo]+|(sirv)+[eindo]+|(dañ)+[andoó]+|(no c)+[ontamsuen]+", "i")
const ExpRegDistinto = new RegExp("(Soli[cs]itar)+( algo )+|(di[sz]tinto)+|(diferente)+", "i")
//const ExpRegCambioClaveWifi = '/[kc]+(am)+[bviíaáeéoór]+|[ck]+(la)+[veb]+|[wifguafi]+/gmi'

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// VARIABLES QUE SE USARAN

////////////////////////////////////////////////////////////////////////////////

module.exports = flujoReportarFalla = addKeyword(ExpRegFlujo, { regex: true })
    .addAction(async (ctx, ctxFn) => {
        
        //Registrar el mensaje
        try {
            
            //Registrar la conversación
            await registrarConversacion.guardarConversacion(ctx, 'El flujo flujoReportarFalla se disparó por el texto: ')

            //Volver al flujo principal
            return ctxFn.gotoFlow(require('./flujoReportarFallaNombreTitular.js'))
            
        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoReportarFalla, el sistema respondió: ' + error)

        } 

    })