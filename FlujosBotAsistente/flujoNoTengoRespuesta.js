const {addKeyword} = require('@bot-whatsapp/bot')

//////////////////////////////////////// FUNCIONES ELABORADAS

//const conversacion = require('../Funciones/con')
const mensajes = require('../Configuracion/botAtencionAlCliente/mensajes')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

//const flujoDespedida = require('./flujoDespedida')

////////////////////////////////////////////////////////////////////////////////

module.exports = flujoNoTengoRespuesta = addKeyword(['Sí', 'Si', 'Ya tengo', 'Ya', 'Tengo', 'Ok', 'Okay', 'Bien', 'Bueno', 'Vale'])
    .addAnswer(mensajes.MENSAJE_FLUJO_SIN_RESPUESTA, {delay:100}, async (ctx, { gotoFlow, endFlow }) => {
    
        //Declaracion de variables
        idConversacion = ctx.key.id
        nombreCliente = ctx.pushName
        telefonoCliente = ctx.from

        //Registrar el mensaje
        try {
    
            //Registrar la conversación
            //await conversacion.Guardar(ctx, mensajes.MENSAJE_FLUJO_SIN_RESPUESTA)
            
        } catch (error) {
    
            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoNoTengoRespuesta, el sistema respondió: ' + error)
    
        } 
        
    })
    .addAnswer(mensajes.MENSAJE_FLUJO_DESPEDIDA, {delay:1000}, async (ctx, { endFlow }) => {
    
        //Declaracion de variables
        idConversacion = ctx.key.id
        nombreCliente = ctx.pushName
        telefonoCliente = ctx.from

        //Registrar el mensaje
        try {
    
            //Registrar la conversación
            //await conversacion.Guardar(ctx, mensajes.MENSAJE_FLUJO_DESPEDIDA)
            
        } catch (error) {
    
            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoNoTengoRespuesta, el sistema respondió: ' + error)
    
        } 
        
        //Finalizar flujo
        return endFlow
    
    })
 