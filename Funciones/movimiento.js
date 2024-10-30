const configuracion = require('../Configuracion/configuracion');
const basedatos = require('./basedatos')

/**
 * Guarda un cliente en la base de datos
 * @param {*} medio - Medio a través del cual se realizó el pago
 * @param {*} fecha - Fecha en la cual se realizó el pago
 * @param {*} idCuenta - Id de la cuenta en la cual se realizó el pago
 * @param {*} valor - Valor pagado
 * @param {*} referencia - Referencia del pago
 * @param {*} conversacion - Conversación de Nequi respecto al pago
 * @param {*} reporta - Rol de quién realiza el reporte del pago
 * @param {*} numeroReporta - Número de WhatsApp desde el cual se reportó el pago
 * @param {*} descripcion - Descripción al momento de realizar el pago
 * @param {*} verificado - Estado de verificación del pago
 * @param {*} ter - Valor ter del comprobante de corresponsal bancolombia
 * @param {*} rrn - Valor rrn del comprobante de corresponsal bancolombia
 * @param {*} apro - Valor apro del comprobante de corresponsal bancolombia
 * @param {*} cunico - Valor cunico del comprobante de corresponsal bancolombia
 * @param {*} recibo - Valor recibo del comprobante de corresponsal bancolombia
 * @param {*} comprobante - Comprobante de la transferencia bancolombia
 * @param {*} origen - Origen de la transferencia bancolombia
 * @param {*} idCliente - Id del cliente al cual pertenece el pago
 * @param {*} idCaja - Ide de la caja a la cual pertenece el movimiento
 * @param {*} tipo - Tipo de movimiento Inreso, Ereso, Transferencia
 * @param {*} archivo - Ruta del archivo del comprobante de pago
 * @param {*} idConcepto - Id del concepto del movimiento
 * @returns 
 */
async function Guardar (medio, fecha, idCuenta, valor, referencia, conversacion, reporta, numeroReporta, descripcion, verificado, ter, rrn, apro, cunico, recibo, comprobante, origen, idCliente, idCaja, tipo, archivo, idConcepto){
    
    //Cambiar los valores undefined por vacíos
    
    if(medio == undefined || medio == ''){

      medio = null

    }

    if(fecha == undefined || fecha == ''){

      fecha = null

    }

    if(idCuenta == undefined || idCuenta == ''){

      idCuenta = null

    }

    if(valor == undefined || valor == ''){

      valor = null

    }
    
    if(referencia == undefined || referencia == ''){

      referencia = null

    }

    if(conversacion == undefined || conversacion == ''){

      conversacion = null

    }

    if(reporta == undefined || reporta == ''){

      reporta = null

    }

    if(numeroReporta == undefined || numeroReporta == ''){

      numeroReporta = null

    }

    if(descripcion == undefined || descripcion == ''){

      descripcion = null

    }

    // if(verificado == undefined || verificado == ''){

    //   verificado = null

    // }

    if(ter == undefined || ter == ''){

      ter = null

    }

    if(rrn == undefined || rrn == ''){

      rrn = null

    }

    if(apro == undefined || apro == ''){

      apro = null

    }

    if(cunico == undefined || cunico == ''){

      cunico = null

    }

    if(recibo == undefined || recibo == ''){

      recibo = null

    }

    if(comprobante == undefined || comprobante == ''){

      comprobante = null

    }

    if(origen == undefined || origen == ''){

      origen = null

    }

    if(idCliente == undefined || idCliente == ''){

      idCliente = null

    }

    if(idCaja == undefined || idCaja == ''){

      idCaja = null

    }

    if(tipo == undefined || tipo == ''){

      tipo = null

    }

    if(archivo == undefined || archivo == ''){

      archivo = null

    }

    if(idConcepto == undefined || idConcepto == ''){

      idConcepto = null

    }

    //Configurar los datos a almacenar
    try {

        //Armar la estructura JSON con los datos a almacenar
        let datos = JSON.stringify({
            "data": {
                "medio": medio,
                "fecha": fecha,
                "cuenta": idCuenta,
                "valor": valor,
                "referencia": referencia,
                "conversacion": conversacion,
                "reporta": reporta,
                "numeroReporta": numeroReporta,
                "descripcion": descripcion,
                "verificado": verificado,
                "ter": ter,
                "rrn": rrn,
                "apro": apro,
                "cUnico": cunico,
                "recibo": recibo,
                "comprobante": comprobante,
                "origen": origen,
                "cliente": idCliente,
                "caja": idCaja,
                "tipo": tipo,
                "archivo": archivo,
                "concepto": idConcepto
            }
        });
        
        //Guardar en la base de datos
        salida = await basedatos.Guardar(datos, configuracion.TABLA_MOVIMIENTOS)

    } catch (err) {

        //Mostrar el mensaje de error
        console.error(err);

    }

    return salida;
    
}

