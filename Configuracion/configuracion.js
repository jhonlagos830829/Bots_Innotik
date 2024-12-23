module.exports = Object.freeze({
    
    //Constantes de configuración
    NOMBRE_BOT: 'Innotik Aistencia Técnica',
    TIEMPO_ESPERA_RESPUESTA: 180, //PRODUCCION 1200 //PRUEBAS 30
    NUMERO_NOTIFICAR: '573102106136' + '@s.whatsapp.net', //PRODUCCION 573024004614 //PRUEBAS 573102106136

    //Configuración CRM
    URL_API_CRM: 'https://ameizyn.unmsapp.com/crm/api/v1.0/',
    API_KEY_CRM: 'kVv8dTfgCzUtEU/DavjXDrQKdIL94+cxObN8MPafhZglGzjdlvQXnWXPJK1U1YPw',
    
    //Configuración Strapi
    URL_API: 'http://127.0.0.1:1338/api/', //PODUCCION 'http://192.168.0.104:1338/api/' //PRUEBAS 'http://127.0.0.1:1338/api/'
    TOKEN_STRAPI: 'ac663ef571b7c27627c2d03a4fc24c7d81a0cc3140e4976bfdb2a2d321478e745a894a534bd95d71aae7089137c62282010e907118ccc35ecd9e3180981fd471b883424d60910d820d247b8a13c8187e420b44022484ca65fe7f85a1674aea8529086c5f1be5e33ba8e17022dfc351eb57ee7c569f9f008136f96335c217998b', //PRODUCCION 'fc83c7f78358d1c489a9f482914a5ebe9dd607d3e52511abfa5e059387cce191851c8320d11677d69f74d2446e5b2f49dabc39e708eca3b494c15f1c47025c0e43028ee1b447883abf82ead8a2de98498a24e58e52e4e7dce0c0ae549dcbe11af5ff429dfd7983a8fd0243e1b5bab8ed05af53a23b0f6f9ccc5b1eb2761166b0' //DESARROLLO 'ac663ef571b7c27627c2d03a4fc24c7d81a0cc3140e4976bfdb2a2d321478e745a894a534bd95d71aae7089137c62282010e907118ccc35ecd9e3180981fd471b883424d60910d820d247b8a13c8187e420b44022484ca65fe7f85a1674aea8529086c5f1be5e33ba8e17022dfc351eb57ee7c569f9f008136f96335c217998b'
    
    //Configuración ChatPDF
    URL_CHATPDF: 'https://api.chatpdf.com/v1/chats/message',
    TOKEN_CHATPDF: 'sec_MKSBZYHXACVxJPkRkucZ4XGaHx6YDjfZ',
    ARCHIVO_FUENTE_CHATPDF: 'cha_EYNqlY7iit2npe8LoGrYJ',
    
    //Tablas
    TABLA_CLIENTES: 'clientes',
    TABLA_CUENTAS: 'cuentas',
    TABLA_CAJAS: 'cajas',
    TABLA_CONCEPTOS: 'conceptos',
    TABLA_MOVIMIENTOS: 'movimientos',
    TABLA_TIPO_ARTICULOS: 'tipo-articulos',
    TABLA_MODELOS: 'modelos',
    TABLA_ARTICULOS: 'articulos',
    TABLA_ELEMENTOS: 'elementos',
    URL_LISTAR_CUENTAS: 'cuentas',
    URL_BUSCAR_CUENTA: 'cuentas?filters[banco][$contains]={BANCO}&filters[numero][$contains]={NUMERO}&populate=*',
    URL_BUSCAR_MOVIMIENTO: 'movimientos?filters[numero][$contains]=',
    URL_BUSCAR_CLIENTE: 'clientes?filters[numero][$contains]=',
    URL_BUSCAR_MEDIOS_PAGO: 'medios-de-pagos',
    HORA_INICIO_DESPACHOS: '19:30 PM',
    
    //Configuración ollama
    URL_OLLAMA: 'http://192.168.0.104:11434',
    MODELO_OLLAMA: "Asistente_Casalins", //'llama3',
    PROMPT_SALUDO: "Usted es un asistente experto, su idioma es el español, por favor responda en forma corta, debe clasificar la intensión del cliente con una sola palabra, si el cliente desea horarios o direcciones o números de teléfono de las sucursales usted debe responder “<sucursales>”, si el cliente desea realizar una reservación en ocasiones indicará la sede usted debe responder “<reserva>”, si el cliente desea conocer la carta de platos o el menú debe responder “<carta>”, si el cliente desea realizar un pedido usted debe responder “<pedido>”, si el cliente desea conocer el estado o avance de su pedido usted debe responder “<estado_pedido>”, si el cliente desea saber cómo se puede pagar usted debe responder “<medios_pago>”, si el cliente simplemente está saludando por favor responda de manera amable.",
    PROMPT_RESERVA: "Usted es el asistente de reservaciones del restaurante Casalins, su idioma es el español, por favor ignore toda pregunta que no tenga relación con su trabajo y responda en forma corta, debe ayudar a los clientes en la elaboración de su reservación. En cuanto a las sedes hay disponibles 4 sucursales, Cabecera de lunes a domingo, Cañaveral de lunes a domingo, Concha Acústica de lunes a domingo y Centro de lunes a viernes. En cuanto a la decoración existen 3 planes, “Plan velero de cupido” que tiene un valor de $80.000 e incluye: decoración de la mesa con mantelería y cristalería, cadena en luces con fotografías de recuerdo, cofre en forma de corazón con chocolates, postre artesanal de temporada y 2 globos metalizados en forma de corazón. “Plan Convoy en Alta Mar” que tiene un valor de $50.000 e incluye: decoración de la mesa con mantelería y cristalería, confeti metalizado, postre artesanal de la casa de su elección y 3 globos en helio. “Plan mesa de los navegantes” que tiene un valor de $30.000 e incluye: decoración de la mesa con mantelería y cristalería, confeti metalizado y 3 globos en helio. Debe solicitar al cliente el nombre de la persona que realiza la reservación, la fecha y hora de llegada al restaurante, preguntarle si desea decoración cuál de los planes, preguntar el tipo de ocasión, preguntar el nombre y sexo de la persona homenajeada (hombre o mujer), preguntar la cantidad de personas y preguntar si alguno de los invitados tiene dificultad para subir escaleras.",

    //Configuración Chatwoot
    PUERTO_EXPRESS: 4005,
    ENDPOINT_CHATWOOT: 'http://192.168.0.104:3000', //PODUCCION 'http://192.168.10.137:3000' //PRUEBAS 'http://192.168.0.104:3000'
    ID_CUENTA_CHATWOOT: '1',
    TOKEN_CHATWOOT: 'hw7sJX7EJASTeR1s8UACjFoF', //PODUCCION eqJ4sxB5ufZjebJD99cA1nZu //PRUEBAS hw7sJX7EJASTeR1s8UACjFoF
    BANDEJA_DE_ENTRADA: 'Atencion al cliente', //PODUCCION BotWhatsAppCallcenter //PRUEBAS BandejaPrueba
    
});