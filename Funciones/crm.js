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

module.exports = {Guardar, ObtenerFacturasCliente}