// /**
//  * Obtiene los datos del movimiento a partir de los valores proporcionados
//  * @param {*} medio - Medio a través del cual se realizó el pago
//  * @param {*} fecha - Fecha en la cual se realizó el pago
//  * @param {*} idCuenta - Id de la cuenta en la cual se realizó el pago
//  * @param {*} valor - Valor pagado
//  * @param {*} referencia - Referencia del pago
//  * @param {*} conversacion - Conversación de Nequi respecto al pago
//  * @param {*} reporta - Rol de quién realiza el reporte del pago
//  * @param {*} numeroReporta - Número de WhatsApp desde el cual se reportó el pago
//  * @param {*} descripcion - Descripción al momento de realizar el pago
//  * @param {*} verificado - Estado de verificación del pago
//  * @param {*} ter - Valor ter del comprobante de corresponsal bancolombia
//  * @param {*} rrn - Valor rrn del comprobante de corresponsal bancolombia
//  * @param {*} apro - Valor apro del comprobante de corresponsal bancolombia
//  * @param {*} cunico - Valor cunico del comprobante de corresponsal bancolombia
//  * @param {*} recibo - Valor recibo del comprobante de corresponsal bancolombia
//  * @param {*} comprobante - Comprobante de la transferencia bancolombia
//  * @param {*} origen - Origen de la transferencia bancolombia
//  * @param {*} idCliente - Id del cliente al cual pertenece el pago
//  * @param {*} idCaja - Ide de la caja a la cual pertenece el movimiento
//  * @param {*} tipo - Tipo de movimiento Inreso, Ereso, Transferencia
//  * @param {*} archivo - Ruta del archivo del comprobante de pago
//  * @param {*} idConcepto - Id del concepto del movimiento
//  * @returns 
//  */
// async function ObtenerMovimiento(medio, fecha, idCuenta, valor, referencia, conversacion, reporta, numeroReporta, descripcion, verificado, ter, rrn, apro, cunico, recibo, comprobante, origen, idCliente, idCaja, tipo, archivo, idConcepto){
  
//     let filtros = '?'   

//     //Si el medio no es vacío o indefinido
//     if(medio != '' && medio != undefined){

//       //Agregar al filtro el medio de pago
//       filtros = filtros + 'filters[medio][$eq]=' + medio

//     }

//     //Si la fecha no está vacía o indefinida
//     if(fecha != '' && fecha != undefined){

//       //Agregar al filtro la fecha
//       filtros = filtros + '&filters[fecha][$eq]=' + fecha

//     }

//     //Si el id de la cuenta no es vacío o indefinido
//     if(idCuenta != '' && idCuenta != undefined){

//       //Agregar el filtro de medio de pago
//       filtros = filtros + '&filters[cuenta][id][$eq]=' + idCuenta

//     }
    
//     //Si el valor no es vacío o indefinido
//     if(valor != '' && valor != undefined){

//       //Agregar el filtro de medio de pago
//       filtros = filtros + '&filters[valor][$eq]=' + valor

//     }

//     //Si la referencia no es vacía o indefinida
//     if(referencia != '' && referencia != undefined){

//       //Agregar el filtro de medio de pago
//       filtros = filtros + '&filters[referencia][$eq]=' + referencia

//     }

//     //Si la conversación no es vacía o indefinida
//     if(conversacion != '' && conversacion != undefined){

