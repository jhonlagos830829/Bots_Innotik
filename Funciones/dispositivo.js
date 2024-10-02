const RosApi = require('node-routeros').RouterOSAPI;
const configuracion = require('../Configuracion/configuracion');


async function LeerConfiguracion() {

  //Declaracion de variables
  const fs = require('fs');
  let contenidoArchivo = [];

  try {

      //Leer el contenido del archivo
      contenidoArchivo =  JSON.parse(fs.readFileSync('Configuracion/configuracion.json', 'utf8'));
      //console.log(contenidoArchivo);

  } catch (err) {

      //Mostrar el mensaje de error
      console.error(err);

  }

  //Retornar el contenido del archivo
  return contenidoArchivo;
}

async function ObtenerServiciosSuspendidosPppoe(ip, usuario, clave){
  
  try {
      
    //Configurar la conexión con el dispositivo
      const conexion = new RosApi({
          host: ip,
          user: usuario,
          password: clave,
      });

      //Conectar
      await conexion.connect()

      //Ejecutar el comando
      var datos = await conexion.write('/ppp/secret/print', ['?profile=Pendiente-Pago'])

      //Cerrar la conexión
      await conexion.close()
     

  } catch (err) {

      //Mostrar el mensaje de error
      console.error(err);

  }

  //Retornar los datos de salida
  return datos;

}

async function ObtenerServiciosSuspendidosDhcp(ip, usuario, clave){
  
  try {
      
    //Configurar la conexión con el dispositivo
      const conexion = new RosApi({
          host: ip,
          user: usuario,
          password: clave,
      });

      //Conectar
      await conexion.connect()

      //Ejecutar el comando
      var datos = await conexion.write('/ip/firewall/address-list/print', ['?list=Pendiente-Pago'])

      //Cerrar la conexión
      await conexion.close()
     

  } catch (err) {

      //Mostrar el mensaje de error
      console.error(err);

  }

  //Retornar los datos de salida
  return datos;

}

module.exports.LeerConfiguracion = LeerConfiguracion;
module.exports.ObtenerServiciosSuspendidosPppoe = ObtenerServiciosSuspendidosPppoe;
module.exports.ObtenerServiciosSuspendidosDhcp = ObtenerServiciosSuspendidosDhcp;