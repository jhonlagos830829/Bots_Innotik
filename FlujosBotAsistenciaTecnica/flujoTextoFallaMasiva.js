const {addKeyword} = require('@bot-whatsapp/bot')
const flujoGuardarTextoFallaMasiva = require('./flujoGuardarTextoFallaMasiva')

module.exports = flujoTextoFallaMasiva = addKeyword(['Ring, Ring'])
    .addAnswer('Envíeme el texto de que debo publicar donde se informa de la falla masiva, recuerde que debe venir con saludo y que para eliminar el mensaje debe enviar *Nulo*', {capture:true}, (ctx) => {textoMensaje = ctx.body, console.log('Guardando mensaje de falla masiva: ', textoMensaje)}, flujoGuardarTextoFallaMasiva)
 