//       //Agregar el filtro de medio de pago
//       filtros = filtros + '&filters[conversacion][$eq]=' + conversacion

//     }

//     //Si quien reporta no es vacío o indefinido
//     if(reporta != '' && reporta != undefined){

//       //Agregar el filtro de medio de pago
//       filtros = filtros + '&filters[reporta][$eq]=' + reporta

//     }

//     //Si el numeroReporta no es vacío o indefinido
//     if(numeroReporta != '' && numeroReporta != undefined){

//       //Agregar el filtro de medio de pago
//       filtros = filtros + '&filters[numeroReporta][$eq]=' + numeroReporta

//     }

//     //Si la descripción no es vacía o indefinida
//     if(descripcion != '' && descripcion != undefined){

//       //Agregar el filtro de medio de pago
//       filtros = filtros + '&filters[descripcion][$eq]=' + descripcion

//     }

//     // if(verificado == undefined){

//     //   verificado = null

//     // }

//     //Si el ter no es vacío o indefinido
//     if(ter != '' && ter != undefined){

//       //Agregar el filtro de medio de pago
//       filtros = filtros + '&filters[ter][$eq]=' + ter

//     }

//     //Si el rrn no es vacío o indefinido
//     if(rrn != '' && rrn != undefined){

//       //Agregar el filtro de medio de pago
//       filtros = filtros + '&filters[rrn][$eq]=' + rrn

//     }

//     //Si el apro no es vacío o indefinido
//     if(apro != '' && apro != undefined){

//       //Agregar el filtro de apro
//       filtros = filtros + '&filters[apro][$eq]=' + apro

//     }

//     //Si el cunico no es vacío o indefinido
//     if(cunico != '' && cunico != undefined){

//       //Agregar el filtro de cUnico
//       filtros = filtros + '&filters[cUnico][$eq]=' + cunico

//     }

//     //Si el recibo no es vacío o indefinido
//     if(recibo != '' && recibo != undefined){

//       //Agregar el filtro de recibo
//       filtros = filtros + '&filters[recibo][$eq]=' + recibo

//     }

//     //Si el comprobante no es vacío o indefinido
//     if(comprobante != '' && comprobante != undefined){

//       //Agregar el filtro de recibo
//       filtros = filtros + '&filters[comprobante][$eq]=' + comprobante

//     }

//     //Si el origen no es vacío o indefinido
//     if(origen != '' && origen != undefined){

//       //Agregar el filtro de recibo
//       filtros = filtros + '&filters[origen][$eq]=' + origen

//     }

//     //Si el idCliente no es vacío o indefinido
//     if(idCliente != '' && idCliente != undefined){

//       //Agregar el filtro de recibo
//       filtros = filtros + '&filters[cliente][id][$eq]=' + idCliente

//     }

//     //Si el idCaja no es vacío o indefinido
//     if(idCaja != '' && idCaja != undefined){

//       //Agregar el filtro de recibo
//       filtros = filtros + '&filters[caja][id][$eq]=' + idCaja

//     }

//     //Si el tipo no es vacío o indefinido
//     if(tipo != '' && tipo != undefined){

//       //Agregar el filtro de tipo
//       filtros = filtros + '&filters[tipo][$eq]=' + tipo

//     }

//     //Si el archivo no es vacío o indefinido
//     if(archivo != '' && archivo != undefined){

//       //Agregar el filtro de tipo
//       filtros = filtros + '&filters[archivo][$eq]=' + archivo

//     }

//     //Si el idConcepto no es vacío o indefinido
//     if(idConcepto != '' && idConcepto != undefined){

//       //Agregar el filtro de tipo
//       filtros = filtros + '&filters[concepto][id][$eq]=' + idConcepto

//     }

//     //Variable para obtener los resultados de la búsqueda
//     var datosCliente
    
//     //Configurar los datos a almacenar
//     try {
  
//       //Guardar en la base de datos
//       datosCliente = await basedatos.Buscar(configuracion.TABLA_MOVIMIENTOS + filtros, '&populate=*')
  
//       //console.log('Dele -> ' + datosCliente)
  
//     } catch (err) {
  
//       //Mostrar el mensaje de error
//       console.error(err);
  
