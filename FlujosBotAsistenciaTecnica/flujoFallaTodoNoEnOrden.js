const {addKeyword} = require('@bot-whatsapp/bot')
//const flujoFallaTodoEnOrden = require('./flujoFallaTodoEnOrden')
//const flujoFallaNoCorreccionConexiones = require('./flujoFallaNoCorreccionConexiones')

module.exports = flujoFallaTodoNoEnOrden = addKeyword(['No']).addAnswer([
    'Por favor realice las correcciones necesarias, puede tomar como guía las imágenes anteriores, recuerde que las conexiones deben ir de la siguiente manera:',
    '',
    '1.	El cable que viene de la *antena*, debe ir conectado al *inyector POE* en la entrada que está etiquetada como *POE*.',
    '',
    '2.	El cable que va para el *router*, debe ir conectado al *inyector POE* en la entrada que está etiquetada como *LAN* y en el otro extremo en la entrada del *router* debe ir conectado a la entrada que está etiquetada como *WAN*.',
], {delay:2000}, null
).addAnswer('*¿Pudo corregir las conexiones?*\n\n_Por favor pulse sobre alguna de las siguientes opciones:_', {delay:2000, buttons:[{body:'Sí'}, {body:'No'}]}, null/*, [flujoFallaTodoEnOrden, flujoFallaNoCorreccionConexiones]*/)
