const configuracion = require('../configuracion')
module.exports = Object.freeze({

    ////////////// MENSAJES PARA BOT DE ATENCIÓN AL CLIENTE

    //Mensajes flujo flujoAsistentePagos
    MOVIMIENTO_ENCONTRADO: '👩🏻 *Encontré un pago* con los siguientes datos:\n\n*Desde:* {MEDIO}\n*Fecha:* {FECHA}\n*Valor:* {VALOR}\n*Referencia:* {REFERENCIA}\n*Cliente:* {NOMBRE_CLIENTE}\n*Conversación:* {CONVERSACION}\n\nVoy a registrarla en el CRM.',
    ENVIAR_RECIBO_PAGO: '👩🏻 *He registrado el pago* en el CRM, *enviaré el recibo de pago* al cliente.',
    RECIBO_PAGO_ENVIADO: '👩🏻 Recibo de pago *{ID_RECIBO}* enviado al correo del cliente cliente.',
    PAGO_VERIFICADO: '👩🏻 Apreciado usuario le informamos que *hemos recibido satisfactoriamente el pago* reportado por usted a nombre de *{CLIENTE}* realizado a través de *{MEDIO}* el *{FECHA}* en la cuenta *{CUENTA}* perteneciente a *{TITULAR}* por valor de *{VALOR}*.\n\nGracias por su pago oportuno.',
    CLIENTE_NOTIFICADO: '👩🏻 He *notificado al cliente* que recibimos su pago.',
    PAGO_NO_ENCONTRADO: '👩🏻 *No encontré* un pago reportado que coincida con el comprobante proporcionado, lo ingresaré como uno nuevo.',

    //Mensajes flujo flujoSaludo
    SALUDO_INICIAL_ATENCION_AL_CLIENTE: '👩🏻 Hola *{NOMBRE_CLIENTE}* bienvenido(a) a la *línea de atención al cliente* de *Innotik*.\n\nEn esta línea solo puedo atender reportes de *temas administrativos*.',
    //MENSAJE_NO_AUTORIZADO: '👩🏻 Usted *no está autorizado* para interactuar conmigo, por favor póngase en contacto con el administrador.',
    MENSAJE_LINEA_REPORTE_FALLAS_ATENCION_AL_CLIENTE: '👩🏻 Si desea reportar *un problema con su servicio por favor pulse sobre este número 👉🏼 +57 310 2106136*\n\nY luego seleccione la opción:\n\n*Chatear con +57 310 2106136*',
    MENSAJE_TEMAS_ATENCION_AL_CLIENTE: '👩🏻 Le puedo apoyar con los siguientes temas:\n\n_Por favor envíeme el número de la opción que desee:_\n\n 1️⃣ Facturas pendientes por pagar\n 2️⃣ Cuenta para pagar\n 3️⃣ Enviar comprobante de pago\n 4️⃣ Información de nuestros servicios\n\n_O si ya no desea ser atendido responda *Cancelar*_',
    MENSAJE_ENVIE_FOTO_COMPROBANTE: '👩🏻 Muy bien, por favor *envíeme la foto de su comprobante de pago*, recuerde que para agilizar el proceso debe ser completamente legible y estar de manera vertical.',

    //Mensajes flujo flujoReportarPagoCliente
    MENSAJE_TITULAR_ENCONTRADO: '👩🏻 ¿El titular del servicio es *{NOMBRE_CLIENTE}*?\n\n_Por favor responda con una de las siguientes opciones:_\n\n\👉🏼 Si\n👉🏼 No',
    MENSAJE_VALOR_PAGADO: '👩🏻 Por favor envíeme *en números el valor pagado*, sin puntos ni comas',
    MENSAJE_CONFIRMAR_PAGO: '👩🏻 ¿Desea reportar un pago por valor de *{VALOR_PAGADO}* a nombre de *{NOMBRE_CLIENTE}*?\n\n_Por favor responda con una de las siguientes opciones:_\n\n\👉🏼 Si\n👉🏼 No',

    //Mensajes flujo flujoFacturasPendientesPorPagarServiciAlCliente
    MENSAJE_FACTURAS_PENDIENTES_A_NOMBRE: '👩🏻 ¿Desea consultar las *facturas pendientes por pagar* a nombre?\n\n_por favor envíeme el número de la opción que desee:_\n\n 1️⃣ Suyo.\n 2️⃣ De otra persona.',
    MENSAJE_FACTURAS_PENDIENTES_CONSULTANDO: '👩🏻 Permítame *un momento* por favor, voy a consultar en el sistema.',
    MENSAJE_FACTURAS_PENDIENTES_POR_PAGAR: '👩🏻 El cliente *{NOMBRE_CLIENTE}* tiene la(s) siguiente(s) factura(s) pendiente(s) por pagar:',
    MENSAJE_NO_FACTURAS_PENDIENTES_POR_PAGAR: '👩🏻 No tiene facturas pendientes por pagar.',
    MENSAJE_NUMERO_NO_REGISTRADO: '👩🏻 El número desde el cual está escribiendo *no está registrado para ningún servicio*.\n\n¿Desea realizar la consulta a partir del *nombre del titular del servicio*?\n\n_Por favor responda con una de las siguientes opciones:_\n\n\👉🏼 Si\n👉🏼 No',
    MENSAJE_FACTURAS_PENDIENTES_POR_PAGAR_OTRO_TITULAR: '👩🏻 Por favor envíeme el *nombre* del titular del servicio',
    MENSAJE_CLIENTE_NO_ENCONTRADO: '👩🏻 No encontré *ningún cliente* con el nombre que me indica.\n\nSi está seguro que es correcto podemos intentar buscarlo con el primer apellido.\n\nPor favor indíqueme *el primer apellido del titular del servicio*.',
    MENSAJE_CUAL_ES_TITULAR_SERVICIO: '👩🏻 El titular del servicio *¿es alguno de los siguientes?*\n\n_Por favor envíeme de esta lista el número que corresponde al titular_\n\n{LISTA_CLIENTES}\n\n_En caso que no sea ninguno de los anteriores por favor responda *Ninguno*_',
    MENSAJE_CUENTA_PAGAR: '👩🏻 El cliente *{NOMBRE_CLIENTE}* debe pagar en la cuenta:',

    //Mensajes flujo flujoAlgoMasAtencionAlCliente
    MENSAJE_FLUJO_ALGO_MAS: '👩🏻 ¿Le puedo servir en *algo más*?\n\n_Por favor responda con una de las siguientes opciones:_\n\n\👉🏼 Si\n👉🏼 No',

    //Mensajes flujo flujoNoTengoRespuesta
    MENSAJE_FLUJO_SIN_RESPUESTA_ATENCION_AL_CLIENTE: '👩🏻 No he recibido respuesta suya en los últimos voy a atender a otros clientes que me están escribiendo.',
    
    ////////////////////////////////////////////////////////

    //Mensajes flujo flujoReportePago
    SALUDO_INICIAL_FLUJO_REPORTE_PAGO: '👩🏻 *¡Hola!, {NOMBRE_CLIENTE} ¿Qué tal?*\n\n¿Está enviando un comprobante de pago?\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Sí\n👉🏼 No',
    MENSAJE_COMPROBANTE_TITULAR_ESCRIBE: '👩🏻 ¿Debemos aplicar este pago al servicio de *{NOMBRE_CLIENTE}*?\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Sí\n👉🏼 No',
    MENSAJE_REVISANDO_COMPROBANTE: '👩🏻 Un momento por favor, voy a *revisar el comprobante* que me está enviando',
    MENSAJE_COMPROBANTE_CONFIRMACION: '👩🏻 ¿ *Confirma* que desea cargar este comprobante de pago a nombre de *{NOMBRE_CLIENTE}* ?\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Sí\n👉🏼 No',
    MENSAJE_COMPROBANTE_NOMBRE_TITULAR: '👩🏻 Por favor envíeme el *nombre* del titular del servicio',
    MENSAJE_COMPROBANTE_RECIBIDO: '👩🏻 Hemos recibido su comprobante de pago, *vamos a verificar que el dinero haya ingresado a nuestra cuenta*.\n\nEl proceso puede tomar algunas horas o un par de días.\n\nLe informaremos si efectivamente el dinero ingresó a nuestra cuenta o *si se presentó algún problema con su pago*.',
    MENSAJE_CUENTA_NO_EXISTE: '👩🏻 He identificado que el pago se realizó a una cuenta con número *{CUENTA}*.\n\nDebo informarle que *esa cuenta no pertenece a nosotros*.\n\nPor favor *verifique si lo que le estoy informando es correcto*.\n\nAdicionalmente reportaré el caso para que sea revisado por nuestro personal.',
    MENSAJE_DATOS_INCOMPLETOS: '👩🏻 *No logré identificar algunos de los datos de su comprobante de pago*.\n\nNormalmente sucede porque *la foto que envió está incompleta o muy borrosa*.\n\nPor favor *envíeme una nueva foto* donde se pueda *ver con claridad todos los datos del comprobante*.',
    MENSAJE_NOTIFICAR_PAGO_A_CUENTA_INEXISTENTE: '👩🏻 Desde el número {NUMERO_ENVIA} enviaron este pago, pero al parecer lo hicieron a *una cuenta que no es nuestra*, por favor revise.',
    MENSAJE_NOTIFICAR_TEXTO_ESCANEADO: '👩🏻 El texto escaneado es el siguiente:\n\n',
    MENSAJE_NOTIFICAR_DATOS_IDENTIFICADOS: '👩🏻 Los datos identificados son los siguientes:\n\n',
    MENSAJE_COMPROBANTE_YA_EXISTE: '👩🏻 El comprobante que está enviando *no podemos recibirlo debido a que ya lo recibimos anteriormente*.\n\nSi cree que se trata de un error por favor *tome una nueva foto y envíela de nuevo*.\n\nSin embargo le sugerimos tener precaución con los comprobantes que envía, ya que se podría interpretar como un *intento de fraude* y perdería el beneficio de *reactivación inmediata* de su servicio.\n\nDe esa forma tendría que *esperar a que nuestro personal en horario de oficina verifique su pago* para que procedan con la *reactivación del servicio*.',
    MENSAJE_SIN_DATOS_NECESARIOS: '👩🏻 Si está enviando un comprobante de pago *NO PODRÉ CAGARLO EN EL SISTEMA YA QUE NO ME HA PROPORCIONADO LOS DATO NECESARIOS*, de esa forma su pago *QUEDARÁ COMO NO REPORTADO Y NUESTRA PLATAFORMA SUSPENDERÁ SU SERVICIO* al momento de vencerse el plazo máximo para el pago.',

    //Mensajes flujo flujoInformacionServicios
    MENSAJE_SERVICIOS_PRESTADOS: '👩🏻 Prestamos servicios de *internet, telefonía fija y televisión* haciendo uso tecnologías en *fibra óptica y microondas* en zonas donde los proveedores como Movistar, Claro o Tigo no prestan sus servicios.\n\n¿Podría indicarme su *nombre completo* por favor?',

    //Mensajes respuesta inválida
    ARGUMENTO_RESPUESTA_INVALIDA: '👩🏻 *No entendí su respuesta*\n\n¿Podría repetirme por favor?',
    
    //Mensajes notas de voz
    ARGUMENTO_FLUJO_NOTA_DE_VOZ: '👩🏻 Por favor excúseme, en este momento *no puedo escuchar sus notas de voz*, solo puedo atenderle por mensajes de texto',
    
    //Mensajes flujo nombre titular
    MENSAJE_NOMBRE_TITULAR_SERVICIO: '👩🏻 *¿A nombre de quien está el servicio?*\n\nCon el *primer apellido* es suficiente para buscarlo en el sistema',
    MENSAJE_NOTIFICACION_CONSULTANDO_SISTEMA: '👩🏻 Un momento por favor, voy a consultar en la plataforma...',
    MENSAJE_NO_ENCONTRE_EL_TITULAR_SERVICIO: '👩🏻 Con ese nombre *no encontré* el titular entre los servicios suspendidos.\n\nEs posible que el problema del servicio *no se deba a suspensión por falta de pago*',
    MENSAJE_BUSCAR_DE_NUEVO_CONTINUAR: '👩🏻 Si el nombre que me dió *está escrito correctamente* podemos *continuar* con la revisión del servicio, de lo contrario podemos *buscar nuevamente*\n\n*¿Qué desea hacer?*\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Buscar de nuevo\n👉🏼 Continuar',
    MENSAJE_TITULAR_SERVICIO_ENCONTRADO: '👩🏻 ¿Éste es el *propietario del servicio*?\n',
    MENU_OPCIONES_CONFIRMAR_TITULAR_SERVICIO: '\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Sí\n👉🏼 No',
    MENSAJE_CONFIRMACION_SERVICIO_SUSPENDIDO: '👩🏻 Lamentablemente su servicio se encuentra *suspendido por falta de pago*, si considera que es un *error* o si necesita conocer los *medios de pago* por favor escríbanos a la siguiente línea',

    ///Mensajes flujo Falla Todo En Orden

    PREGUNTA_FLUJO_FALLA_TODO_EN_ORDEN: '👩🏻 *¿Ya tiene servicio?*\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Sí\n👉🏼 No',
    //MENU_OPCIONES_FLUJO_FALLA_TODO_EN_ORDEN: '_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Sí\n👉🏼 No',

    ////////////////////////

    ////////////////////////

    ///Mensajes flujo Imagen Enviada

    PREGUNTA_FLUJO_IMAGEN_ENVIADA: '¿Está enviando un comprobante de pago?',
    MENU_OPCIONES_FLUJO_IMAGEN_ENVIADA: '_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Sí\n👉🏼 No',

    ////////////////////////

    ///Contactos

    CONTACTO_ATENCION_AL_CLIENTE: 'BEGIN:VCARD\nVERSION:3.0\nFN:Innotik Atención Al Cliente\nORG:Innotik Atención Al Cliente;\nTEL;type=CELL;type=VOICE;waid=573153420526:+57 315 342 0526\nEND:VCARD',
    CONTACTO_ASISTENCIA_TECNICA: 'BEGIN:VCARD\nVERSION:3.0\nFN:Innotik Asistencia Técnica\nORG:Innotik Asistencia Técnica;\nTEL;type=CELL;type=VOICE;waid=573102106136:+57 310 210 6136\nEND:VCARD',

    //Mensajes flujo sin respuesta
    MENSAJE_FLUJO_SIN_RESPUESTA: '👩🏻 No he tenido *respuesta suya*, estaré aquí para atenderle cuando lo desee.\n\nPor el momento *terminaré esta conversación* y atenderé a otros clientes que me están escribiendo.',

    //Mensajes flujo despedida
    MENSAJE_FLUJO_DESPEDIDA: '👩🏻 Ha sido un placer servirle, espero que mi asistencia haya sido de su agrado, le deseo un feliz resto de día',


    //PROMPTS para clasificación de los comprobantes
    PROMPT_CLASIFICADOR_COMPROBANTE: `Por favor clasifica el siguiente texto teniendo en cuenta las indicaciones a continuación:
    1. Si encuentras palabras como Redban, RBMDES o CORRESPONSAL debes responder, [CORRESPONSAL].
    2. Si encuentras fases como “¡Transferencia exitosa!”, “Producto origen” o “Producto destino” debes responder, [BANCOLOMBIA].
    3. Si encuentras fases como “Detalles del movimiento”, “Número Nequi” o “¿De dónde salió la plata?” debes responder, [NEQUI].
    4. Si encuentras fases como “Transacción exitosa”, “Código QR para confirmar su transacción” o “Pasó plata” debes responder, [DAVIPLATA].
    5. Si no encuentras ninguna de las anteriores debes responder [OTRO].`,

    PROMPT_EXTRACTOR_DATOS_CORRESPONSAL: `Por favor analice el siguiente texto y extraiga los siguientes datos: 
    1. Fecha y hora (debes ponerlo en un solo campo).
    2. C. único (es un número compuesto por 10 dígitos).
    3. Recibo (es un número compuesto por 6 dígitos).
    4. TER (es un código compuesto por 8 caracteres, letras y números).
    5. RRN (es un número compuesto por 6 dígitos).
    6. Producto (es un número compuesto por 10 dígitos).
    7. Valor (es un número que encontrará precedido del signo de moneda). 
    Esos datos extraídos por favor devuélvalos en formato JSON, respoda de manera muy corta.
    `,

    PROMPT_EXTRACTOR_DATOS_BANCOLOMBIA: `Por favor analice el siguiente texto y extraiga los siguientes datos: 
    1. Comprobante (es un número compuesto por 10 dígitos).
    2. Fecha y hora (debes ponerlo en un solo campo).
    3. Producto origen (compuesto por las palabras, cuenta, ahorros o corriente un asterisco y un número de 4 dígitos).
    4. Producto destino (es un número compuesto por una palabra que representa el nombre del banco y un número de 10 dígitos).
    5. Valor enviado (es un número que encontrará precedido del signo de moneda).
    Esos datos extraídos por favor devuélvalos en formato JSON respoda de manera muy corta.
    `,

});