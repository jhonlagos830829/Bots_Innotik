const configuracion = require('../Configuracion/configuracion');
const basedatos = require('./basedatos')

/**
 * Guarda un cliente en la base de datos
 * @param {*} idCliente - Id del cliente al cual pertenece el pago
 * @param {*} medio - Medio desde el cual se realizó el movimiento
 * @param {*} fecha - Fecha del movimiento
 * @param {*} cuenta - Id de la cuenta del movimiento
 * @param {*} valor - Valor del movimiento
 * @param {*} referencia - Referencia del movimiento
 * @param {*} conversacion - Nota que el cliente puso al moento de realizar el movimiento
 * @param {*} reporta - Rol de la persona que reporta, cliente o funcionario
 * @param {*} numeroReporta - Número de WhatsApp desde el cual se reporta el movimiento
 * @param {*} descripcion - Descripción del movimiento
 * @param {*} cUnico - El campo C.UNICO del comprobante
 * @param {*} recibo - El campo RECIBO del comprobante
 * @param {*} ter - El campo TER del comprobante
 * @param {*} rrn - El campo RRN del comprobante
 * @param {*} apro - El campo APRO del comprobante
 * @param {*} verificado - Si el movimiento ha sido o no verificado
 * @returns 
 */
async function Guardar (idCliente, medio, fecha, cuenta, valor, referencia, conversacion, reporta, numeroReporta, descripcion, cUnico, recibo, ter, rrn, apro, comprobante, origen, verificado){
    
    //Configurar los datos a almacenar
    try {

        //Armar la estructura JSON con los datos a almacenar
        let datos = JSON.stringify({
            "data": {
                "cliente": idCliente,
                "medio": medio,
                "fecha": fecha,
                "cuenta": cuenta,
                "valor": valor,
                "referencia": referencia,
                "conversacion": conversacion,
                "reporta": reporta,
                "numeroReporta": numeroReporta,
                "descripcion": descripcion,
                "cUnico": cUnico,
                "recibo": recibo,
                "ter": ter,
                "rrn": rrn,
                "apro": apro,
                "comprobante": comprobante,
                "origen": origen,
                "verificado": verificado
            }
        });
        console.log(datos)
        //Guardar en la base de datos
        salida = await basedatos.Guardar(datos, configuracion.TABLA_MOVIMIENTOS)

    } catch (err) {

        //Mostrar el mensaje de error
        console.error(err);

    }

    return salida;
    
}

/**
 * Obtiene los datos del movimiento a partir de los valores proporcionados
 * @param {*} numeroWhatsapp - Número de WhatsApp del cliente
 * @returns 
 */
async function obtenerMovimiento(fecha, idCuenta, valor, referencia, cunico, recibo, rrn, apro){
  
    //Variable para obtener los resultados de la búsqueda
    var datosCliente
    
    //Configurar los datos a almacenar
    try {
  
      //Guardar en la base de datos
      datosCliente = await basedatos.Buscar(configuracion.TABLA_MOVIMIENTOS + '?filters[fecha][$eq]=' + fecha.toISOString() + '&filters[cuenta][id][$eq]=' + idCuenta + '&filters[valor][$eq]=' + valor + '&filters[referencia][$contains]=' + referencia + '&filters[cUnico][$contains]=' + cunico + '&filters[recibo][$contains]=' + recibo + '&filters[rrn][$contains]=' + rrn + '&filters[apro][$contains]=' + apro, '')
  
      //console.log('Dele -> ' + datosCliente)
  
    } catch (err) {
  
      //Mostrar el mensaje de error
      console.error(err);
  
    }
  
    //Retornar los datos
    return datosCliente;
  
  }
  

module.exports = { Guardar, obtenerMovimiento }