//     }
  
//     //Retornar los datos
//     return datosCliente;
  
//   }

// /**
//  * Obtiene los datos del movimiento a partir de los valores proporcionados
//  * @param {*} medio - Medio a través del cual se realizó el pago
//  * @param {*} fecha - Fecha en la cual se realizó el pago
//  * @param {*} idCuenta - Id de la cuenta en la cual se realizó el pago
//  * @param {*} valor - Valor pagado
//  * @param {*} referencia - Referencia del pago
//  * @param {*} conversacion - Conversación de Nequi respecto al pago
//  * @param {*} reporta - Rol de quién realiza el reporte del pago
//  * @param {*} numeroReporta - Número de WhatsApp desde el cual se reportó el pago
//  * @param {*} descripcion - Descripción al momento de realizar el pago
//  * @param {*} verificado - Estado de verificación del pago
//  * @param {*} ter - Valor ter del comprobante de corresponsal bancolombia
//  * @param {*} rrn - Valor rrn del comprobante de corresponsal bancolombia
//  * @param {*} apro - Valor apro del comprobante de corresponsal bancolombia
//  * @param {*} cunico - Valor cunico del comprobante de corresponsal bancolombia
//  * @param {*} recibo - Valor recibo del comprobante de corresponsal bancolombia
//  * @param {*} comprobante - Comprobante de la transferencia bancolombia
//  * @param {*} origen - Origen de la transferencia bancolombia
//  * @param {*} idCliente - Id del cliente al cual pertenece el pago
//  * @param {*} idCaja - Ide de la caja a la cual pertenece el movimiento
//  * @param {*} tipo - Tipo de movimiento Inreso, Ereso, Transferencia
//  * @param {*} archivo - Ruta del archivo del comprobante de pago
//  * @param {*} idConcepto - Id del concepto del movimiento
//  * @returns 
//  */
// async function ObtenerMovimiento(medio, fecha, idCuenta, valor, referencia, conversacion, reporta, numeroReporta, descripcion, verificado, ter, rrn, apro, cunico, recibo, comprobante, origen, idCliente, idCaja, tipo, archivo, idConcepto){
  
//     let filtros = '?'   

//     //Si el medio no es vacío o indefinido
//     if(medio != '' && medio != undefined){

//       //Agregar al filtro el medio de pago
//       filtros = filtros + 'filters[medio][$eq]=' + medio

//     }

//     //Si la fecha no está vacía o indefinida
//     if(fecha != '' && fecha != undefined){

//       //Agregar al filtro la fecha
//       filtros = filtros + '&filters[fecha][$eq]=' + fecha

//     }

//     //Si el id de la cuenta no es vacío o indefinido
//     if(idCuenta != '' && idCuenta != undefined){

//       //Agregar el filtro de medio de pago
//       filtros = filtros + '&filters[cuenta][id][$eq]=' + idCuenta

//     }
    
//     //Si el valor no es vacío o indefinido
//     if(valor != '' && valor != undefined){

//       //Agregar el filtro de medio de pago
//       filtros = filtros + '&filters[valor][$eq]=' + valor

//     }

//     //Si la referencia no es vacía o indefinida
//     if(referencia != '' && referencia != undefined){

//       //Agregar el filtro de medio de pago
//       filtros = filtros + '&filters[referencia][$eq]=' + referencia

//     }

//     //Si la conversación no es vacía o indefinida
//     if(conversacion != '' && conversacion != undefined){

//       //Agregar el filtro de medio de pago
//       filtros = filtros + '&filters[conversacion][$eq]=' + conversacion

//     }

//     //Si quien reporta no es vacío o indefinido
//     if(reporta != '' && reporta != undefined){

//       //Agregar el filtro de medio de pago
//       filtros = filtros + '&filters[reporta][$eq]=' + reporta

//     }

//     //Si el numeroReporta no es vacío o indefinido
//     if(numeroReporta != '' && numeroReporta != undefined){

//       //Agregar el filtro de medio de pago
//       filtros = filtros + '&filters[numeroReporta][$eq]=' + numeroReporta

//     }

