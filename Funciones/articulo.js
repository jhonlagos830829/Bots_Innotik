const configuracion = require('../Configuracion/configuracion');
const basedatos = require('./basedatos')

/**
 * Guarda un artículo en la base de datos
 * @param {*} nombre - Nombre con el que se conoce el artículo
 * @param {*} codigoUpc - Código UPC del artículo
 * @param {*} codigoEan13 - Código EAN13 del artículo
 * @param {*} tipo_articulo - Id del tipo de artículo
 * @param {*} fabricante - Id del fabricante
 * @param {*} modelo - Id del modelo
 * @param {*} unidad_medida - Id de la unidad de medida
 * @returns 
 */
async function Guardar (nombre, codigoUpc, codigoEan13, tipo_articulo, fabricante, modelo, unidad_medida){

    //Configurar los datos a almacenar
    try {

        //Armar la estructura JSON con los datos a almacenar
        let datos = JSON.stringify({
            "data": {
                "nombre": nombre,
                "codigoUpc": codigoUpc,
                "codigoEan13": codigoEan13,
                "tipo_articulo": tipo_articulo,
                "fabricante": fabricante,
                "modelo": modelo,
                "unidad_medida": unidad_medida
            }
        });

        //Guardar en la base de datos
        salida = await basedatos.Guardar(datos, configuracion.TABLA_ARTICULOS)

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
async function obtenerArticulo(nombre, codigoUpc, codigoEan13, tipo_articulo, fabricante, modelo){
  
    //Variable para obtener los resultados de la búsqueda
    var datosArticulo
    
    //Configurar los datos a almacenar
    try {
  
      //Guardar en la base de datos
      datosArticulo = await basedatos.Buscar(configuracion.TABLA_ARTICULOS + '?filters[nombre][$contains]=' + nombre + '&filters[codigoUpc][$contains]=' + codigoUpc + '&filters[codigoEan13][$contains]=' + codigoEan13 + '&filters[tipo_articulo][nombre][$contains]=' + tipo_articulo + '&filters[fabricante][nombre][$contains]=' + fabricante + '&filters[modelo][nombre][$contains]=' + modelo + '&populate=*', '')

      console.log('Dele -> ' + JSON.stringify(datosArticulo))
  
    } catch (err) {
  
      //Mostrar el mensaje de error
      console.error(err);
  
    }
  
    //Retornar los datos
    return datosArticulo;
  
  }
  

module.exports = { Guardar, obtenerArticulo }