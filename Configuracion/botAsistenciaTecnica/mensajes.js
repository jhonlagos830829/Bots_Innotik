const configuracion = require('../configuracion')
module.exports = Object.freeze({

    //Mensajes flujo flujoSaludo
    SALUDO_INICIAL: '👨🏻 *¿Hola, qué tal?*\n\nEsta es nuestra línea de *asistencia técnica*, por aquí solo podemos atender solicitudes o reportes de temas técnicos',
    ARGUMENTO_FLUJO_BIENVENIDA: '👨🏻 Esta es nuestra línea de *asistencia técnica*, por aquí solo podemos atender solicitudes o reportes de temas técnicos',
    PREGUNTA_FLUJO_BIENVENIDA: '👨🏻 *¿Qué desea hacer?*\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Reportar una falla\n👉🏼 Cambiar la clave del wifi\n👉🏼 Solicitar algo diferente',
    ARGUMENTO_FLUJO_SOLICITUDES_OTRO_TIPO: '👨🏻 Para solicitudes de otro tipo por favor escríbanos al siguiente número',
    
    //Mensajes flujo flujoReportePago
    SALUDO_INICIAL_FLUJO_REPORTE_PAGO: '👨🏻 ¡Hola!, ¿Qué tal?\n\nSi está enviando *un comprobante de pago*, en esta línea no tenemos los medios para *validar su pago*, por favor *envíelo a la siguiente* línea.',
    MENSAJE_DATOS_TITULAR_FLUJO_REPORTE_PAGO: '👨🏻 Recuerde que *debe enviar también el nombre completo de la persona titular del servicio*, sin esos datos *no podremos cargar los pagos* en la plataforma.',

    //Mensajes respuesta inválida
    ARGUMENTO_RESPUESTA_INVALIDA: '👨🏻 *No entendí su respuesta*\n\n¿Podría repetirme por favor?',
    
    //Mensajes notas de voz
    ARGUMENTO_FLUJO_NOTA_DE_VOZ: '👨🏻 Por favor excúsenos, en este momento *no podemos escuchar sus notas de voz*, solo podremos atenderle por mensajes de texto',
    
    //Mensajes flujo nombre titular
    MENSAJE_NOMBRE_TITULAR_SERVICIO: '👨🏻 *¿A nombre de quien está el servicio?*\n\nCon el *primer apellido* es suficiente para buscarlo en el sistema',
    MENSAJE_NOTIFICACION_CONSULTANDO_SISTEMA: '👨🏻 Un momento por favor, voy a consultar en la plataforma...',
    MENSAJE_NO_ENCONTRE_EL_TITULAR_SERVICIO: '👨🏻 Con ese nombre *no encontré* el titular entre los servicios suspendidos.\n\nEs posible que el problema del servicio *no se deba a suspensión por falta de pago*',
    MENSAJE_BUSCAR_DE_NUEVO_CONTINUAR: '👨🏻 Si el nombre que me dió *está escrito correctamente* podemos *continuar* con la revisión del servicio, de lo contrario podemos *buscar nuevamente*\n\n*¿Qué desea hacer?*\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Buscar de nuevo\n👉🏼 Continuar',
    MENSAJE_TITULAR_SERVICIO_ENCONTRADO: '👨🏻 ¿Éste es el *propietario del servicio*?\n',
    MENSAJE_CUAL_ES_TITULAR_SERVICIO: '👨🏻 El titular del servicio *¿es alguno de los siguientes?*\n',
    MENU_OPCIONES_CONFIRMAR_TITULAR_SERVICIO: '\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Sí\n👉🏼 No',
    MENSAJE_CONFIRMACION_SERVICIO_SUSPENDIDO: '👨🏻 Lamentablemente su servicio se encuentra *suspendido por falta de pago*, si considera que es un *error* o si necesita conocer los *medios de pago* por favor escríbanos a la siguiente línea',

    //Mensajes flujo flujoReportarFallaServicioLentoIntermitenteDiagnosticar
    MENSAJE_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR: '👨🏻 Para diagnosticar su servicio necesitaremos la aplicación *Wifiman*',
    MENSAJE_WIFIMAN_INSTALADO_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR: '👨🏻 ¿Ya tiene la aplicación *instalada en algún dispositivo*?\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Sí\n👉🏼 No\n👉🏼 Cancelar',
    MENSAJE_DESEA_INSTALAR_WIFIMAN_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR: '👨🏻 Si le parece bien, puedo indicarle *como instalarla* y en cuanto termine la instalación podremos *diagnosticar su servicio*.\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Sí\n👉🏼 No\n👉🏼 Cancelar',
    MENSAJE_ENVIARE_FOTOS_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR: '👨🏻 Muy bien, durante el proceso le *enviaré fotos* para que le sirvan de guía y sea más fácil realizar la instalación.\n\n*¿Empezamos?*\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Sí\n👉🏼 No\n👉🏼 Cancelar',
    MENSAJE_ABRIR_TIENDA_APLICACIONES_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR: '👨🏻 Por favor busque la *tienda de aplicaciones* y pulse sobre ella para abrirla',
    MENSAJE_TIENDA_APLICACIONES_ANDROID_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR: '👨🏻 Esta es ☝🏻 se llama *Play Store* si su dospositivo es *Android*',
    MENSAJE_TIENDA_APLICACIONES_IOS_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR: '👨🏻 O puede ser esta ☝🏻 llamada *App Store* si su dispositivo es *IOS*',
    MENSAJE_VAMOS_BIEN_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR: '👨🏻 ¿Podemos continuar?\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Sí\n👉🏼 No\n👉🏼 Cancelar',
    MENSAJE_BUSCAR_WIFIMAN_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR: '👨🏻 Una vez abierta la tienda de aplicaciones diríjase a la parte superior de la pantalla y pulse sobre el texto *Buscar apps y ju…*',
    MENSAJE_INSTALAR_WIFIMAN_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR: '👨🏻 Habiendo pulsado sobre el texto Buscar apps y ju… escriba *Wifiman*, cuando lo haga aparecerá la aplicación\n\nPulse sobre el botón que aparece al lado derecho con el texto *Instalaro* o *Actualizar* en caso que ya la tenga instalada.',
    MENSAJE_PROCESO_INSTALACION_WIFIMAN_FLUJO_REPORTAR_FALLA_SERVICIO_LENTO_INTERMITENTE_DIAGNOSTICAR: '👨🏻 El proceso de *instalación comenzará*, el avance lo indicará la línea circular de color azul que se extiende alrededor del icono de la aplicación, así como el texto del porcentaje bajo el nombre de la aplicación.',

    PREGUNTA_FLUJO_TIPO_FALLA: '👨🏻 *¿En qué consiste la falla de su servicio?*\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 No tengo servicio\n👉🏼 El servicio está intermitente\n👉🏼 El servicio está muy lento',
    //MENU_OPCIONES_FLUJO_TIPO_FALLA: '\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 No tengo servicio\n👉🏼 El servicio está intermitente\n👉🏼 El servicio está muy lento',
    
    //Mensajes flujo falla masiva
    ARGUMENTO_FLUJO_CONSULTAR_FALLA_MASIVA: '👨🏻 Un momento por favor, estoy *consultando si tenemos una falla general*...',
    ARGUMENTO_FLUJO_SIN_FALLA_MASIVA: '👨🏻 *No tenemos reportes de fallas generales*, al parecer es una falla únicamente en su servicio…',
    
    PREGUNTA_UNO_FLUJO_FALLA_MASIVA: '👨🏻 *¿Ya tiene servicio?*',
    
    MENU_UNO_OPCIONES_FLUJO_FALLA_MASIVA: '\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Ya tengo\n👉🏼 Aún no',
    
    PREGUNTA_DOS_FLUJO_FALLA_MASIVA: '👨🏻 *¿Su servicio se encuentra instalado en alguna de las zonas afectadas?*',
    
    MENU_DOS_OPCIONES_FLUJO_FALLA_MASIVA: '\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Sí\n 👉🏼 No',

    ///Mensajes flujo Falla

    PREGUNTA_FLUJO_FALLA: '👨🏻 *Para la prestación de su servicio usted tiene instalado(a):*\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Una antena\n👉🏼 Fibra óptica\n👉🏼 Solo un cable',
    //MENU_OPCIONES_FLUJO_FALLA: '_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Una antena\n👉🏼 Fibra óptica\n👉🏼 Solo un cable',

    ////////////////////////
    
    ///Mensajes flujo Hay Falla Masiva

    ARGUMENTO_FLUJO_HAY_FALLA_MASIVA: '👨🏻 *¿Su servicio se encuentra instalado en alguna de las zonas afectadas?*\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Sí\n👉🏼 No',
    //MENU_OPCIONES_FLUJO_HAY_FALLA_MASIVA: '_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Sí\n👉🏼 No',

    ///Mensajes flujo 
    MENSAJE_SERVICIO_INSTALADO_ZONA_FALLA: '👨🏻 Es muy probable que la *falla de su servicio* esté relacionada con la *falla masiva que tenemos en estos momentos*\n\nLe recomendamos *contactarnos nuevamente* cuando hayamos resuelto el incidente *si aún no tiene servicio*',

    ////////////////////////

    ///Mensajes flujo Falla Antena

    ARGUMENTO_FLUJO_FALLA_ANTENA: '👨🏻 Por favor *realice el siguiente procedimiento*:',
    DIAGNOSTICO_FLUJO_FALLA_ANTENA_1: '1. Encuentre el inyector POE que hace parte de los equipos instalados, puede ser de color negro o blanco',
    DIAGNOSTICO_FLUJO_FALLA_ANTENA_2: '2. Verifique que el LED del inyector POE esté encendido en color blanco.',
    DIAGNOSTICO_FLUJO_FALLA_ANTENA_3: '3. Ajuste las 3 conexiones del inyector POE.',
    DIAGNOSTICO_FLUJO_FALLA_ANTENA_4: '4. Verifique que las conexiones se encuentran como se muestran en éste gráfico.',
    PREGUNTA_FLUJO_FALLA_ANTENA: '👨🏻 *¿Todas las conexiones se encuentran en orden?*\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Sí\n👉🏼 No',
    //MENU_OPCIONES_FLUJO_FALLA_ANTENA: '_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Sí\n👉🏼 No',

    ////////////////////////

    ///Mensajes flujo Falla Todo En Orden

    PREGUNTA_FLUJO_FALLA_TODO_EN_ORDEN: '👨🏻 *¿Ya tiene servicio?*\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Sí\n👉🏼 No',
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

    ARGUMENTO_FLUJO_FALLA_REINICIAR: '👨🏻 Por favor *realice el siguiente procedimiento*:',
    PROCEDIMIENTO_FLUJO_FALLA_REINICIAR_1: '1. Retire el cable de la corriente del inyector POE',
    PROCEDIMIENTO_FLUJO_FALLA_REINICIAR_2: '2. A continuación, retire el cable de la corriente del router',
    PROCEDIMIENTO_FLUJO_FALLA_REINICIAR_3: '3. Espere *30 segundos* y conecte nuevamente la corriente del inyector POE y también la del router.\n\n4. Espere *5 minutos* mientras inician los equipos y luego revise nuevamente para ver si ya tiene servicio',
    PREGUNTA_FLUJO_FALLA_REINICIAR: '👨🏻 *¿Ya conectó nuevamente los equipos?*\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Sí\n👉🏼 No',

    ////////////////////////

    //Mensajes flujo sin respuesta
    MENSAJE_FLUJO_SIN_RESPUESTA: '👨🏻 No he tenido *respuesta suya*, estaré aquí para atenderle cuando lo desee, por el momento *terminaré esta conversación* y atenderé a otros clientes que me están escribiendo',

    //Mensajes flujo despedida
    MENSAJE_FLUJO_DESPEDIDA: '👨🏻 Ha sido un placer servirle, esperamos que nuestra asistencia haya sido de su agrado, le deseamos un feliz resto de día',

    //Mensajes flujo flujoReportarFallaServicioLentoIntermitente
    MENSAJE_FLUJO_FALLA_SERVICIO_INTERMITENTE_LENTO: 'Normalmente la *intermitencia o lentitud* en el servicio se debe a que se satura por la *cantidad de dispositivos conectados* o el tipo de actividades que se realicen.\nMientras *más dispositivos* tenga conectados a su servicio *menos velocidad* disponible tendrá y por lo tanto más lento se pondrá.\nPor otra parte, *las actividades* que realice también influyen en *la velocidad* del servicio.\nPues mientras actividades como enviar *mensajes de texto por WhatsApp* pueden consumir la décima parte de 1 mega, ver *un video en YouTube o Netflix consume entre 3 y 8 megas*, respectivamente.',

});