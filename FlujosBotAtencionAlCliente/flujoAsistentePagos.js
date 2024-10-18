const {addKeyword} = require('@bot-whatsapp/bot')
const flujoGuardarPago = require('./flujoGuardarPago')

module.exports = flujoAsistentePagos = addKeyword(['SavePayments'])
    .addAnswer('Bienvenido al asistente para el registro de pagos, este proceso se realiza a partir de las *imágenes o capturas de los comprobantes de pago*, no deberá enviar texto sino cuando haya terminado de reportar los pagos para la cuenta que haya elegido.', {delay:1000}, null)
    .addAnswer('Si desea registrar los comprobantes para una cuenta distinta deberá escribir *Terminé* e iniciar el proceso nuevamente con la palabra clave que llama al proceso.', {delay:1000}, null)
    .addAnswer('¿Tiene claras las instrucciones?', {delay:1000}, null, [flujoGuardarPago])
 