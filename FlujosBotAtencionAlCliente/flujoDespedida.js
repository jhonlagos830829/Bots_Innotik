const {addKeyword} = require('@bot-whatsapp/bot')

//////////////////////////////////////// FUNCIONES ELABORADAS

const mensajes = require('../Configuracion/botAtencionAlCliente/mensajes')
const temporizador = require('../Funciones/temporizador')

////////////////////////////////////////////////////////////////////////////////

const ExpRegFlujo = '/^S[íiIÍ]|N[oOóÓ]/gmi';

module.exports = flujoDespedida = addKeyword('qMheNCJByppkU8yKpmsz2Whwe1tpUK7wikkIs94GI6oTn1dtli')
    .addAnswer(mensajes.MENSAJE_FLUJO_DESPEDIDA, {delay:100}, async (ctx, ctxFn) => {
    
        //Registrar el mensaje
        try {
    
            //Detener el temporizador de espera de respuesta del cliente
            temporizador.detenerTemporizador(ctx)

            //Limpiar el estado de la conversación
            ctxFn.state.clear()
            
        } catch (error) {
    
            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoDespedida, el sistema respondió: ' + error)
    
        } 
        
        //Finalizar flujo
        return ctxFn.endFlow
    
    })
 