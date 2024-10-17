const configuracion = require('../Configuracion/configuracion');
const basedatos = require('./basedatos')

/**
 * Guarda un artículo en la base de datos
 * @param {*} nombre - Nombre del modelo
 * @returns 
 */
async function Guardar (nombre){

    //Configurar los datos a almacenar
    try {

        //Armar la estructura JSON con los datos a almacenar
        let datos = JSON.stringify({
            "data": {
                "nombre": nombre
            }
        });

        //Guardar en la base de datos
        salida = await basedatos.Guardar(datos, configuracion.TABLA_MODELOS)

    } catch (err) {

        //Mostrar el mensaje de error
        console.error(err);

    }

    return salida;
    
}

/**
 * Obtiene los datos del cliente a partir del numero de WhatsApp del cliente
 * @param {*} identificacion - Número de identificacion del cliente
 * @param {*} nombre - Nombre del cliente
 * @param {*} numeroWhatsapp - Número de WhatsApp del cliente
 * @returns 
 */
async function obtenerCliente(identificacion, nombre, numeroWhatsapp){
  
    //Variable para obtener los resultados de la búsqueda
    var datosCliente
    
    //Configurar los datos a almacenar
    try {
  
      //Guardar en la base de datos
      datosCliente = await basedatos.Buscar(configuracion.TABLA_CLIENTES + '?filters[identificacion][$contains]=' + identificacion + '&filters[nombre][$contains]=' + nombre + '&filters[numeroWhatsapp][$contains]=' + numeroWhatsapp, '&populate=*')
  
      //console.log('Dele -> ' + datosCliente)
  
    } catch (err) {
  
      //Mostrar el mensaje de error
      console.error(err);
  
    }
  
    //Retornar los datos
    return datosCliente;
  
  }
  

module.exports = { Guardar, obtenerCliente }