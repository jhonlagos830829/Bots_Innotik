const {addKeyword, EVENTS} = require('@bot-whatsapp/bot')
const { delay } = require('@whiskeysockets/baileys');

// NO OLVIDAR PROBAR strapi, excalidraw, dialogflow, railway

//////////////////////////////////////// FUNCIONES ELABORADAS

const registrarConversacion = require('../Funciones/registrarConversacion')
const mensajes = require('../Configuracion/botAsistenciaTecnica/mensajes')
const temporizador = require('../Funciones/temporizador')
const dispositivo = require('../Funciones/dispositivo')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

// const flujoBuscarTitular = require('./flujoBuscarTitular.js')
// const flujoDespedida = require('./flujoDespedida')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// EXPRESIONES REGULARES QUE SE USARAN

const ExpRegFlujo = '/lent[oitud]*|i[nm]+ter[mn]it[en]*te/gmi'
const ExpRegRespuesta = new RegExp("(fa)+[ly]+[asoónd]+|(problem)+[as]|(sin )+[internscvo]+|[ck]+[aely]+[andoó]+|(no ten)+[goemsíia ]+[internscvo]+|(sirv)+[eindo]+|(dañ)+[andoó]+|(no c)+[ontamsuen]+", "i")
const ExpRegDistinto = new RegExp("(Soli[cs]itar)+( algo )+|(di[sz]tinto)+|(diferente)+", "i")
//const ExpRegCambioClaveWifi = '/[kc]+(am)+[bviíaáeéoór]+|[ck]+(la)+[veb]+|[wifguafi]+/gmi'

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// VARIABLES QUE SE USARAN

////////////////////////////////////////////////////////////////////////////////

module.exports = flujoReportarFallaServicioLentoIntermitente = addKeyword(ExpRegFlujo, { regex: true })
    .addAction(async (ctx, ctxFn) => {
        
        //Registrar el mensaje
        try {
            
            //Registrar la conversación
            await registrarConversacion.guardarConversacion(ctx, 'El flujo flujoReportarFallaServicioLentoIntermitente se disparó por el texto: ')

            for (const mensaje of mensajes.MENSAJE_FLUJO_FALLA_SERVICIO_INTERMITENTE_LENTO.split('\n')){
                
                //Enviar mensaje
                await ctxFn.flowDynamic('👨🏻 ' + mensaje)
                
                //Hacer una pausa de 2 segundos
                await delay(5000)

            }

            // //Volver al flujo principal
            // return ctxFn.gotoFlow(require('./flujoReportarFallaServicioLentoIntermitenteNombreTitular.js'))
            
        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoReportarFallaServicioLentoIntermitente, el sistema respondió: ' + error)

        } 

    })