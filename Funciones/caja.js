const configuracion = require('../Configuracion/configuracion');
const basedatos = require('./basedatos')

/**
 * Guarda un cliente en la base de datos
 * @param {*} identificacion - Identificación del cliente
 * @param {*} nombre - Nombre del cliente
 * @param {*} numeroWhatsapp - Número de WhatsApp del cliente
 * @param {*} numeroTelefonico - Número telefónico del cliente
 * @param {*} direccion - Dirección del cliente
 * @param {*} email - Email del cliente
 * @returns 
 */
async function Guardar (identificacion, nombre, numeroWhatsapp, numeroTelefonico, direccion, email){
    console.log('Me paso ' + nombre)
    //Configurar los datos a almacenar
    try {

        //Armar la estructura JSON con los datos a almacenar
        let datos = JSON.stringify({
            "data": {
                "identificacion": identificacion,
                "nombre": nombre,
                "numeroWhatsapp": numeroWhatsapp,
                "numeroTelefonico": numeroTelefonico,
                "direccion": direccion,
                "email": email
            }
        });

        //Guardar en la base de datos
        salida = await basedatos.Guardar(datos, configuracion.TABLA_CLIENTES)

    } catch (err) {

        //Mostrar el mensaje de error
        console.error(err);

    }

    return salida;
    
}

/**
 * Obtiene los datos de la caja a partir del numero de WhatsApp
 * @param {*} nombre - Nombre del cliente
 * @param {*} numeroWhatsapp - Número de WhatsApp del cliente
 * @returns 
 */
async function obtenerCaja(numeroWhatsapp, nombre){
  
    //Variable para obtener los resultados de la búsqueda
    var datosCaja
    
    //Configurar los datos a almacenar
    try {
  
      //Guardar en la base de datos
      datosCaja = await basedatos.Buscar(configuracion.TABLA_CAJAS + '?filters[numeroWhatsapp][$contains]=' + numeroWhatsapp + '&filters[nombre][$contains]=' + nombre, '&populate=*')
  
      //console.log('Dele -> ' + datosCliente)
  
    } catch (err) {
  
      //Mostrar el mensaje de error
      console.error(err);
  
    }
  
    //Retornar los datos
    return datosCaja;
  
  }
  

module.exports = { Guardar, obtenerCaja }