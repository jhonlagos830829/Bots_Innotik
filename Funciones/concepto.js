const configuracion = require('../Configuracion/configuracion');
const basedatos = require('./basedatos')

/**
 * Guarda un concepto en la base de datos
 * @param {*} nombre - Nombre del concepto
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
        salida = await basedatos.Guardar(datos, configuracion.TABLA_CONCEPTOS)

    } catch (err) {

        //Mostrar el mensaje de error
        console.error(err);

    }

    return salida;
    
}

/**
 * Obtiene los datos del concepto a partir del nombre
 * @param {*} nombre - Nombre del conceptoo
 * @returns 
 */
async function obtenerCliente(nombre){
  
    //Variable para obtener los resultados de la búsqueda
    var datosConcepto
    
    //Configurar los datos a almacenar
    try {
  
      //Guardar en la base de datos
      datosConcepto = await basedatos.Buscar(configuracion.TABLA_CONCEPTOS + '?filters[nombre][$contains]=' + nombre, '&populate=*')
  
      //console.log('Dele -> ' + datosCliente)
  
    } catch (err) {
  
      //Mostrar el mensaje de error
      console.error(err);
  
    }
  
    //Retornar los datos
    return datosConcepto;
  
  }
  

module.exports = { Guardar, obtenerCliente }