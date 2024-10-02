const configuracion = require('../Configuracion/configuracion');
const basedatos = require('./basedatos')

/**
 * Guarda un cliente en la base de datos
 * @param {*} banco - Banco al cual pertenece la cuenta
 * @param {*} tipo - Tipo de cuenta
 * @param {*} numero - Número de la cuenta
 * @param {*} titular - Titular de la cuenta
 * @param {*} identificacion - Identificación del titular de la cuenta
 * @returns 
 */
async function Guardar (banco, tipo, numero, titular, identificacion){
    
    //Configurar los datos a almacenar
    try {

        //Armar la estructura JSON con los datos a almacenar
        let datos = JSON.stringify({
            "data": {
                "banco": banco,
                "tipo": tipo,
                "numero": numero,
                "titular": titular,
                "identificacion": identificacion
            }
        });

        //Guardar en la base de datos
        salida = await basedatos.Guardar(datos, configuracion.TABLA_CUENTAS)

    } catch (err) {

        //Mostrar el mensaje de error
        console.error(err);

    }

    return salida;
    
}

/**
 * Obtiene los datos del cliente a partir del numero de WhatsApp del cliente
 * @param {*} numero - Número de la cuenta
 * @returns 
 */
async function obtenerCuenta(numero){
    
    //Variable para obtener los resultados de la búsqueda
    var datosCliente
    
    //Configurar los datos a almacenar
    try {
  
      //Guardar en la base de datos
      datosCliente = await basedatos.Buscar(configuracion.URL_BUSCAR_CUENTA, numero + '&populate=*')
  
      //console.log('Dele -> ' + datosCliente)
  
    } catch (err) {
  
      //Mostrar el mensaje de error
      console.error(err);
  
    }
  
    //Retornar los datos
    return datosCliente;
  
  }
  

module.exports = { Guardar, obtenerCuenta}