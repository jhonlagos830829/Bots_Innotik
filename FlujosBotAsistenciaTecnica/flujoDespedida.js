const {addKeyword} = require('@bot-whatsapp/bot')

//////////////////////////////////////// FUNCIONES ELABORADAS

const registrarConversacion = require('../Funciones/registrarConversacion')
const mensajes = require('../Configuracion/botAsistenciaTecnica/mensajes')
const temporizador = require('../Funciones/temporizador')

////////////////////////////////////////////////////////////////////////////////

module.exports = flujoDespedida = addKeyword(['Sí', 'Si', 'Ya tengo', 'Ya', 'Tengo', 'Ok', 'Okay', 'Bien', 'Bueno', 'Vale'])
    .addAnswer(mensajes.MENSAJE_FLUJO_DESPEDIDA, {delay:1000}, async (ctx, { endFlow }) => {
    
        //Registrar el mensaje
        try {
    
            //Registrar la conversación
            await registrarConversacion.guardarConversacion(ctx, mensajes.MENSAJE_FLUJO_DESPEDIDA)

            //Iniciar el temporizador de espera de respuesta del cliente
            temporizador.detenerTemporizador(ctx)
            
        } catch (error) {
    
            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoDespedida, el sistema respondió: ' + error)
    
        } 
        
        //Finalizar flujo
        return endFlow
    
    })
 