const configuracion = require('../configuracion')
module.exports = Object.freeze({

    //Mensajes flujo flujoSaludo
    SALUDO_INICIAL: '👩🏻 *¿Hola, qué tal?*\n\nEsta es nuestra línea de *asistencia técnica*, por aquí solo podemos atender solicitudes o reportes de temas técnicos',
    ARGUMENTO_FLUJO_BIENVENIDA: '👩🏻 Esta es nuestra línea de *asistencia técnica*, por aquí solo podemos atender solicitudes o reportes de temas técnicos',
    PREGUNTA_FLUJO_BIENVENIDA: '👩🏻 *¿Qué desea hacer?*\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Reportar una falla\n👉🏼 Cambiar la clave del wifi\n👉🏼 Solicitar algo diferente',
    ARGUMENTO_FLUJO_SOLICITUDES_OTRO_TIPO: '👩🏻 Para solicitudes de otro tipo por favor escríbanos al siguiente número',

    ////////////// MENSAJES PARA BOT DE ATENCIÓN AL CLIENTE 

    //Mensajes flujo flujoSaludo
    SALUDO_INICIAL_ASISTENCIA: '👩🏻 Hola *{NOMBRE_CLIENTE}* bienvenido(a) a la *línea de asistencia* de *Innotik*.\n\nEn esta línea solo puedo atender reportes de *temas administrativos*.',
    MENSAJE_NO_AUTORIZADO: '👩🏻 Usted *no está autorizado* para interactuar conmigo, por favor póngase en contacto con el administrador.',
    MENSAJE_LINEA_REPORTE_FALLAS_ATENCION_AL_CLIENTE: '👩🏻 Si desea reportar *un problema con su servicio por favor pulse sobre este número 👉🏼 +57 310 2106136*\n\nY luego seleccione la opción:\n\n*Chatear con +57 310 2106136*',
    MENSAJE_TEMAS_ASISTENTE: '👩🏻 *¿Que desea hacer?*\n\n_Por favor envíeme el número de la opción que desee:_\n\n 1️⃣ Reportar nuevo cliente\n 2️⃣ Reportar pago de cliente\n 3️⃣ Reportar un gasto\n 4️⃣ Transferir dinero\n 5️⃣ Reportar traslado\n 6️⃣ Reportar horas extras\n\n_O si desea abandonar el proceso responda *Cancelar*_',

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
    MENSAJE_COMPROBANTE_CONFIRMACION: '👩🏻 ¿Desea que cargue este comprobante de pago a nombre de *{NOMBRE_CLIENTE}*?\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Sí\n👉🏼 No',
    MENSAJE_COMPROBANTE_NOMBRE_TITULAR: '👩🏻 Por favor envíeme el *nombre del cliente*',
    MENSAJE_COMPROBANTE_RECIBIDO: '👩🏻 Hemos recibido su comprobante de pago, *vamos a verificar que el dinero haya ingresado a nuestra cuenta*.\n\nEl proceso puede tomar algunas horas o un par de días.\n\nLe informaremos si efectivamente el dinero ingresó a nuestra cuenta o *si se presentó algún problema con su pago*.',
    MENSAJE_CUENTA_NO_EXISTE: '👩🏻 He identificado que el pago se realizó a una cuenta con número *{CUENTA}*.\n\nDebo informarle que *esa cuenta no pertenece a nosotros*.\n\nPor favor *verifique si lo que le estoy informando es correcto*.\n\nAdicionalmente reportaré el caso para que sea revisado por nuestro personal.',
    MENSAJE_DATOS_INCOMPLETOS: '👩🏻 *No logré identificar algunos de los datos de su comprobante de pago*.\n\nNormalmente sucede porque *la foto que envió está incompleta o muy borrosa*.\n\nPor favor *envíeme una nueva foto* donde se pueda *ver con claridad todos los datos del comprobante*.',
    MENSAJE_NOTIFICAR_PAGO_A_CUENTA_INEXISTENTE: '👩🏻 Enviaron este pago, pero al parecer lo hicieron a *una cuenta que no es nuestra*, por favor revise.',
    MENSAJE_NOTIFICAR_TEXTO_ESCANEADO: '👩🏻 El texto escaneado es el siguiente:\n\n',
    MENSAJE_NOTIFICAR_DATOS_IDENTIFICADOS: '👩🏻 Los datos identificados son los siguientes:\n\n',
    MENSAJE_COMPROBANTE_YA_EXISTE: '👩🏻 El comprobante que está enviando *no podemos recibirlo debido a que ya lo recibimos anteriormente*.\n\nSi cree que se trata de un error por favor *tome una nueva foto y envíela de nuevo*.\n\nSin embargo le sugerimos tener precaución con los comprobantes que envía, ya que se podría interpretar como un *intento de fraude* y perdería el beneficio de *reactivación inmediata* de su servicio.\n\nDe esa forma tendría que *esperar a que nuestro personal en horario de oficina verifique su pago* para que procedan con la *reactivación del servicio*.',
    MENSAJE_SIN_DATOS_NECESARIOS: '👩🏻 Si lo que está enviando es *el comprobante de pago* de un servicio *no podré cargarlo en el sistema*.\n\nDebido a que *no me ha proporcionado los datos necesarios*.',

    //Mensajes flujo flujoNuevoCliente
    MENSAJE_NUEVO_CLIENTE_NOMBRE: '👩🏻 Por favor envíeme el *nombre completo del cliente*.\n\nEn lo posible los *dos nombres y dos apellidos* con el fin de evitar homónimos.\n\n_O si desea abandonar el proceso responda *Cancelar*_',
    MENSAJE_NUEVO_CLIENTE_YA_EXISTE: '👩🏻 *Ya existe* un cliente con el nombre *{NOMBRE_CLIENTE}* no es posible crear dos clientes con *exactamente el mismo nombre*, por favor corrija el nombre para continuar.\n\n_O si desea abandonar el proceso responda *Cancelar*_',
    MENSAJE_NUEVO_CLIENTE_IDENTIFICACION: '👩🏻 Ahora envíeme *el número del documento de identidad* del cliente, *sin puntos ni comas*.\n\n_O si desea abandonar el proceso responda *Cancelar*_',
    MENSAJE_NUEVO_CLIENTE_TELEFONO: '👩🏻 A continuación envíeme *el número de teléfono* del cliente en el cual podremos contactarlo.\n\n_O si desea abandonar el proceso responda *Cancelar*_',
    MENSAJE_NUEVO_CLIENTE_WHATSAPP: '👩🏻 Para continuar envíeme *el número de Whatsapp* del cliente al cual podremos escribirle.\n\n_O si desea abandonar el proceso responda *Cancelar*_',
    MENSAJE_NUEVO_CLIENTE_CORREO: '👩🏻 Ahora envíeme *la dirección de correo electrónico* del cliente al cual podremos contactarlo.\n\n_O si desea abandonar el proceso responda *Cancelar*_',
    MENSAJE_NUEVO_CLIENTE_UBICACION: '👩🏻 A continuación envíeme *la ubicación GPS* del lugar donde se dejará instalado el servicio.\n\n_O si desea abandonar el proceso responda *Cancelar*_',
    MENSAJE_NUEVO_CLIENTE_TECNOLOGIA: '👩🏻 Por favor indíqueme en *que tecnología* se instaló el servicio del cliente.\n\n 1️⃣ PON\n 2️⃣ Radio\n\n_O si desea abandonar el proceso responda *Cancelar*_',
    MENSAJE_NUEVO_CLIENTE_FOTO_ONU: '👩🏻 Por favor envíeme *foto de la etiqueta de datos de la ONU* que le instaló al cliente.\n\n_O si desea abandonar el proceso responda *Cancelar*_',

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

    //Mensajes flujo flujoReportarFallaServicioLentoIntermitenteDiagnosticar
    MENSAJE_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR: '👩🏻 Para diagnosticar su servicio necesitaremos la aplicación *Wifiman*',
    MENSAJE_WIFIMAN_INSTALADO_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR: '👩🏻 ¿Ya tiene la aplicación *instalada en algún dispositivo*?\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Sí\n👉🏼 No\n👉🏼 Cancelar',
    MENSAJE_DESEA_INSTALAR_WIFIMAN_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR: '👩🏻 Si le parece bien, puedo indicarle *como instalarla* y en cuanto termine la instalación podremos *diagnosticar su servicio*.\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Sí\n👉🏼 No\n👉🏼 Cancelar',
    MENSAJE_ENVIARE_FOTOS_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR: '👩🏻 Muy bien, durante el proceso le *enviaré fotos* para que le sirvan de guía y sea más fácil realizar la instalación.\n\n*¿Empezamos?*\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Sí\n👉🏼 No\n👉🏼 Cancelar',
    MENSAJE_ABRIR_TIENDA_APLICACIONES_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR: '👩🏻 Por favor busque la *tienda de aplicaciones* y pulse sobre ella para abrirla',
    MENSAJE_TIENDA_APLICACIONES_ANDROID_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR: '👩🏻 Esta es ☝🏻 se llama *Play Store* si su dospositivo es *Android*',
    MENSAJE_TIENDA_APLICACIONES_IOS_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR: '👩🏻 O puede ser esta ☝🏻 llamada *App Store* si su dispositivo es *IOS*',
    MENSAJE_VAMOS_BIEN_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR: '👩🏻 ¿Podemos continuar?\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Sí\n👉🏼 No\n👉🏼 Cancelar',
    MENSAJE_BUSCAR_WIFIMAN_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR: '👩🏻 Una vez abierta la tienda de aplicaciones diríjase a la parte superior de la pantalla y pulse sobre el texto *Buscar apps y ju…*',
    MENSAJE_INSTALAR_WIFIMAN_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR: '👩🏻 Habiendo pulsado sobre el texto Buscar apps y ju… escriba *Wifiman*, cuando lo haga aparecerá la aplicación\n\nPulse sobre el botón que aparece al lado derecho con el texto *Instalaro* o *Actualizar* en caso que ya la tenga instalada.',
    MENSAJE_PROCESO_INSTALACION_WIFIMAN_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR: '👩🏻 El proceso de *instalación comenzará*, el avance lo indicará la línea circular de color azul que se extiende alrededor del icono de la aplicación, así como el texto del porcentaje bajo el nombre de la aplicación.',

    PREGUNTA_FLUJO_TIPO_FALLA: '👩🏻 *¿En qué consiste la falla de su servicio?*\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 No tengo servicio\n👉🏼 El servicio está intermitente\n👉🏼 El servicio está muy lento',
    //MENU_OPCIONES_FLUJO_TIPO_FALLA: '\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 No tengo servicio\n👉🏼 El servicio está intermitente\n👉🏼 El servicio está muy lento',
    
    //Mensajes flujo falla masiva
    ARGUMENTO_FLUJO_CONSULTAR_FALLA_MASIVA: '👩🏻 Un momento por favor, estoy *consultando si tenemos una falla general*...',
    ARGUMENTO_FLUJO_SIN_FALLA_MASIVA: '👩🏻 *No tenemos reportes de fallas generales*, al parecer es una falla únicamente en su servicio…',
    
    PREGUNTA_UNO_FLUJO_FALLA_MASIVA: '👩🏻 *¿Ya tiene servicio?*',
    
    MENU_UNO_OPCIONES_FLUJO_FALLA_MASIVA: '\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Ya tengo\n👉🏼 Aún no',
    
    PREGUNTA_DOS_FLUJO_FALLA_MASIVA: '👩🏻 *¿Su servicio se encuentra instalado en alguna de las zonas afectadas?*',
    
    MENU_DOS_OPCIONES_FLUJO_FALLA_MASIVA: '\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Sí\n 👉🏼 No',

    ///Mensajes flujo Falla

    PREGUNTA_FLUJO_FALLA: '👩🏻 *Para la prestación de su servicio usted tiene instalado(a):*\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Una antena\n👉🏼 Fibra óptica\n👉🏼 Solo un cable',
    //MENU_OPCIONES_FLUJO_FALLA: '_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Una antena\n👉🏼 Fibra óptica\n👉🏼 Solo un cable',

    ////////////////////////
    
    ///Mensajes flujo Hay Falla Masiva

    ARGUMENTO_FLUJO_HAY_FALLA_MASIVA: '👩🏻 *¿Su servicio se encuentra instalado en alguna de las zonas afectadas?*\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Sí\n👉🏼 No',
    //MENU_OPCIONES_FLUJO_HAY_FALLA_MASIVA: '_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Sí\n👉🏼 No',

    ///Mensajes flujo 
    MENSAJE_SERVICIO_INSTALADO_ZONA_FALLA: '👩🏻 Es muy probable que la *falla de su servicio* esté relacionada con la *falla masiva que tenemos en estos momentos*\n\nLe recomendamos *contactarnos nuevamente* cuando hayamos resuelto el incidente *si aún no tiene servicio*',

    ////////////////////////

    ///Mensajes flujo Falla Antena

    ARGUMENTO_FLUJO_FALLA_ANTENA: '👩🏻 Por favor *realice el siguiente procedimiento*:',
    DIAGNOSTICO_FLUJO_FALLA_ANTENA_1: '1. Encuentre el inyector POE que hace parte de los equipos instalados, puede ser de color negro o blanco',
    DIAGNOSTICO_FLUJO_FALLA_ANTENA_2: '2. Verifique que el LED del inyector POE esté encendido en color blanco.',
    DIAGNOSTICO_FLUJO_FALLA_ANTENA_3: '3. Ajuste las 3 conexiones del inyector POE.',
    DIAGNOSTICO_FLUJO_FALLA_ANTENA_4: '4. Verifique que las conexiones se encuentran como se muestran en éste gráfico.',
    PREGUNTA_FLUJO_FALLA_ANTENA: '👩🏻 *¿Todas las conexiones se encuentran en orden?*\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Sí\n👉🏼 No',
    //MENU_OPCIONES_FLUJO_FALLA_ANTENA: '_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Sí\n👉🏼 No',

    ////////////////////////

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

    ////////////////////////

    ///Mensajes flujo Contacto Atencion Al Cliente

    ARGUMENTO_FLUJO_ATENCION_AL_CLIENTE: 'Recuerde que por aquí solo podemos atender solicitudes o reportes de temas técnicos.\n\nPara todo lo relacionado con *información de nuestros servicios, facturación, estados de cuenta y medios de pago*\n\nPor favor escríbanos al siguiente número.',

    ////////////////////////

    ///Mensajes flujo Falla Reiniciar

    ARGUMENTO_FLUJO_FALLA_REINICIAR: '👩🏻 Por favor *realice el siguiente procedimiento*:',
    PROCEDIMIENTO_FLUJO_FALLA_REINICIAR_1: '1. Retire el cable de la corriente del inyector POE',
    PROCEDIMIENTO_FLUJO_FALLA_REINICIAR_2: '2. A continuación, retire el cable de la corriente del router',
    PROCEDIMIENTO_FLUJO_FALLA_REINICIAR_3: '3. Espere *30 segundos* y conecte nuevamente la corriente del inyector POE y también la del router.\n\n4. Espere *5 minutos* mientras inician los equipos y luego revise nuevamente para ver si ya tiene servicio',
    PREGUNTA_FLUJO_FALLA_REINICIAR: '👩🏻 *¿Ya conectó nuevamente los equipos?*\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Sí\n👉🏼 No',

    ////////////////////////

    //Mensajes flujo sin respuesta
    MENSAJE_FLUJO_SIN_RESPUESTA: '👩🏻 No he tenido *respuesta suya*, estaré aquí para atenderle cuando lo desee.\n\nPor el momento *terminaré esta conversación* y atenderé a otros clientes que me están escribiendo.',

    //Mensajes flujo despedida
    MENSAJE_FLUJO_DESPEDIDA: '👩🏻 Ha sido un placer servirle, espero que mi asistencia haya sido de su agrado, le deseo un feliz resto de día',

    //Mensajes flujo flujoReportarFallaServicioLentoIntermitente
    MENSAJE_FLUJO_FALLA_SERVICIO_INTERMITENTE_LENTO: 'Normalmente la *intermitencia o lentitud* en el servicio se debe a que se satura por la *cantidad de dispositivos conectados* o el tipo de actividades que se realicen.\nMientras *más dispositivos* tenga conectados a su servicio *menos velocidad* disponible tendrá y por lo tanto más lento se pondrá.\nPor otra parte, *las actividades* que realice también influyen en *la velocidad* del servicio.\nPues mientras actividades como enviar *mensajes de texto por WhatsApp* pueden consumir la décima parte de 1 mega, ver *un video en YouTube o Netflix consume entre 3 y 8 megas*, respectivamente.',

});