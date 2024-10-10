const configuracion = require('../../../Configuracion/configuracion')

/**
 * Funcion que maneja los mensajes en su totalidad
 * @param {*} dataIn - Datos del contacto y el mensaje
 * @param {*} chatwoot - La dependencia del Chatwoot
 */
const manejadorDeMensajes = async (dataIn = { phone:'', name: '', message: '', mode: '', attachment:[] }, chatwoot) => {
    
    const bandeja = await chatwoot.buscarCrearInbox({ name: configuracion.BANDEJA_DE_ENTRADA });
    const contacto = await chatwoot.buscarCrearContacto({ from: dataIn.phone, name: dataIn.name });
    const conversacion = await chatwoot.buscarCrearConversacion({
        inbox_id: bandeja.id,
        contact_id: contacto.id,
        phone_number: dataIn.phone
    });

    await chatwoot.crearMensaje({
        msg: dataIn.message, 
        mode: dataIn.mode, 
        conversation_id: conversacion.id,
        attachment: dataIn.attachment
    })
    
}

module.exports = { manejadorDeMensajes }