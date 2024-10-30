const axios = require('axios').default;
const configuracion = require('../Configuracion/configuracion');

/**
 * Guarda un cojunto de datos en la base de datos
 * @param {JSON} datos - Datos en formato JSON que serán almacenados en la base de datos
 * @param {string} url - Url de la tabla de la base de datos donde se almacenarán los datos
 * @returns 
 */
async function Guardar(datos, url){
  
    //Declaracion de variables
    const http = require('http');
    var salida
    
    try {
      
      //Variable de configuración
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: configuracion.URL_API + url,
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': 'Bearer ' + configuracion.TOKEN_STRAPI
        },
        data : datos
      };
  

      //respuesta = await axios.post(configuracion.URL_CHATPDF, data, config).then((response) => response.data.content);
      salida = await axios.request(config).then((response) => response.data);

      // axios.request(config)
      // .then((response) => {
      //   //console.log(JSON.stringify(response.data));
      //   salida = JSON.stringify(response.data);
      // })
      // .catch((error) => {
      //   console.log(error);
      //   console.log('Error al insertar los datos, ' + datos + ' el sistema despondió\n\n' + error);
      // });
  
  
    } catch (err) {
  
      //Mostrar el mensaje de error
      console.error(err);
  
    }
    
    return salida;
  }

/**
 * Obtiene las facturas de un cliente a partir de su id
 * @param {JSON} id - Id del cliente en el CRM
 * @returns 
 */
async function ObtenerFacturasCliente (id){

    //Declaracion de variables
    const http = require('http');
    var facturas;
    
    try {
      
      //Variable de configuración de los parámetros
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: configuracion.URL_API_CRM + 'invoices?clientId=' + id,
        headers: { 
          'Content-Type': 'application/json', 
          'X-Auth-App-Key': configuracion.API_KEY_CRM
        }
      };
      
      //Realizar la consulta
      await axios.request(config)
      .then((response) => {
        
        //Obtener en la variable los datos retornados
        facturas = response.data;
  
      })
      .catch((error) => {
        
        //Mostrar el mensaje de error
        console.log('Error al consultar los datos,  el sistema despondió\n\n' + error);
  
      });
  
    } catch (err) {
  
      //Mostrar el mensaje de error
      console.error(err);
  
    }
    
    //Devolver las direcciones del cliente
    return facturas;
  }

/**
 * Guarda un pago en la base de datos a partir del id del cliente
 * @param {JSON} idCliente - Id del cliente en el CRM
 * @param {JSON} idMetodo - Id del método de pago // La lista me métodos de pago se puede cosultar con https://ameizyn.unmsapp.com/crm/api/v1.0/payment-methods?visible=1&isSystem=1
 * @param {JSON} fechaCreacion - Fecha de la creación del pago
 * @param {JSON} valor - Valor pagado
 * @param {JSON} nota - Nota aclaratoria
 * @param {JSON} idUsuario - Id del usuario que realizó el pago
 * @returns 
 */
async function RegistrarPago (idCliente, idMetodo, fechaCreacion, valor, nota, idUsuario){

  //Declaracion de variables
  const http = require('http');
  var datosPago;
  //Armar la estructura JSON con los datos a almacenar
  let datos = `{
        "currencyCode": "COP",
        "applyToInvoicesAutomatically": true,
        "clientId": ${idCliente},
        "methodId": "${idMetodo}",
        "createdDate": "${fechaCreacion}",
        "amount": ${valor},
        "note": "${nota}",
        "userId": ${idUsuario}
    }
  `;

  //let datos = JSON.parse(datosCadena)

  //console.log('Esto es lo que va a enviar: ' + datos)
  
  try {
    
    //Variable de configuración de los parámetros
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: configuracion.URL_API_CRM + 'payments',
      headers: { 
        'Content-Type': 'application/json', 
        'X-Auth-App-Key': configuracion.API_KEY_CRM
      },
      data : datos
    };
    
    //Realizar la consulta
    await axios.request(config)
    .then((response) => {
      
      //Obtener en la variable los datos retornados
      datosPago = response.data;

    })
    .catch((error) => {
      
      //Mostrar el mensaje de error
      console.log('Error al consultar los datos,  el sistema despondió\n\n' + error);

    });

  } catch (err) {

    //Mostrar el mensaje de error
    console.error(err);

  }
  
  //Devolver las direcciones del cliente
  return datosPago;
}

/**
 * Envía un recibo de pago a partir de su id
 * @param {JSON} id - Id del recibo de pago en el CRM
 * @returns 
 */
async function EnviarRecibo (id){

  //Declaracion de variables
  const http = require('http');
  var facturas;
  
  try {
    
    //Variable de configuración de los parámetros
    let config = {
      method: 'patch',
      maxBodyLength: Infinity,
      url: configuracion.URL_API_CRM + 'payments/' + id + '/send-receipt',
      headers: { 
        'Content-Type': 'application/json', 
        'X-Auth-App-Key': configuracion.API_KEY_CRM
      }
    };
    
    //Realizar la consulta
    await axios.request(config)
    .then((response) => {
      
      //Obtener en la variable los datos retornados
      facturas = response.data;

    })
    .catch((error) => {
      
      //Mostrar el mensaje de error
      console.log('Error al consultar los datos,  el sistema despondió\n\n' + error);

    });

  } catch (err) {

    //Mostrar el mensaje de error
    console.error(err);

  }
  
  //Devolver las direcciones del cliente
  return facturas;
}

module.exports = {Guardar, ObtenerFacturasCliente, RegistrarPago, EnviarRecibo}