//     //Si la descripción no es vacía o indefinida
//     if(descripcion != '' && descripcion != undefined){

//       //Agregar el filtro de medio de pago
//       filtros = filtros + '&filters[descripcion][$eq]=' + descripcion

//     }

//     // if(verificado == undefined){

//     //   verificado = null

//     // }

//     //Si el ter no es vacío o indefinido
//     if(ter != '' && ter != undefined){

//       //Agregar el filtro de medio de pago
//       filtros = filtros + '&filters[ter][$eq]=' + ter

//     }

//     //Si el rrn no es vacío o indefinido
//     if(rrn != '' && rrn != undefined){

//       //Agregar el filtro de medio de pago
//       filtros = filtros + '&filters[rrn][$eq]=' + rrn

//     }

//     //Si el apro no es vacío o indefinido
//     if(apro != '' && apro != undefined){

//       //Agregar el filtro de apro
//       filtros = filtros + '&filters[apro][$eq]=' + apro

//     }

//     //Si el cunico no es vacío o indefinido
//     if(cunico != '' && cunico != undefined){

//       //Agregar el filtro de cUnico
//       filtros = filtros + '&filters[cUnico][$eq]=' + cunico

//     }

//     //Si el recibo no es vacío o indefinido
//     if(recibo != '' && recibo != undefined){

//       //Agregar el filtro de recibo
//       filtros = filtros + '&filters[recibo][$eq]=' + recibo

//     }

//     //Si el comprobante no es vacío o indefinido
//     if(comprobante != '' && comprobante != undefined){

//       //Agregar el filtro de recibo
//       filtros = filtros + '&filters[comprobante][$eq]=' + comprobante

//     }

//     //Si el origen no es vacío o indefinido
//     if(origen != '' && origen != undefined){

//       //Agregar el filtro de recibo
//       filtros = filtros + '&filters[origen][$eq]=' + origen

//     }

//     //Si el idCliente no es vacío o indefinido
//     if(idCliente != '' && idCliente != undefined){

//       //Agregar el filtro de recibo
//       filtros = filtros + '&filters[cliente][id][$eq]=' + idCliente

//     }

//     //Si el idCaja no es vacío o indefinido
//     if(idCaja != '' && idCaja != undefined){

//       //Agregar el filtro de recibo
//       filtros = filtros + '&filters[caja][id][$eq]=' + idCaja

//     }

//     //Si el tipo no es vacío o indefinido
//     if(tipo != '' && tipo != undefined){

//       //Agregar el filtro de tipo
//       filtros = filtros + '&filters[tipo][$eq]=' + tipo

//     }

//     //Si el archivo no es vacío o indefinido
//     if(archivo != '' && archivo != undefined){

//       //Agregar el filtro de tipo
//       filtros = filtros + '&filters[archivo][$eq]=' + archivo

//     }

//     //Si el idConcepto no es vacío o indefinido
//     if(idConcepto != '' && idConcepto != undefined){

//       //Agregar el filtro de tipo
//       filtros = filtros + '&filters[concepto][id][$eq]=' + idConcepto

//     }

//     //Variable para obtener los resultados de la búsqueda
//     var datosCliente
    
//     //Configurar los datos a almacenar
//     try {
  
//       //Guardar en la base de datos
//       datosCliente = await basedatos.Buscar(configuracion.TABLA_MOVIMIENTOS + filtros, '&populate=*')
  
//       //console.log('Dele -> ' + datosCliente)
  
//     } catch (err) {
  
//       //Mostrar el mensaje de error
//       console.error(err);
  
//     }
  
//     //Retornar los datos
//     return datosCliente;
  
//   }


    
/**
 * Obtiene los datos del movimiento a partir de los valores proporcionados
 * @param {*} fecha - Fecha en la cual se realizó el pago
 * @param {*} idCuenta - Id de la cuenta en la cual se realizó el pago
 * @param {*} valor - Valor pagado
 * @returns 
 */
