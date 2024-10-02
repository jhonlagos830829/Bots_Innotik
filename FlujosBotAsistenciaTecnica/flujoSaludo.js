const {addKeyword, EVENTS} = require('@bot-whatsapp/bot')
const { delay } = require('@whiskeysockets/baileys');

// NO OLVIDAR PROBAR strapi, excalidraw, dialogflow, railway

//////////////////////////////////////// FUNCIONES ELABORADAS

const registrarConversacion = require('../Funciones/registrarConversacion')
const mensajes = require('../Configuracion/botAsistenciaTecnica/mensajes')
const temporizador = require('../Funciones/temporizador')
const chatpdf = require('../Funciones/chatPdf')


////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

const flujoReportarFalla = require('./flujoReportarFalla')
const flujoDespedida = require('./flujoDespedida')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// EXPRESIONES REGULARES QUE SE USARAN

const ExpRegFlujo = '/(ola)+|(buen)+[aos]+/gmi'
const ExpRegRespuesta = new RegExp("(fa)+[ly]+[asoónd]+|(problem)+[as]|(sin )+[internscvo]+|[ck]+[aely]+[andoó]+|(no ten)+[goemsíia ]+[internscvo]+|(sirv)+[eindo]+|(dañ)+[andoó]+|(no c)+[ontamsuen]+", "i")
const ExpRegDistinto = new RegExp("(Soli[cs]itar)+( algo )+|(di[sz]tinto)+|(diferente)+", "i")
//const ExpRegCambioClaveWifi = '/[kc]+(am)+[bviíaáeéoór]+|[ck]+(la)+[veb]+|[wifguafi]+/gmi'

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// VARIABLES QUE SE USARAN

////////////////////////////////////////////////////////////////////////////////

module.exports = flujoSaludo = addKeyword(EVENTS.WELCOME)
    .addAction(async (ctx, ctxFn) => {
        
        //Registrar el mensaje
        try {
            
            //Registrar la conversación
            await registrarConversacion.guardarConversacion(ctx, 'El flujo flujoSaludo se disparó por el texto: ')

            //await dispositivo.ejecutarComando()
            
        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoTipoFalla, el sistema respondió: ' + error)

        } 

    })
    .addAnswer(mensajes.SALUDO_INICIAL, {capture: false}, async (ctx, ctxFn) => {

        //Registrar el inicio de la conversación
        try {

            //Regisrar la conversacion
            await registrarConversacion.guardarConversacion(ctx, mensajes.SALUDO_INICIAL)

        } catch (error) {

            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación, el sistema respondió: ' + error)

        }

        //Iniciar el temporizador de espera de respuesta del cliente
        temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')

    })
    .addAnswer([mensajes.PREGUNTA_FLUJO_BIENVENIDA], {delay:1000, capture:true}, async (ctx, ctxFn) => {
        
        

        // //Enviar mensaje informativo
        // await ctxFn.flowDynamic('Un momento por favor...')
        
        // //Preguntar al ChatPdf
        // const respuesta = await chatpdf.PreguntarChatpdf(ctx.body)
        
        // const mensajes = respuesta.split(/(?<!\d)\.\s+/g)

        // for (const mensaje of mensajes){

        //     //console.log('Enviando ->' + mensaje + '<-')
        //     await ctxFn.flowDynamic('👨🏻 ' + mensaje)

        // }

        

        //Registrar el inicio de la conversación
        try {

            //Evaluar si el usuario envió una nota de voz
            if(ctx.body.includes('event_voice_note')==true){

                //Hacer una pausa de 2 segundos
                await delay(1000)

                //Informar al cliente que en el momento no se pueden procesar sus notas de voz
                await ctxFn.flowDynamic(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)
                
                //Registrar la conversación
                await registrarConversacion.guardarConversacion(ctx, mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)

                //Hacer una pausa de 2 segundos
                await delay(1000)
                
                //Iniciar el temporizador de espera de respuesta del cliente
                temporizador.detenerTemporizador(ctx)
                temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')

                //Retorar la respuesta a opción incorrecta
                return ctxFn.fallBack(mensajes.PREGUNTA_FLUJO_BIENVENIDA)
                
            }
            else if(ExpRegDistinto.test(ctx.body) == true){

                //Solicitar una respuesta valida
                await ctxFn.flowDynamic(mensajes.ARGUMENTO_FLUJO_SOLICITUDES_OTRO_TIPO)
                
                //Hacer una pausa de 2 segundos
                await delay(2000)
                
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

                //Registrar la conversación
                await registrarConversacion.guardarConversacion(ctx, mensajes.ARGUMENTO_FLUJO_SOLICITUDES_OTRO_TIPO)

                //Ir al flujo de despedida
                return ctxFn.gotoFlow(flujoDespedida)
            }
            else if(ExpRegRespuesta.test(ctx.body) == false){

                //Registrar la conversación
                await registrarConversacion.guardarConversacion(ctx, mensajes.ARGUMENTO_RESPUESTA_INVALIDA)
                
                //Iniciar el temporizador de espera de respuesta del cliente
                temporizador.detenerTemporizador(ctx)
                temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')

                //Solicitar una respuesta valida
                return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.PREGUNTA_FLUJO_BIENVENIDA)
                
            }

        } catch (error) {
            
            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación, el sistema respondió: ' + error)

        }
        
    }, [flujoReportarFalla])
