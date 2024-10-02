
const {addKeyword} = require('@bot-whatsapp/bot')
const { delay } = require('@whiskeysockets/baileys');

//////////////////////////////////////// FUNCIONES ELABORADAS

const leerArchivos = require('../Funciones/leerArchivos')
const registrarConversacion = require('../Funciones/registrarConversacion')
const mensajes = require('../Configuracion/botAsistenciaTecnica/mensajes')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

const flujoFalla = require('./flujoFalla')
const flujoServicioZonaFalla = require('./flujoServicioZonaFalla')
const flujoHayFallaMasiva = require('./flujoHayFallaMasiva')

////////////////////////////////////////////////////////////////////////////////

const ExpRegFallaNoHayServicio = '/(no ten)+[goemsíia ]+|(no )+[hay ]+|(dañ)+[andoó]+|(urge)+[ntecia]+|(no c)+[ontamsuen]+( con )+|( sin )+[ ihn]+(terne)+/gmi'
const ExpRegRespuestas = new RegExp("((s)[ií]+|no)+|([ly](a)+( tengo)|(a)[uú](n)+( no))", "i")
var hayFallaMasiva = false
var textoCaida = ''

module.exports = flujoFallaMasiva = addKeyword(ExpRegFallaNoHayServicio, { regex: true })
    .addAction(async (ctx, ctxFn) => {
        
        //Registrar el mensaje
        try {

            //Registrar la conversación
            await registrarConversacion.guardarConversacion(ctx, 'El flujo flujoFallaMasiva se disparó por el texto: ')
            
        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoFallaMasiva, el sistema respondió: ' + error)

        } 

    })
    .addAnswer(mensajes.ARGUMENTO_FLUJO_CONSULTAR_FALLA_MASIVA, {delay:2000}, async (ctx, { fallBack, flowDynamic, gotoFlow }) => {
        
        //Registrar el inicio de la conversación
        try {

            //Regisrar la conversacion
            await registrarConversacion.guardarConversacion(ctx, mensajes.ARGUMENTO_FLUJO_CONSULTAR_FALLA_MASIVA)

            //Leer el texto donde se reportar las caidas masivas
            textoCaida = await leerArchivos.consultarCaidaMasiva()

            //Si se ha reportado alguna falla masiva
            if(textoCaida == null || textoCaida == ''){
                
                //Regisrar la conversacion
                await registrarConversacion.guardarConversacion(ctx, mensajes.ARGUMENTO_FLUJO_SIN_FALLA_MASIVA)

                //No hay falla masiva
                hayFallaMasiva = false
            
                //Realizar una pausa
                await delay(1000)

                //Mostrar que no se encontraron fallas reportadas
                flowDynamic([{body: mensajes.ARGUMENTO_FLUJO_SIN_FALLA_MASIVA}])
                
                //Realizar una pausa
                await delay(2000)

                //Ir al flujo falla
                return gotoFlow(flujoFalla)

            }
            else{
                
                //Regisrar la conversacion
                await registrarConversacion.guardarConversacion(ctx, textoCaida)
                
                //No hay falla masiva
                hayFallaMasiva = true
            
                //Realizar una pausa
                await delay(1000)

                //Mostrar el mensaje de caída
                flowDynamic([{body: textoCaida}])
                
                //Realizar una pausa
                await delay(1000)

                //Pasar al flujo de falla masiva
                return gotoFlow(flujoHayFallaMasiva)
                
            }
        
        } catch (error) {

            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación en el flujo flujoFallaMasiva, el sistema respondió: ' + error)

        }
        
    }, [flujoFalla, flujoHayFallaMasiva])