async function ObtenerMovimiento(fecha, idCuenta, valor){
  
    let filtros = '?'   

    //Si la fecha no está vacía o indefinida
    if(fecha != '' && fecha != undefined){
      
      const fechaInicial = new Date(fecha)
      const fechaFinal = new Date(fecha)

      fechaInicial.setMinutes(fechaInicial.getMinutes() - 2)
      fechaFinal.setMinutes(fechaFinal.getMinutes() + 2)

      // //Agregar al filtro la fecha
      // filtros = filtros + '&filters[fecha][$eq]=' + fecha

      filtros = filtros + '&filters[fecha][$between]=' + fechaInicial.toISOString() + '&filters[fecha][$between]=' + fechaFinal.toISOString()

      //'http://192.168.0.104:1338/api/movimientos?filters[fecha][$between]=2024-10-01T15:52:00.000Z&filters[fecha][$between]=2024-10-01T15:58:00.000Z&populate=*'

    }

    //Si el id de la cuenta no es vacío o indefinido
    if(idCuenta != '' && idCuenta != undefined){

      //Agregar el filtro de medio de pago
      filtros = filtros + '&filters[cuenta][id][$eq]=' + idCuenta

    }
    
    //Si el valor no es vacío o indefinido
    if(valor != '' && valor != undefined){

      //Agregar el filtro de medio de pago
      filtros = filtros + '&filters[valor][$eq]=' + valor

    }

    //Variable para obtener los resultados de la búsqueda
    var datosCliente
    
    //Configurar los datos a almacenar
    try {

      //Guardar en la base de datos
      datosCliente = await basedatos.Buscar(configuracion.TABLA_MOVIMIENTOS + filtros, '&populate=*')

      //console.log('Dele -> ' + datosCliente)

    } catch (err) {

      //Mostrar el mensaje de error
      console.error(err);

    }

    //Retornar los datos
    return datosCliente;

  }



/**
 * Guarda un cliente en la base de datos
 * @param {*} idMovimiento - Id del movimiento que se actualizará
 * @param {*} medio - Medio a través del cual se realizó el pago
 * @param {*} fecha - Fecha en la cual se realizó el pago
 * @param {*} idCuenta - Id de la cuenta en la cual se realizó el pago
 * @param {*} valor - Valor pagado
 * @param {*} referencia - Referencia del pago
 * @param {*} conversacion - Conversación de Nequi respecto al pago
 * @param {*} reporta - Rol de quién realiza el reporte del pago
 * @param {*} numeroReporta - Número de WhatsApp desde el cual se reportó el pago
 * @param {*} descripcion - Descripción al momento de realizar el pago
 * @param {*} verificado - Estado de verificación del pago
 * @param {*} ter - Valor ter del comprobante de corresponsal bancolombia
 * @param {*} rrn - Valor rrn del comprobante de corresponsal bancolombia
 * @param {*} apro - Valor apro del comprobante de corresponsal bancolombia
 * @param {*} cunico - Valor cunico del comprobante de corresponsal bancolombia
 * @param {*} recibo - Valor recibo del comprobante de corresponsal bancolombia
 * @param {*} comprobante - Comprobante de la transferencia bancolombia
 * @param {*} origen - Origen de la transferencia bancolombia
 * @param {*} idCliente - Id del cliente al cual pertenece el pago
 * @param {*} idCaja - Ide de la caja a la cual pertenece el movimiento
 * @param {*} tipo - Tipo de movimiento Inreso, Ereso, Transferencia
 * @param {*} archivo - Ruta del archivo del comprobante de pago
 * @param {*} idConcepto - Id del concepto del movimiento
 * @returns 
 */
