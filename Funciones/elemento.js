const configuracion = require('../Configuracion/configuracion');
const basedatos = require('./basedatos')

/**
 * Guarda un artículo en la base de datos
 * @param {*} fechaCompra - Fecha de compra
 * @param {*} factura - Factura de compra
 * @param {*} mac - MAC del dispositivo
 * @param {*} serial - Serial del dispositivo
 * @param {*} precio - Precio del dispositivo
 * @param {*} articulo - Id del artículo
 * @param {*} proveedor - Id del proveedor
 * @returns 
 */
async function Guardar (fechaCompra, factura, mac, serial, precio, articulo, proveedor){

    //Configurar los datos a almacenar
    try {

        //Armar la estructura JSON con los datos a almacenar
        let datos = JSON.stringify({
            "data": {
                "fechaCompra": fechaCompra,
                "factura": factura,
                "mac": mac,
                "serial": serial,
                "precio": precio,
                "articulo": articulo,
                "proveedor": proveedor
            }
        });

        //Guardar en la base de datos
        salida = await basedatos.Guardar(datos, configuracion.TABLA_ELEMENTOS)

    } catch (err) {

        //Mostrar el mensaje de error
        console.error(err);

    }

    return salida;
    
}

/**
 * Obtiene los datos de un elemento a partir de la MAC o el número de serie
 * @param {*} mac - MAC del dispositivo
 * @param {*} serial - Serial del dispositivo
 * @returns 
 */
async function obtenerElemento(mac, serial){
  
    //Variable para obtener los resultados de la búsqueda
    var datosElemento
    
    //Configurar los datos a almacenar
    try {
  
      //Guardar en la base de datos
      datosElemento = await basedatos.Buscar(configuracion.TABLA_ELEMENTOS + '?filters[mac][$contains]=' + mac + '&filters[serial][$contains]=' + serial + '&populate=*')
  
      // console.log('Dele -> ' + JSON.stringify(datosElemento))
  
    } catch (err) {
  
      //Mostrar el mensaje de error
      console.error(err);
  
    }
  
    //Retornar los datos
    return datosElemento;
  
  }
  

module.exports = { Guardar, obtenerElemento }