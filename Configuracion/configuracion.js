module.exports = Object.freeze({
    
    //Constantes de configuración
    NOMBRE_BOT: 'Innotik Aistencia Técnica',
    TIEMPO_ESPERA_RESPUESTA: 120, //PODUCCION 1200 //PRUEBAS 30
    NUMERO_NOTIFICAR: '573013584693' + '@s.whatsapp.net',

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
    TABLA_MOVIMIENTOS: 'movimientos',
    URL_BUSCAR_CUENTA: 'cuentas?filters[numero][$contains]=',
    URL_BUSCAR_MOVIMIENTO: 'movimientos?filters[numero][$contains]=',
    URL_BUSCAR_CLIENTE: 'clientes?filters[numero][$contains]=',
    URL_BUSCAR_MEDIOS_PAGO: 'medios-de-pagos',
    HORA_INICIO_DESPACHOS: '19:30 PM',
    
});