async function VerificarMovimiento (idMovimiento, medio, fecha, idCuenta, valor, referencia, conversacion, reporta, numeroReporta, descripcion, verificado, ter, rrn, apro, cunico, recibo, comprobante, origen, idCliente, idCaja, tipo, archivo, idConcepto){
    
  
  //Si el medio es vacío o indefinido
  if(medio == '' || medio == undefined){

    //Configurar el medio como nulo
    medio = null

  }

  //Si la fecha está vacía o indefinida
  if(fecha == '' || fecha == undefined){

    //Configurar la fecha como nula
    fecha = null

  }

  //Si el id de la cuenta es vacío o indefinida
  if(idCuenta == '' || idCuenta == undefined){

    //Configurar el id de la cuenta como nulo
    idCuenta = null

  }
  
  //Si el valor es vacío o indefinido
  if(valor == '' || valor == undefined){

    //Configurar el valor como nulo
    valor = null

  }

  //Si la referencia es vacía o indefinida
  if(referencia == '' || referencia == undefined){

    //Configuar la referencia como nula
    referencia = null

  }

  //Si la conversación es vacía o indefinida
  if(conversacion == '' || conversacion == undefined){

    //Configurar la conversación como nula
    conversacion = null

  }

  //Si quien reporta es vacío o indefinido
  if(reporta == '' || reporta == undefined){

    //Configurar quien reporta como nulo
    reporta = null

  }

  //Si el numeroReporta es vacío o indefinido
  if(numeroReporta == '' || numeroReporta == undefined){

    //Configurar el número que reporta como nulo
    numeroReporta = null

  }

  //Si la descripción es vacía o indefinida
  if(descripcion == '' || descripcion == undefined){

    //Configurar la descripción como nula
    descripcion = null

  }

  // if(verificado == undefined){

  //   verificado = null

  // }

  //Si el ter es vacío o indefinido
  if(ter == '' || ter == undefined){

    //Configurar el ter como nulo
    ter = null

  }

  //Si el rrn es vacío o indefinido
  if(rrn == '' || rrn == undefined){

    //Configurar el rrn como nulo
    rrn = null

  }

  //Si el apro es vacío o indefinido
  if(apro == '' || apro == undefined){

    //Agregar el filtro de apro
    apro = null

  }

  //Si el cunico es vacío o indefinido
  if(cunico == '' || cunico == undefined){

    //Configurar el cunico
    cunico = null

  }

  //Si el recibo es vacío o indefinido
  if(recibo == '' || recibo == undefined){

    //Configurar el recibo como nulo
    recibo = null

  }

  //Si el comprobante es vacío o indefinido
  if(comprobante == '' || comprobante == undefined){

    //Configurar el comprobante como nulo
    comprobante = null

  }

  //Si el origen es vacío o indefinido
  if(origen == '' || origen == undefined){

    //Configurar el origen como nulo
    origen = null

  }

  //Si el idCliente es vacío o indefinido
  if(idCliente == '' || idCliente == undefined){

    //Configurar el idCliente como nulo
    idCliente = null

  }

  //Si el idCaja es vacío o indefinido
  if(idCaja == '' || idCaja == undefined){

    //Configurar el idCaja como nulo
    idCaja = null

  }

  //Si el tipo es vacío o indefinido
  if(tipo == '' || tipo == undefined){

    //Agregar el filtro de tipo
    tipo = null

  }

  //Si el archivo es vacío o indefinido
  if(archivo == '' || archivo == undefined){

    //Agregar el filtro de tipo
    archivo = null

  }

  //Si el idConcepto es vacío o indefinido
  if(idConcepto == '' || idConcepto == undefined){

    //Configurar el idConcepto como nulo
    idConcepto = null

  }


  //Configurar los datos a almacenar
  try {

      //Armar la estructura JSON con los datos a almacenar
      let datos = JSON.stringify({
          "data": {
              "medio": medio,
              "fecha": fecha,
              "cuenta": idCuenta,
              "valor": valor,
              "referencia": referencia,
              "conversacion": conversacion,
              "reporta": reporta,
              "numeroReporta": numeroReporta,
              "descripcion": descripcion,
              "verificado": verificado,
              "ter": ter,
              "rrn": rrn,
              "apro": apro,
              "cUnico": cunico,
              "recibo": recibo,
              "comprobante": comprobante,
              "origen": origen,
              "cliente": idCliente,
              "caja": idCaja,
              "tipo": tipo,
              "archivo": archivo,
              "concepto": idConcepto
          }
      });
      
      //Guardar en la base de datos
      salida = await basedatos.Actualizar(datos, configuracion.TABLA_MOVIMIENTOS, idMovimiento)

  } catch (err) {

      //Mostrar el mensaje de error
      console.error(err);

  }

  return salida;
  
}


module.exports = { Guardar, ObtenerMovimiento, VerificarMovimiento}