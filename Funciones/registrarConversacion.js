//const {ctx} = require('@bot-whatsapp/bot')
const axios = require('axios').default;
const configuracion = require('../Configuracion/configuracion');
//const { ctx } = require('../FlujosBotAsistenciaTecnica/flujoSaludo');

function guardarEnBaseDatos(data, tablaBaseDatos){
  
  //Declaracion de variables
  const http = require('http');
  
  try {
    
    //Variable de configuración
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: configuracion.URL_STRAPI + tablaBaseDatos,
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer ' + configuracion.TOKEN_STRAPI
      },
      data : data
    };
    
    axios.request(config)
    .then((response) => {
      //console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      //console.log(error);
      console.log('Error al insertar los datos, ' + data + ' el sistema despondió\n\n' + error);
    });


  } catch (err) {

    //Mostrar el mensaje de error
    console.error(err);

  }
  return true;
}

async function buscarEnBaseDatos (url, campo){
  
  //Declaracion de variables
  const http = require('http');
  var datosCita;
  
  try {
    
    //Variable de configuración de los parámetros
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: configuracion.URL_STRAPI + url + campo,
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer ' + configuracion.TOKEN_STRAPI
      }
    };

    //Realizar la consulta
    await axios.request(config)
    .then((response) => {

      //Obtener en la variable los datos retornados
      //datosCita = JSON.stringify(response.data);
      datosCita = response.data.data[0];

    })
    .catch((error) => {

      //Mostrar el mensaje de error
      console.log('Error al insertar los datos, ' + data + ' el sistema despondió\n\n' + error);

    });

  } catch (err) {

    //Mostrar el mensaje de error
    console.error(err);

  }
  return datosCita;
}

function guardarConversacionVIEJA(NombreBot, idConversacion, nombreWhatsappCliente, telefonoCliente, mensajeBot, mensajeCliente){
  
  //Remover los emojis que hayan en los mensajes
  nombreWhatsappCliente = nombreWhatsappCliente.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
  mensajeBot = mensajeBot.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
  mensajeCliente = mensajeCliente.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
  
  //Obtener la fecha del sistema
  fechaBruta = new Date()
  fechaFormateada = fechaBruta.getFullYear() + '-' + (fechaBruta.getMonth() + 1) + '-' + fechaBruta.getDate() + ' ' + fechaBruta.getHours() + ':' + fechaBruta.getMinutes() + ':' + fechaBruta.getSeconds()

  //Configurar los datos a almacenar
  try {

    let data = JSON.stringify({
      "data": {
        "fecha": fechaBruta,
        "nombreBot": NombreBot,
        "idConversacion": idConversacion,
        "nombreWhatsappCliente": nombreWhatsappCliente,
        "telefonoCliente": telefonoCliente,
        "mensajeBot": mensajeBot,
        "mensajeCliente": mensajeCliente
      }
    });

    //Guardar en la base de datos
    this.guardarEnBaseDatos(data, 'conversaciones')

  } catch (err) {

    //Mostrar el mensaje de error
    console.error(err);

  }
  return true;
}

function guardarConversacion(ctx, mensajeBot){
  
  let nombreBot = configuracion.NOMBRE_BOT 
  let idConversacion = ctx.key.id
  let nombreWhatsappCliente = ctx.pushName
  let telefonoCliente = ctx.from
  let mensajeCliente = ctx.body

  //Remover los emojis que hayan en los mensajes
  nombreWhatsappCliente = nombreWhatsappCliente.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
  mensajeBot = mensajeBot.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
  mensajeCliente = mensajeCliente.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
  
  //Obtener la fecha del sistema
  fechaBruta = new Date()
  fechaFormateada = fechaBruta.getFullYear() + '-' + (fechaBruta.getMonth() + 1) + '-' + fechaBruta.getDate() + ' ' + fechaBruta.getHours() + ':' + fechaBruta.getMinutes() + ':' + fechaBruta.getSeconds()
  
  //Configurar los datos a almacenar
  try {

    let data = JSON.stringify({
      "data": {
        "fecha": fechaBruta,
        "nombreBot": nombreBot,
        "idConversacion": idConversacion,
        "nombreWhatsappCliente": nombreWhatsappCliente,
        "telefonoCliente": telefonoCliente,
        "mensajeBot": mensajeBot,
        "mensajeCliente": mensajeCliente
      }
    });
    
    //Guardar en la base de datos
    this.guardarEnBaseDatos(data, 'conversaciones')

  } catch (err) {

    //Mostrar el mensaje de error
    console.error(err);

  }
  return true;
}

function guardarCita(ctx, nombreCliente, fecha, idCalendarioCita, estado){
  
  let nombreBot = configuracion.NOMBRE_BOT 
  let telefonoCliente = ctx.from
  let fechaCita = Date.parse(fecha)

  //Configurar los datos a almacenar
  try {

    let data = JSON.stringify({
      "data": {
        "nombreBot": nombreBot,
        "telefonoCliente": telefonoCliente,
        "nombreCliente": nombreCliente,
        "fecha": fechaCita,
        "idCalendarioCita": idCalendarioCita,
        "estado": estado
      }
    });

    //Guardar en la base de datos
    this.guardarEnBaseDatos(data, 'citas')

  } catch (err) {

    //Mostrar el mensaje de error
    console.error(err);

  }
  return true;
}

async function obtenerCita(idCalendarioCita){
  
  //Obtener la fecha del sistema
  //fechaBruta = new Date()
  //fechaFormateada = fechaBruta.getFullYear() + '-' + (fechaBruta.getMonth() + 1) + '-' + fechaBruta.getDate() + ' ' + fechaBruta.getHours() + ':' + fechaBruta.getMinutes() + ':' + fechaBruta.getSeconds()

  //let fechaCita = Date.parse(fecha)

  var datosCita

  //Configurar los datos a almacenar
  try {

    /*
    let data = JSON.stringify({
      "data": {
        "nombreBot": nombreBot,
        "telefonoCliente": telefonoCliente,
        "turno": turno,
        "fecha": fechaCita,
        "idCalendarioCita": idCalendarioCita,
        "estado": estado
      }
    });
    */

    //Guardar en la base de datos
    datosCita = await this.buscarEnBaseDatos(configuracion.URL_BUSCAR_CITA, idCalendarioCita)

    //console.log('Dele -> ' + datosCita[0].id)

  } catch (err) {

    //Mostrar el mensaje de error
    console.error(err);

  }
  return datosCita;
}

//Funcion para regristrar las conversaciones
function registrarConversacion(NombreBot, idConversacion, nombreWhatsappCliente, telefonoCliente, mensajeBot, mensajeCliente) {

  //Remover los emojis que hayan en los mensajes
  nombreWhatsappCliente = nombreWhatsappCliente.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
  mensajeBot = mensajeBot.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
  mensajeCliente = mensajeBot.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
  
  //Declaracion de variables
  const fs = require('fs');
  
  //Obtener la fecha del sistema
  fechaBruta = new Date()
  fechaFormateada = fechaBruta.getFullYear() + '-' + (fechaBruta.getMonth() + 1) + '-' + fechaBruta.getDate() + ' ' + fechaBruta.getHours() + ':' + fechaBruta.getMinutes() + ':' + fechaBruta.getSeconds()

  //Elaborar el nombde del directorio donde se guardarán las imagenes
  const nombreDirectorioConversaciones = 'Conversaciones_Bot_' + NombreBot + '/' + fechaBruta.getFullYear() + '-' + (fechaBruta.getMonth() + 1) + '-' + fechaBruta.getDate()

  //Si el directorio no existe
  if (!fs.existsSync(nombreDirectorioConversaciones)){

      //Crear el directorio
      fs.mkdirSync(nombreDirectorioConversaciones, { recursive: true });

  }

  //Guardar el log en el archivo
  fs.appendFileSync(nombreDirectorioConversaciones + '/' + telefonoCliente + '.txt', 'Fecha: ' + fechaFormateada + '\n' + 'Pregunta: ' + mensajeBot + '\n' + 'Respuesta: ' + mensajeCliente + '\n\n');

  //Declaracion de variables
  const http = require('http');
  
  try {

    let data = JSON.stringify({
      "data": {
        "fecha": fechaBruta,
        "nombreBot": NombreBot,
        "idConversacion": idConversacion,
        "nombreWhatsappCliente": nombreWhatsappCliente,
        "telefonoCliente": telefonoCliente,
        "mensajeBot": mensajeBot,
        "mensajeCliente": mensajeCliente
      }
    });


    //console.log(data)

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: configuracion.URL_STRAPI,
      //url: 'http://127.0.0.1:1337/api/conversaciones',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer ' + configuracion.TOKEN_STRAPI
      },
      data : data
    };

    axios.request(config)
    .then((response) => {
      //console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      //console.log(error);
      console.log('Error al insertar los datos, ' + data + ' el sistema despondió\n\n' + error);
    });


  } catch (err) {

    //Mostrar el mensaje de error
    console.error(err);

  }
  return true;
}

//Funcion para registrar pagos
function registrarMovimientoCuenta(codigoCuentaMovimiento, conceptoMovimiento, fechaMovimiento, tipoMovimiento, origenMovimiento, destinoMovimiento, notaMovimiento, valorMovimiento, referenciaMovimiento) {

  //Declaracion de variables
  const http = require('http');
  
  try {

      //console.log('Voy a guardar este nombre -> ' + nombreCliente + ' con ésta línea -> ' + telefonoCliente);  
      //Codificar la URL por si contiene espacios
      var ruta = encodeURI('/proyectos/Innotik/Pagos/clases/crearMovimientoBot.php?codigoCuentaMovimiento='+ codigoCuentaMovimiento +'&conceptoMovimiento=' + conceptoMovimiento + '&fechaMovimiento=' + fechaMovimiento + '&tipoMovimiento=' + tipoMovimiento + '&origenMovimiento=' + origenMovimiento + '&destinoMovimiento=' + destinoMovimiento + '&notaMovimiento=' + notaMovimiento + '&valorMovimiento=' + valorMovimiento + '&referenciaMovimiento=' + referenciaMovimiento);
      //Opciones de la peticion que se realizará
      var options = {
          host: 'innotik.com.co',
          port: 80,
          path: ruta,
          method: 'GET',
          headers: {
            'content-type': 'application/json; charset=utf-8'
          }
        };
        
      //console.log('Ruta: ' + options.path);
        
      http.request(options, function(res) {
          //console.log('STATUS: ' + res.statusCode);
          //console.log('HEADERS: ' + JSON.stringify(res.headers));
          //res.headers['content-type'];
          //res.setEncoding('utf8');
          res.on('data', function (chunk) {
          //console.log('BODY: ' + chunk);
          });
        }).end();

  } catch (err) {


    //Mostrar el mensaje de error
    console.error(err);

  }
  return true;
}

module.exports.guardarEnBaseDatos = guardarEnBaseDatos;
module.exports.buscarEnBaseDatos = buscarEnBaseDatos;
module.exports.obtenerCita = obtenerCita;
module.exports.guardarConversacion = guardarConversacion;
module.exports.guardarCita = guardarCita;
module.exports.registrarConversacion = registrarConversacion;
module.exports.registrarMovimientoCuenta = registrarMovimientoCuenta;