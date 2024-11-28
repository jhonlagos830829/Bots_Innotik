const configuracion = require('../Configuracion/configuracion');
const basedatos = require('./basedatos')
const { createWorker } = require('tesseract.js')
require('dotenv').config()

const cuentaBancaria = require('./cuenta.js')
const fechas = require('./fechas.js')

/**
 * Clasificar un comprobante basado en su texto de contenido
 * @param {*} archivo - Ruta del archivo que se va a escanear
 * @returns 
 */
async function clasificar(archivo){
    
    //Variable donde se almacenará el texto obtenido de la imagen
    let resultado = ''

    //Configurar los datos a almacenar
    try {
        
        //Declaración de variables para identificar datos de corresponsal
        const ExpRegCorresponsal = new RegExp("^[Redban]{7,}|[CORESPNAL]{10,}|[RBMDES]{6,}", "i")
        
        //Declaración de variables para identificar datos de Nequi
        const ExpRegNequi = new RegExp("[Enviío ]{4,}[Realizdo]{7,}|De d[óo]nde sali[óo] la plata|Movimiento[ hecon:]+[\na-z]+[Nequi]*|Detalle del[\n ]+movimiento|[movement\\W]{6,}[receipt\\W]{5,}[bpody\\W]{3,}[title]{3,}", "i")
        
        //Declaración de variables para identificar datos de Bancolombia
        //const ExpRegBancolombia = new RegExp("[Transfeci Exto]{20,}|[¡Transfeci lzd!]{20,}|[Comprbante .0-9]{20,}|[Productigen ]{15,}|[Productdesin ]{15,}[\n]+[a-z]+[\n]+[0-9]{10}[\n]+", "i")
        const ExpRegBancolombia = new RegExp("Transferencia[ Exitosa]{6,}|Transferencia[ Realizd]{8,}|[Comprbante .0-9]{20,}|Producto[origen ]{6,}|Producto[destino ]{6,}", "gmi")
        //const ExpRegBancolombia = new RegExp("(?=.*\\bTransferencia exitosa\\b|\\bTransferencia realizada\\b)(?=.*\\bComprobante N[oO0]\b)(?=.*\\bProducto origen\b)(?=.*\\bProducto destino\\b)", "i")
        
        //Declaración de variables para identificar datos de Bancolombia
        const ExpRegBancolombiaALaMano = new RegExp("Tu contacto debe aceptar la plata|La plata llegar[áa] a:|La plata se envi[óo] desde:|Bancolombia A la mano", "gmi")

        //Declaración de variables para identificar datos de Bancolombia
        const ExpRegDaviplata = new RegExp("[WViplat?]{8,}|[Transacción exitosa]{15,}|[Código QRparcnfmarsutc]{25,}|[Pasó lt]{6,}|[*+6136]{6,}|[Motiv]{5,}", "gmi")

        //Declaración de variables para identificar datos de Bancolombia
        const ExpRegTransfiya = new RegExp("Transf[i1l]ya", "i")

        //Mostrar en consola el proceso
        console.log('-----INICIANDO ESCANEO CON TESSERACT-----')

        //Crear la instancia que se encargará de extraer el texto de la imagen
        const worker = await createWorker("spa", 1, {
            //logger: m => console.log(m),
        })

        //Extraer el texto del comprobante de pago
        const { data: { text: texto } } = await worker.recognize(archivo)

        //Mostrar en la consola el texto obtenido 
        console.log(texto)

        //Mostrar en consola el proceso
        console.log('-----ESCANEO FINALIZADO CON TESSERACT-----')

        //Si el comprobante escaneado es de un corresponsal
        if(ExpRegCorresponsal.test(texto) == true){
            
            //Si el comprobante es de un corresponsal
            resultado = 'CORRESPONSAL'

        }
        else if(ExpRegNequi.test(texto) == true){
            
            //Si el comprobante es de un corresponsal
            resultado = 'NEQUI'

        }
        else if(ExpRegBancolombia.test(texto) == true){
            
            //Si el comprobante es de un corresponsal
            resultado = 'BANCOLOMBIA'

        }
        else if(ExpRegBancolombiaALaMano.test(texto) == true){
            
            //Si el comprobante es de un corresponsal
            resultado = 'BANCOLOMBIA A LA MANO'

        }
        else if(ExpRegDaviplata.test(texto) == true){

            //Si el comprobante es de un corresponsal
            resultado = 'DAVIPLATA'
            
        }
        else if(ExpRegTransfiya.test(texto) == true){

            //Si el comprobante es de un corresponsal
            resultado = 'TRANSFIYA'
            
        }

    } catch (err) {

        //Mostrar el mensaje de error
        console.error(err);

    }
    
    //Devolver resultado
    return resultado;
    
}

/**
 * Escanea una imagen con el motor OCR de Tesseract y devuelve el texto encontrado
 * @param {*} archivo - Ruta del archivo que se va a escanear
 * @returns 
 */
async function escanearConTesseract(archivo){
    
    //Variable donde se guardará el texto escaneado
    let hallazgos

    //Configurar los datos a almacenar
    try {
  
        //Mostrar en consola el proceso
        console.log('-----INICIANDO ESCANEO CON TESSERACT-----')

        //Crear la instancia que se encargará de extraer el texto de la imagen
        const worker = await createWorker("spa", 1, {
            //logger: m => console.log(m),
        })

        //Extraer el texto del comprobante de pago
        const { data: { text: texto } } = await worker.recognize(archivo)

        //Mostrar en la consola el texto obtenido 
        console.log(texto)

        //Obtener el texto del comprobante
        hallazgos = texto

        //Mostrar en consola el proceso
        console.log('-----ESCANEO FINALIZADO CON TESSERACT-----')

  
    } catch (err) {
  
      //Mostrar el mensaje de error
      console.error(err);
  
    }
  
    //Retornar los datos
    return hallazgos;
  
}

/**
 * Escanea una imagen con el motor OCR de Google y devuelve el texto encontrado
 * @param {*} archivo - Ruta del archivo que se va a escanear
 * @returns 
 */
async function escanearConGoogle(archivo){
    
    //Variable donde se guardará el texto escaneado
    let hallazgos

    //Configurar los datos a almacenar
    try {
  
        //Mostrar en consola el proceso
        console.log('-----INICIANDO ESCANEO CON GOOGLE-----')

        //Variables de Google vision para detectar el texto
        const vision = require('@google-cloud/vision')
                
        // Creates a client
        const cliente = new vision.ImageAnnotatorClient()

        // //Archivo que se escaneará
        // const comprobante = ctxFn.state.get('archivoComprobante')

        //Extraer el texto del archivo
        const [salida] = await cliente.textDetection(archivo)
        
        //Obtener el texto
        hallazgos = salida.textAnnotations

        //Mostrar en la consola el texto obtenido 
        console.log('texto\n\n' + hallazgos[0].description)
        
        //Mostrar en consola el proceso
        console.log('-----ESCANEO FINALIZADO CON GOOGLE-----')

  
    } catch (err) {
  
      //Mostrar el mensaje de error
      console.error(err);
  
    }
  
    //Retornar los datos
    return hallazgos[0].description;
  
}

/**
 * Extrae los datos de un comprobante de pago de Corresponsal
 * @param {*} texto - Ruta del archivo que se va a escanear
 * @returns 
 */
async function extraerDatosCorresponsal(texto){
    
    //Variable donde se almacerarán los datos encontrados
    const comprobante = JSON.parse('{}')
    //const comprobante = []
    
    console.log('Extrayendo datos de un comprobante de Corresponsal')

    //Configurar los datos a almacenar
    try {
  
        //Declaración de variables para identificar datos de corresponsal
        const ExpRegFechaCorresponsal = new RegExp("[ENFBMARYJULGOSPCTVDI]{3} [0-9]{2} [0-9]{4} [0-9]{2}:[0-9]{2}:[0-9]{2}", "i")
        const ExpRegValorCorresponsal = new RegExp("[Valor]{3,}[\n]*[$ 0-9.]{4,}|\\$[\n]*[ 0-9.]{4,}", "i")
        
        //Expresiones regulares para encontrar los datos de la consignación en el comprobante                    
        const ExpRegFecha = new RegExp('[ENFBMARYJULGOSPCTVDI]{3} [0-9]{2} [0-9]{4} [0-9]{2}:[0-9]{2}:[0-9]{2}', "i")
        const ExpRegCuenta = new RegExp('[Prducto:]{8,}[\\w]*[\\W]*[0-9]{10}', "i")
        const ExpRegValor = new RegExp('[0-9.]{4,}[\n]*', "i")
        const ExpRegCodigoUnico = new RegExp('[ .UNICO:]{4,}[\\w]*[\\W]*[0-9]{9,}', "i")
        const ExpRegRecibo = new RegExp('[RECIBO: ]{6,}[0-9]{6}', "i")
        const ExpRegTer = new RegExp('[TER: ]{4,}[0-9A-Z]{8}', "i")
        const ExpRegRrn = new RegExp('[RN: ]{4,}[0-9]{6}', "i")
        const ExpRegApro = new RegExp('[APRO: ]{4,}[0-9]{6}', "i")
        
        //Configurar el medio por el cual realizaron el pago
        comprobante.medio = 'Corresponsal'

        //Si tiene al menos una coincidencia
        if (ExpRegFecha.test(texto) == true){
            
            //Extraer la fecha de la línea de fecha
            let lineaFecha = texto.match(ExpRegFecha)[0].replaceAll('\n', ' ')
            
            //Extraer el mes de la fecha
            let mes = lineaFecha.substring(0, lineaFecha.indexOf(' ') + 1).replace('ENE','JAN').replace('ABR','APR').replace('AGO','AUG').replace('DEC','DIC').replace('¿UN', 'JUN')

            //Remover el mes del principio de la línea para formatearla correctamente
            lineaFecha = lineaFecha.replace(mes, '')

            //Agregar el mes a la fecha
            lineaFecha = lineaFecha.slice(0, lineaFecha.indexOf(' ') + 1) + mes.trim() + lineaFecha.slice(lineaFecha.indexOf(' '))

            //Crear la fecha que se ingresará en el movimiento a partir de la fecha encontrada
            fecha = new Date( lineaFecha)
            
            //Configurar la fecha del pago
            comprobante.fecha = fecha

        }

        //Si tiene al menos una coincidencia
        if (ExpRegCuenta.test(texto) == true){
            
            //Obtener la línea de la cuenta
            let lineaCuenta = texto.match(ExpRegCuenta)[0]

            //Obtener la cuenta
            cuenta = lineaCuenta.substring(lineaCuenta.indexOf(' ') + 1).replaceAll(' ', '').trim()

            //Configurar la fecha del pago
            comprobante.cuenta = cuenta

        }
        
        //Si tiene al menos una coincidencia
        if (ExpRegValorCorresponsal.test(texto) == true){
            
            //Obtener la línea del valor
            let lineaValor = texto.match(ExpRegValorCorresponsal)[0]

            //Obtener el valor de la línea
            valor = lineaValor.match(ExpRegValor)[0].replaceAll('.', '').replaceAll('\n', '')

            //Configurar la fecha del pago
            comprobante.valor = valor

        }

        //Si tiene al menos una coincidencia
        if (ExpRegCodigoUnico.test(texto) == true){
            
            //Obtener la línea del valor
            let lineaCunico = texto.match(ExpRegCodigoUnico)[0]

            //Obtener el cunico de la línea
            cunico = lineaCunico.substring(lineaCunico.lastIndexOf(' ') + 1)

            //Configurar la fecha del pago
            comprobante.cunico = cunico

        }

        //Si tiene al menos una coincidencia
        if (ExpRegRecibo.test(texto) == true){
            
            //Obtener la línea del valor
            let lineaRecibo = texto.match(ExpRegRecibo)[0]

            //Obtener el cunico de la línea
            recibo = lineaRecibo.substring(lineaRecibo.lastIndexOf(' ') + 1)

            //Configurar la fecha del pago
            comprobante.recibo = recibo

        }

        
        //Si tiene al menos una coincidencia
        if (ExpRegTer.test(texto) == true){
            
            //Obtener la línea del valor
            let lineaTer = texto.match(ExpRegTer)[0]

            //Obtener el cunico de la línea
            ter = lineaTer.substring(lineaTer.lastIndexOf(' ') + 1)

            //Configurar la fecha del pago
            comprobante.ter = ter

        }

        //Si tiene al menos una coincidencia
        if (ExpRegRrn.test(texto) == true){
            
            //Obtener la línea del valor
            let lineaRrn = texto.match(ExpRegRrn)[0]

            //Obtener el cunico de la línea
            rrn = lineaRrn.substring(lineaRrn.lastIndexOf(' ') + 1)

            //Configurar la fecha del pago
            comprobante.rrn = rrn

        }

        //Si tiene al menos una coincidencia
        if (ExpRegApro.test(texto) == true){
            
            //Obtener la línea del valor
            let lineaApro = texto.match(ExpRegApro)[0]

            //Obtener el cunico de la línea
            apro = lineaApro.substring(lineaApro.lastIndexOf(' ') + 1)

            //Configurar la fecha del pago
            comprobante.apro = apro

        }

  
    } catch (err) {
  
      //Mostrar el mensaje de error
      console.error(err);
  
    }
  
    //Retornar los datos
    return comprobante;
  
}

/**
 * Extrae los datos de un comprobante de pago de Nequi
 * @param {*} texto - Ruta del archivo que se va a escanear
 * @returns 
 */
async function extraerDatosNequi(texto){
    
    //Variable donde se almacerarán los datos encontrados
    const comprobante = JSON.parse('{}')
    //const comprobante = []
    
    console.log('Extrayendo datos de un comprobante de Nequi')

    //Configurar los datos a almacenar
    try {
  
        //Declaración de variables para identificar datos de Nequi
        const ExpRegNequi = new RegExp("De d[óo]nde sali[óo] la plata|Movimiento[ hecon:]+[\na-z]+[Nequi]*|Detalle del[\n ]+movimiento|[movement\\W]{6,}[receipt\\W]{5,}[bpody\\W]{3,}[title]{3,}", "i")
        const ExpRegReferenciaNequi = new RegExp("[Rfencia ]{6,}[\n| ]*[MS]*[0-9]{4,}|[movement\\W]{6,}[receipt\\W]{5,}[bpody\\W]{3,}[reference\\W]{6,}[MS]*[0-9]{4,}", "i")
        const ExpRegCuentaNequi = new RegExp("[Núumeroeqi ]{4,}[\n]*3[0-9 ]{9,}", "i")
        const ExpRegFechaNequi = new RegExp("[Fecha yora]{3,}[\n]*[ -a-z]*[0-9]+ de [a-z]+ de [0-9]{4}[, als\n]*[0-9]{1,}:[0-9]{2}[amp .\n]+", "i")
        const ExpRegValorNequi = new RegExp("[Cuaánto a-z\\?]{6,}[\n]*\\$[0-9 .]+", "i")
        const ExpRegConversacionNequi = new RegExp("[Conversaió]{10,}[\na-záéíóúÁÉÏÓÚ,. 0-9]+\\¿", "i")

        //Expresiones regulares clasificadoras de documento
        const ExpRegEnvioRealizadoNequi = new RegExp("Env[íi]+o[ abncorelizd]{4,}[\n]+Para[\n]+[a-z ]{2,}", "i")
        //const ExpRegPagoNequi = new RegExp("[Pago cnQARelizd]{4,}[\n]+[Pago en]{4,}[\n]+[a-z 0-9]{4,}|[Pago en]{4,}[\n\\wáéíóúÁÉÍÓÚ -]{4,}", "i")
        const ExpRegPagoNequi = new RegExp("Pago [conQARelizd ]{4,}[\n]+|Pago en[\n\\wáéíóúÁÉÍÓÚñÑ 0-9]{4,}|Pago en{4,}[\n\\wáéíóúÁÉÍÓÚñÑ -]{4,}|Pago de[a-z 0-9]{4,}", "i")
        const ExpRegImpuestoNequi = new RegExp("[Movient ]{4,}[Impuesto]{4,}[ delgobirn]{6,}", "i")
        const ExpRegRetiroNequi = new RegExp("Retiro[en ]{2,}[\n]+[cajero]{4,}|Sacaste[en ]{2,}[\n]+[corespnsal ]{4,}[a-z 0-9]{4,}", "i")
        //const ExpRegTipoEnvioNequi = new RegExp("[Tipo denvíi]{8,}[\n]+[a-z 0-9]{4,}", "i")
        const ExpRegTipoEnvioNequi = new RegExp("Tipo de env[íio]{2,}[\n]+[a-z 0-9]{4,}", "i")
        const ExpRegTransfiyaDeNequi = new RegExp("[Transfiy]{6,}[ de]{2,}[a-z -9]{4,}", "i")
        const ExpRegEnvioRecibidoNequi = new RegExp("Env[íi]+o[ Recibdo]{4,}[\n]+[De]{2,}[\n]+[a-z 0-9]{4,}", "i")
        const ExpRegEnvioRecibidoDeNequi = new RegExp("[De]{2,}[a-z 0-9]{4,}", "i")
        const ExpRegMovimientoRealizadoCuanto = new RegExp("[Moviment]{6,}[ realizdo]{6,}[\n]+[¿Cuáanto?]{4,}", "i")
        const ExpRegRecarga = new RegExp("[Recag]{5,}[ realizd]{4,}[\n]+[Recag]{5,}[a-z 0-9]{4,}[\n]+[a-z 0-9]{2,}", "i")
        const ExpRegPagoIntereses = new RegExp("[Moviment]{4,}[ Pago]{3,}[ de]{2,}[\n]+[¿Doónde?]{4,}[\n]+[Inters]{4,}", "i")
        const ExpRegIngresoOtrosBancos = new RegExp("[Moviment]{6,}[\n]+[¿Dóonde?]{4,}[\n]+[a-z 0-9]{4,}", "i")
        const ExpRegPagoPaqueteCelular = new RegExp("[Pago]{2,}[ de]{2,}[ Paquetdcl]{4,}", "i")

        //Variables donde se guardarán los datos extraidos de las líneas de texto
        const ExpRegReferencia = new RegExp("[MS15]+[0-9]{4,}", "i")
        const ExpRegCuenta = new RegExp("3[0-9 ]{9,}", "i")
        const ExpRegFecha = new RegExp("[0-9]+ de [a-z]+ de [0-9]{4}[, als\n]*[0-9]{1,}:[0-9]{2}[amp .]+", "i")
        const ExpRegValor = new RegExp("\\$[0-9 .]+", "i")
        const ExpRegConversacion = new RegExp("\\$[0-9 .]+", "i")
        const ExpRegPagoEn = new RegExp("Pago en[a-z 0-9]{4,}", "i")
        const ExpRegImpuestoGobierno = new RegExp("Impuesto[ delgobirn]{4,}", "i")
        
        //Configurar el medio por el cual realizaron el pago
        comprobante.medio = 'Nequi'
        
        //Si encontró al referencia de pago
        if (ExpRegReferenciaNequi.test(texto) == true){
            
            //Extraer la referencia de la línea de referencia
            let lineaReferencia = texto.match(ExpRegReferenciaNequi)[0].replaceAll('\n', ' ')

            //Si la referencia POR ERROR EL TESERACT DETECTA LA PRIMERA M COMO 1
            if(lineaReferencia.match(ExpRegReferencia)[0].startsWith('11')){

                //Configurar la referencia tal cual fue extraída
                comprobante.referencia = 'M' + lineaReferencia.match(ExpRegReferencia)[0].substring(2)

            }
            if(lineaReferencia.match(ExpRegReferencia)[0].startsWith('1')){

                //Configurar la referencia tal cual fue extraída
                comprobante.referencia = 'M' + lineaReferencia.match(ExpRegReferencia)[0].substring(1)

            }
            else if(lineaReferencia.match(ExpRegReferencia)[0].startsWith('5')){

                //Configurar la referencia tal cual fue extraída
                comprobante.referencia = 'S' + lineaReferencia.match(ExpRegReferencia)[0].substring(1)

            }
            else{

                //Configurar la referencia tal cual fue extraída
                comprobante.referencia = lineaReferencia.match(ExpRegReferencia)[0]

            }

        }
        
        //Si encontró la conversación
        if (ExpRegConversacionNequi.test(texto) == true){
            
            //Extraer la conversación de la línea de conversación
            let lineaConversacion = texto.match(ExpRegConversacionNequi)[0].replaceAll('\n', ' ').replaceAll('¿', '')
            comprobante.conversacion = lineaConversacion.substring(lineaConversacion.indexOf(' ')).toLowerCase().replaceAll('  ', ' ').trim()

        }
        
        //Si encontró la fecha
        if (ExpRegFechaNequi.test(texto) == true){
            
            //Extraer la fecha de la línea de fecha
            let lineaFecha = texto.match(ExpRegFechaNequi)[0].replaceAll('\n', ' ')
            let fechaCadena = lineaFecha.match(ExpRegFecha)[0].replaceAll('a. m.', 'a.m.').replaceAll('p. m.', 'p.m.').replaceAll(' Mm.', 'm.').replaceAll('a.m.', ' a.m.').replaceAll('p.m.', ' p.m.').replaceAll('  ', ' ').trim() //Linea modificada
            let horaAmPm = ''

            //Otener la hora de la fecha
            horaAmPm = fechaCadena.substring(fechaCadena.lastIndexOf(' '))
            
            //Si la hora incluye a.
            if(horaAmPm.includes('a.')){

                //Crear la fecha que se ingresará en el movimiento a partir de la fecha encontrada
                comprobante.fecha = new Date(fechas.extraerFecha(fechaCadena.replaceAll(horaAmPm, ' a.m.')))

            }
            else if(horaAmPm.includes('p.')){

                //Crear la fecha que se ingresará en el movimiento a partir de la fecha encontrada
                comprobante.fecha = new Date(fechas.extraerFecha(fechaCadena.replaceAll(horaAmPm, ' p.m.')))

            }

        }
        
        //Si encontró el valor del movimiento
        if (ExpRegValorNequi.test(texto) == true){
            
            //Extraer el valor de la linea de valor encontrada
            let lineaValor = texto.match(ExpRegValorNequi)[0].replaceAll('\n', ' ')
            comprobante.valor = lineaValor.match(ExpRegValor)[0].replaceAll('$', '').replaceAll('.', '').trim()

        }
        
        //Si encontró el número de la cuenta
        if (ExpRegCuentaNequi.test(texto) == true){
            
            //Extraer la cuenta de la linea de cuenta encontrada
            let lineaCuenta = texto.match(ExpRegCuentaNequi)[0].replaceAll('\n', ' ')
            comprobante.cuenta = lineaCuenta.match(ExpRegCuenta)[0].replaceAll(' ', '')
            
        }

        //Si encontró que es un envío
        if (ExpRegEnvioRealizadoNequi.test(texto) == true){
            
            //Extraer la cuenta de la linea del envío y reemplazar los saltos de línea por espacios
            let lineaEnvio = texto.match(ExpRegEnvioRealizadoNequi)[0].replaceAll('\n', ' ')

            //Configurar la descripción el comprobante
            comprobante.descripcion = lineaEnvio

            //Expresiones regular para obtener los datos del envío
            const ExpRegTipoDocumento = new RegExp("[Ti1po0 ]{3,}[ deocumnt]{4,}[\n]+[a-z]{2,}", "i")
            const ExpRegTipoNumeroDocumento = new RegExp("[Núumero ]{3,}[ deocumnt]{4,}[\n]+[0-9]{4,}", "i")
            const ExpRegBanco = new RegExp("^[Banco]{3,}[\n]+[a-z]{3,}", "i")
            const ExpRegNumeroCuenta = new RegExp("[Núumero]{3,}[ decunta]{4,}[\n]+[0-9]{4,}", "i")

            //Si el texto contiene el tipo de documento
            if (ExpRegTipoDocumento.test(texto) == true){

                //Extraer la cuenta de la linea del envío y reemplazar los saltos de línea por espacios
                let lineaTipoDocumento = texto.match(ExpRegTipoDocumento)[0].replaceAll('\n', ' ')
                
                //Configurar la descripción el comprobante
                comprobante.descripcion = comprobante.descripcion + '. ' + lineaTipoDocumento

            }

            //Si el texto contiene el número del documento
            if (ExpRegTipoNumeroDocumento.test(texto) == true){
                
                //Extraer la cuenta de la linea del envío y reemplazar los saltos de línea por espacios
                let lineaNumeroDocumento = texto.match(ExpRegTipoNumeroDocumento)[0].replaceAll('\n', ' ')

                //Configurar la descripción el comprobante
                comprobante.descripcion = comprobante.descripcion + '. ' + lineaNumeroDocumento

            }

            if (ExpRegBanco.test(texto) == true){
                
                //Extraer la cuenta de la linea del envío y reemplazar los saltos de línea por espacios
                let lineaBanco = texto.match(ExpRegBanco)[0].replaceAll('\n', ' ')

                //Configurar la descripción el comprobante
                comprobante.descripcion = comprobante.descripcion + '. ' + lineaBanco

            }

            if (ExpRegNumeroCuenta.test(texto) == true){
                
                //Extraer la cuenta de la linea del envío y reemplazar los saltos de línea por espacios
                let lineaNumeroCuenta = texto.match(ExpRegNumeroCuenta)[0].replaceAll('\n', ' ')

                //Configurar la descripción el comprobante
                comprobante.descripcion = comprobante.descripcion + '. ' + lineaNumeroCuenta

            }
            else{

                //Configurar la descripción el comprobante
                comprobante.descripcion = comprobante.descripcion + '. Número Nequi: ' + comprobante.cuenta

            }

            //Clasificar el documento
            comprobante.tipodocumento = 'EGRESO_HACIA_NEQUI_O_BANCO'

        }

        //Si encontró que es un pago
        if (ExpRegPagoNequi.test(texto) == true){
            
            //Expresión regular para extraer los datos del pago
            const ExpRegDatosPagoNequi = new RegExp("[Pago en]{4,}[\n\\wáéíóúÁÉÍÓÚ -]{4,}", "i")

            //Extraer la cuenta de la linea de cuenta encontrada
            let lineaPago = texto.match(ExpRegDatosPagoNequi)[0].replaceAll('\n', ' ').replaceAll('  ', ' ')
            
            //Configurar la descripción el comprobante
            comprobante.descripcion = lineaPago.replace(' ¿', '')
            
            //Clasificar el documento
            comprobante.tipodocumento = 'EGRESO_POR_PAGO'

        }

        //Si encontró que es un pago
        if (ExpRegImpuestoNequi.test(texto) == true){
            
            //Extraer la cuenta de la linea de cuenta encontrada
            let lineaImpuesto = texto.match(ExpRegImpuestoNequi)[0].replaceAll('\n', ' ')
            
            //Configurar la descripción el comprobante
            comprobante.descripcion = lineaImpuesto.match(ExpRegImpuestoGobierno)[0]
            
            //Clasificar el documento
            comprobante.tipodocumento = 'EGRESO_POR_IMPUESTO'

        }

        //Si encontró que es un pago
        if (ExpRegRetiroNequi.test(texto) == true){
            
            //Extraer la cuenta de la linea de cuenta encontrada
            let lineaRetiro = texto.match(ExpRegRetiroNequi)[0].replaceAll('\n', ' ')
            
            //Configurar la descripción el comprobante
            comprobante.descripcion = lineaRetiro
            
            //Clasificar el documento
            comprobante.tipodocumento = 'RETIRO_EN_CAJERO_O_CORRESPONSAL'

        }

        //Si encontró que es un pago
        if (ExpRegTipoEnvioNequi.test(texto) == true){
            
            //Extraer la cuenta de la linea de cuenta encontrada
            let lineaTipoEnvio = texto.match(ExpRegTipoEnvioNequi)[0].replaceAll('\n', ' ')
            
            //Configurar la descripción el comprobante
            comprobante.medio = lineaTipoEnvio.substring(lineaTipoEnvio.lastIndexOf(' ')).trim()
            
        }

        //Si encontró que es un pago
        if (ExpRegTransfiyaDeNequi.test(texto) == true){
            
            //Extraer la cuenta de la linea de cuenta encontrada
            let lineaTransfiyaDeNequi = texto.match(ExpRegTransfiyaDeNequi)[0].replaceAll('\n', ' ')
            
            //Configurar la descripción el comprobante
            comprobante.origen = lineaTransfiyaDeNequi.substring(lineaTransfiyaDeNequi.indexOf(' ')).trim()
            
            //Clasificar el documento
            comprobante.tipodocumento = 'INGRESO_POR_TRANSFIYA'

        }

        //Si encontró que es un pago
        if (ExpRegEnvioRecibidoNequi.test(texto) == true){
            
            //Extraer la cuenta de la linea de cuenta encontrada
            let lineaEnvioRecibidoNequi = texto.match(ExpRegEnvioRecibidoNequi)[0].replaceAll('\n', ' ')
            
            //Configurar la descripción el comprobante
            comprobante.origen = lineaEnvioRecibidoNequi.match(ExpRegEnvioRecibidoDeNequi)[0].trim()
            
            //Clasificar el documento
            comprobante.tipodocumento = 'INGRESO_POR_NEQUI'

        }

        //Si encontró que es un pago
        if (ExpRegMovimientoRealizadoCuanto.test(texto) == true){
            
            //Configurar el medio por el cual realizaron el pago
            comprobante.medio = 'Corresponsal'
            
            //Clasificar el documento
            comprobante.tipodocumento = 'INGRESO_POR_CORRESPONSAL'

        }

        //Si encontró que es un pago
        if (ExpRegRecarga.test(texto) == true){
            
            //Extraer la cuenta de la linea de cuenta encontrada
            let lineaRecarga = texto.match(ExpRegRecarga)[0].replaceAll('\n', ' ').replaceAll('  ', ' ')
            
            //Expresion regular para extraer el origen de la recarga
            const ExpRegRecargaPlataforma = new RegExp("[Recag]{5,}[ endsd]{2,}[ a-z0-9]{2,}", "i")

            //Obtener la plataforma desde la cual se realizó la recarga
            let plataformaRecarga = lineaRecarga.match(ExpRegRecargaPlataforma)[0]
            
            //Configurar la descripción el comprobante
            comprobante.origen = plataformaRecarga

            //Si la plataforma es Bancolombia
            if(plataformaRecarga.toLowerCase().includes('bancolombia')){

                //Clasificar el documento
                comprobante.tipodocumento = 'RECARGA_DESDE_BANCOLOMBIA'

            }
            else if(plataformaRecarga.toLowerCase().includes('ptm')){

                //Clasificar el documento
                comprobante.tipodocumento = 'RECARGA_DESDE_PTM'

            }
            else if(plataformaRecarga.toLowerCase().includes('pse')){

                //Clasificar el documento
                comprobante.tipodocumento = 'RECARGA_DESDE_PSE'

            }
            else if(plataformaRecarga.toLowerCase().includes('punto red')){

                //Clasificar el documento
                comprobante.tipodocumento = 'RECARGA_DESDE_PUNTO_RED'

            }
            
        }
        
        //Si encontró que es un pago
        if (ExpRegPagoIntereses.test(texto) == true){
            
            //Extraer la cuenta de la linea de cuenta encontrada
            let lineaPagoIntereses = texto.match(ExpRegPagoIntereses)[0].replaceAll('\n', ' ').replaceAll('  ', ' ')
            
            //Configurar la descripción el comprobante
            comprobante.origen = lineaPagoIntereses.replace(/(Movimiento )|(¿Dónde\? )/gmi, '').trim()
            
            //Clasificar el documento
            comprobante.tipodocumento = 'INGRESO_PAGO_INTERESES'

        }

        //Si encontró que es un pago
        if (ExpRegIngresoOtrosBancos.test(texto) == true){
            
            //Extraer la cuenta de la linea de cuenta encontrada
            let lineaIngresoOtrosBancos = texto.match(ExpRegIngresoOtrosBancos)[0].replaceAll('\n', ' ').replaceAll('  ', ' ')
            
            //Configurar la descripción el comprobante
            comprobante.origen = lineaIngresoOtrosBancos.replace(/(Movimiento )|(¿Dónde\? )/gmi, '').replaceAll('  ', ' ').trim()
            
            //Clasificar el documento
            comprobante.tipodocumento = 'INGRESO_DESDE_OTROS_BANCOS'

        }

        //Si encontró que es un pago
        if (ExpRegPagoPaqueteCelular.test(texto) == true){
            
            //Expresión regular para obtener la linea de compra del paquete de celular
            const ExpPagoPaqueteCelular = new RegExp("[Compra]{4,}[ de]{2,}[ paquete]{6,}[\n]+[a-z 0-9]{4,}[\n]+[Cel]{2,}[\n]+[0-9]{8,}", "i")

            //Extraer la cuenta de la linea de cuenta encontrada
            let lineaPagoPaqueteCelular = texto.match(ExpPagoPaqueteCelular)[0].replaceAll('\n', ' ').replaceAll('  ', ' ')
            
            //Configurar la descripción el comprobante
            comprobante.descripcion = lineaPagoPaqueteCelular
            
            //Clasificar el documento
            comprobante.tipodocumento = 'EGRESO_COMPRA_PAQUETE_CELULAR'

        }

  
    } catch (err) {
  
      //Mostrar el mensaje de error
      console.error(err);
  
    }
  
    //Retornar los datos
    return comprobante;
  
}

/**
 * Extrae los datos de un comprobante de pago de Bancolombia
 * @param {*} texto - Ruta del archivo que se va a escanear
 * @returns 
 */
async function extraerDatosBancolombia(texto){
    
    //Variable donde se almacerarán los datos encontrados
    const comprobante = JSON.parse('{}')
    
    console.log('Extrayendo datos de un comprobante de Bancolombia')

    //Configurar los datos a almacenar
    try {

        //Declaración de variables para identificar datos de Bancolombia
        const ExpRegBancolombia = new RegExp("[Transfeci Exto]{20,}|[¡Transfeci lzd!]{20,}|[Comprbante .0-9]{20,}|[Productigen ]{15,}|[Productdesin ]{15,}[\n]+[a-z]+[\n]+[0-9]{10}[\n]+", "i")
        const ExpRegComprobanteBancolombia = new RegExp("[Comprbante N.0-9]{20,}\n", "i")
        const ExpRegOrigenBancolombia = new RegExp("[Productigenavy ]{15,}[\n]*[a-z ]{4,}[\n]+[AhorsCient]{4,}[\n]*[*0-9\-]{5,}", "i")
        const ExpRegFechaBancolombia = new RegExp("\n[0-9]{1,2}[a-z ]{5}[0-9]{4}[ -]*[0-9]{2}:[0-9]{2}[ amp.]{4,}\n", "i")
        const ExpRegValorBancolombia = new RegExp("[Valor eniad]{10,}[\n]*[$ 0-9.]+", "i")
        const ExpRegCuentaBancolombia = new RegExp("[Productdesin ]{15,}[\n]+[a-záéíóúÁÉÍÓÚ ]+[\n]+[a-z \n]*[0-9\-]{10,}[\n]*", "i")
        const ExpRegDescripcionBancolombia = new RegExp("[Descripón]{8,}[\n]*[a-z0-9 \w\n]*", "i")

        //Variables donde se guardarán los datos extraidos de las líneas de texto
        const ExpRegComprobante = new RegExp("[0-9]+", "i")
        const ExpRegOrigen = new RegExp("[Cuenta\n]*[AhorsCient ]{6,}[\n]*[*0-9\-]{5,}", "i")
        const ExpRegFecha = new RegExp("[0-9]{1,2}[a-z ]{5}[0-9]{4}[ -]{2,}[0-9]{2}:[0-9]{2}[ amp.]{4,}", "i")
        const ExpRegValor = new RegExp("[0-9.]+", "i")
        const ExpRegCuenta = new RegExp("[0-9\-]{10,}", "i")
        const ExpRegDescripcion = new RegExp("[a-z0-9áéíóúÁÉÍÓÚñÑ \w\n]*", "i")
        
        //Configurar el medio por el cual realizaron el pago
        comprobante.medio = 'Bancolombia'
        
        //Si encontró el comprobante de pago
        if (ExpRegComprobanteBancolombia.test(texto) == true){
            
            //Extraer la referencia de la línea de referencia
            let lineaComprobante = texto.match(ExpRegComprobanteBancolombia)[0].replaceAll('\n', ' ')
            comprobante.comprobante = lineaComprobante.match(ExpRegComprobante)[0]

        }
        
        //Si encontró la conversación
        if (ExpRegOrigenBancolombia.test(texto) == true){
            console.log('Entro al procesamiento del origen')
            //Extraer el origen de la línea de origen
            let lineaOrigen = texto.match(ExpRegOrigenBancolombia)[0].replaceAll('\n', ' ').replaceAll('¿', '').trim()
            //console.log('lineaOrigen:|' + lineaOrigen + '|')
            comprobante.origen = lineaOrigen.match(ExpRegOrigen)[0]
            
        }
        
        //Si encontró la fecha
        if (ExpRegFechaBancolombia.test(texto) == true){

            //Extraer la fecha de la línea de fecha
            let lineaFecha = texto.match(ExpRegFechaBancolombia)[0].replaceAll('\n', ' ').replaceAll('-', ' - ').replaceAll('  ', ' ')
            let fechaCadena = lineaFecha.match(ExpRegFecha)[0].trim().replace(' - ', ' ')
            let horaAmPm = ''
            
            //Otener la hora de la fecha
            horaAmPm = fechaCadena.substring(fechaCadena.lastIndexOf(' '))
            
            //Si la hora incluye a.
            if(horaAmPm.includes('a.')){

                //Crear la fecha que se ingresará en el movimiento a partir de la fecha encontrada
                comprobante.fecha = new Date( fechas.extraerFecha(fechaCadena.replaceAll(horaAmPm, ' a.m.')))

            }
            else if(horaAmPm.includes('p.')){

                //Crear la fecha que se ingresará en el movimiento a partir de la fecha encontrada
                comprobante.fecha = new Date( fechas.extraerFecha(fechaCadena.replaceAll(horaAmPm, ' p.m.')))

            }
            
        }
        
        //Si encontró el valor del movimiento
        if (ExpRegValorBancolombia.test(texto) == true){
            
            //Extraer el valor de la linea de valor encontrada
            let lineaValor = texto.match(ExpRegValorBancolombia)[0].replaceAll('\n', ' ')
            comprobante.valor = lineaValor.match(ExpRegValor)[0].replaceAll('$', '').replaceAll('.', '').trim()
            
        }
        
        //Si encontró el valor del movimiento
        if (ExpRegDescripcionBancolombia.test(texto) == true){
            
            //Extraer el valor de la linea de valor encontrada
            let lineaDescripcion = texto.match(ExpRegDescripcionBancolombia)[0].replaceAll('\n', ' ')
            //console.log('lineaDescripcion:|' + lineaDescripcion + '|')
            comprobante.conversacion = lineaDescripcion.match(ExpRegDescripcion)[0].replace(/\b(Descripción|Referencia)\b/g, '').trim()
            //console.log('Terminó en conversacion')
        }
        
        //Si encontró el número de la cuenta
        if (ExpRegCuentaBancolombia.test(texto) == true){
            
            //Extraer la cuenta de la linea de cuenta encontrada
            let lineaCuenta = texto.match(ExpRegCuentaBancolombia)[0].replaceAll('\n', ' ')
            comprobante.cuenta = lineaCuenta.match(ExpRegCuenta)[0].replaceAll(' ', '').replaceAll('-', '')

        }

  
    } catch (err) {
  
      //Mostrar el mensaje de error
      console.error(err);
  
    }
  
    //Retornar los datos
    return comprobante;
  
}

/**
 * Extrae los datos de un comprobante de pago de Bancolombia
 * @param {*} texto - Ruta del archivo que se va a escanear
 * @returns 
 */
async function extraerDatosBancolombiaALaMano(texto){
    
    //Variable donde se almacerarán los datos encontrados
    const comprobante = JSON.parse('{}')
    
    console.log('Extrayendo datos de un comprobante de Bancolombia a la mano')

    //Configurar los datos a almacenar
    try {

        //Declaración de variables para identificar datos de Bancolombia
        const ExpRegComprobanteBancolombiaALaMano = new RegExp("[Comprbante N.0-9]{20,}\n", "i")
        const ExpRegOrigenBancolombiaALaMano = new RegExp("La plata se envi[óoÓO0] desde:[\n<]+Bancolombia A la mano[\n]*[0-9-]{12,}", "i")
        const ExpRegFechaBancolombiaALaMano = new RegExp("[0-9 ]{2,}[ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic]{3}[0-9 ]{5}[-]*[0-9]{2}:[0-9]{2}", "i")
        const ExpRegValorBancolombiaALaMano = new RegExp("Plata a enviar[\n]*[\\$0-9,]{2,}", "i")
        const ExpRegCuentaBancolombiaALaMano = new RegExp("La plata llegará a:[\n]*Número de celular[\n]*[0-9 ]{8,}", "i")

        //Variables donde se guardarán los datos extraidos de las líneas de texto
        const ExpRegComprobante = new RegExp("[0-9]+", "i")
        const ExpRegOrigen = new RegExp("Bancolombia A la mano[0-9 -]{12,}", "i")
        const ExpRegFecha = new RegExp("[0-9]{1,2}[a-z ]{5}[0-9]{4}[ -]{2,}[0-9]{2}:[0-9]{2}[ amp.]{4,}", "i")
        const ExpRegValor = new RegExp("[0-9,]+", "i")
        const ExpRegCuenta = new RegExp("[0-9 ]{10,}", "i")
        
        //Configurar el medio por el cual realizaron el pago
        comprobante.medio = 'Bancolombia a la mano'
        
        //Si encontró el comprobante de pago
        if (ExpRegComprobanteBancolombiaALaMano.test(texto) == true){
            
            //Extraer la referencia de la línea de referencia
            let lineaComprobante = texto.match(ExpRegComprobanteBancolombiaALaMano)[0].replaceAll('\n', ' ')
            comprobante.comprobante = lineaComprobante.match(ExpRegComprobante)[0]

        }
        
        //Si encontró la conversación
        if (ExpRegOrigenBancolombiaALaMano.test(texto) == true){
            
            //Extraer el origen de la línea de origen
            let lineaOrigen = texto.match(ExpRegOrigenBancolombiaALaMano)[0].replaceAll('\n', ' ').replaceAll('¿', '').trim()
            
            //Obtener la cuenta origen
            comprobante.origen = lineaOrigen.match(ExpRegOrigen)[0]
            
        }
        
        //Si encontró la fecha
        if (ExpRegFechaBancolombiaALaMano.test(texto) == true){

            //Extraer la fecha de la línea de fecha
            let lineaFecha = texto.match(ExpRegFechaBancolombiaALaMano)[0].replaceAll('\n', ' ').replaceAll('-', ' - ').replaceAll('  ', ' ')
            //let fechaCadena = lineaFecha.match(ExpRegFecha)[0].trim().replace(' - ', ' ')
            let fechaCadena = lineaFecha
            let horaAmPm = ''

            console.log("LA LINEA DE LA FECHA ES:" + lineaFecha)

            //Crear la fecha que se ingresará en el movimiento a partir de la fecha encontrada
            comprobante.fecha = new Date( fechas.extraerFecha(fechaCadena))
            
            // //Otener la hora de la fecha
            // horaAmPm = fechaCadena.substring(fechaCadena.lastIndexOf(' '))
            
            // //Si la hora incluye a.
            // if(horaAmPm.includes('a.')){

            //     //Crear la fecha que se ingresará en el movimiento a partir de la fecha encontrada
            //     comprobante.fecha = new Date( fechas.extraerFecha(fechaCadena.replaceAll(horaAmPm, ' a.m.')))

            // }
            // else if(horaAmPm.includes('p.')){

            //     //Crear la fecha que se ingresará en el movimiento a partir de la fecha encontrada
            //     comprobante.fecha = new Date( fechas.extraerFecha(fechaCadena.replaceAll(horaAmPm, ' p.m.')))

            // }
            console.log('LA FECHA ES:' + comprobante.fecha)
        }
        
        //Si encontró el valor del movimiento
        if (ExpRegValorBancolombiaALaMano.test(texto) == true){
            
            //Extraer el valor de la linea de valor encontrada
            let lineaValor = texto.match(ExpRegValorBancolombiaALaMano)[0].replaceAll('\n', ' ')
            
            //Configurar el valor del comprobante
            comprobante.valor = lineaValor.match(ExpRegValor)[0].replaceAll('$', '').replaceAll(',', '').trim()

        }
        
        //Si encontró el número de la cuenta
        if (ExpRegCuentaBancolombiaALaMano.test(texto) == true){
            
            //Extraer la cuenta de la linea de cuenta encontrada
            let lineaCuenta = texto.match(ExpRegCuentaBancolombiaALaMano)[0].replaceAll('\n', ' ')
            comprobante.cuenta = lineaCuenta.match(ExpRegCuenta)[0].replaceAll(' ', '').replaceAll('-', '')

        }

  
    } catch (err) {
  
      //Mostrar el mensaje de error
      console.error(err);
  
    }
  
    //Retornar los datos
    return comprobante;
  
}

/**
 * Extrae los datos de un comprobante de pago de Daviplata
 * @param {*} texto - Ruta del archivo que se va a escanear
 * @returns 
 */
async function extraerDatosDaviplata(texto){
    
    //Variable donde se almacerarán los datos encontrados
    const comprobante = JSON.parse('{}')
    
    console.log('Extrayendo datos de un comprobante de Daviplata')

    //Configurar los datos a almacenar
    try {

        //Declaración de variables para identificar datos de Daviplata
        const ExpRegDaviplata = new RegExp("[WViplat?]{6,}|[Transacción exitosa]{15,}|[Código QRparcnfmarsutc]{25,}|[Pasó lt]{6,}|[*+6136]{6,}|[Motiv]{5,}", "i")
        const ExpRegFechaDaviplata = new RegExp("[Fechayor: ]{10,}[0-9]{2}-[0-9]{2}-[0-9]{4} [0-9]{2}:[0-9]{2}[ amp]{3}", "i")
        const ExpRegValorDaviplata = new RegExp("\\$[0-9 .]{4,}", "i")
        const ExpRegCuentaDaviplata = new RegExp("[Pasó lt]{8,}[\n]*[a-z ]{6,}[+*0-9]{4,}", "i")
        const ExpRegMotivoDaviplata = new RegExp("[Motiv]{4,}[\n]*[a-záéíóúÁÉÍÓÚ0-9 ]{10,}[\n]", "i")
        const ExpRegOrigenDaviplata = new RegExp("[DaviPlt ]{6,}[*0-9]{8,}", "i")
        
        //Variables donde se guardarán los datos extraidos de las líneas de texto
        const ExpRegCuenta = new RegExp("[0-9]{4,}", "i")
        const ExpRegFecha = new RegExp("[0-9]{2}-[0-9]{2}-[0-9]{4} [0-9]{2}:[0-9]{2}[ amp]{3}", "i")
        const ExpRegValor = new RegExp("\\$[0-9 .]+", "i")
        //const ExpRegOrigen = new RegExp("[Cuenta]{4,}[\nAhorsCient ]{6,}[*0-9]{5}", "i")
        
        //Configurar el medio por el cual realizaron el pago
        comprobante.medio = 'Daviplata'
                            
        //Si encontró la fecha
        if (ExpRegFechaDaviplata.test(texto) == true){

            //Extraer la fecha de la línea de fecha
            let lineaFecha = texto.match(ExpRegFechaDaviplata)[0].replaceAll('\n', ' ')
            let fechaCadena = lineaFecha.match(ExpRegFecha)[0].replaceAll('a. m.', 'a.m.').replaceAll('p. m.', 'p.m.').replaceAll(' Mm.', 'm.').trim()

            //Crear la fecha que se ingresará en el movimiento a partir de la fecha encontrada
            let fecha = new Date(fechaCadena)

            //Remover de la fecha los guiones
            fechaCadena = fechaCadena.replaceAll('-', ' ')

            //Configurar el día de la fecha
            fecha.setDate(parseInt(fechaCadena.split(' ')[0]))

            //Configurar el mes de la fecha
            fecha.setMonth(parseInt(fechaCadena.split(' ')[1]) - 1)

            comprobante.fecha = fecha

        }
        
        //Si encontró el valor del movimiento
        if (ExpRegValorDaviplata.test(texto) == true){
            
            //Extraer el valor de la linea de valor encontrada
            let lineaValor = texto.match(ExpRegValorDaviplata)[0].replaceAll('\n', ' ')
            comprobante.valor = lineaValor.match(ExpRegValor)[0].replaceAll('$', '').replaceAll('.', '').trim()

        }
        
        //Si encontró el número de la cuenta
        if (ExpRegCuentaDaviplata.test(texto) == true){
            
            //Extraer la cuenta de la linea de cuenta encontrada
            let lineaCuenta = texto.match(ExpRegCuentaDaviplata)[0].replaceAll('\n', ' ')
            console.log('lineaCuenta:|' + lineaCuenta + '|')
            comprobante.cuenta = lineaCuenta.match(ExpRegCuenta)[0].replaceAll(' ', '')

        }

        //Si encontró la conversación
        if (ExpRegMotivoDaviplata.test(texto) == true){
            
            //Extraer la conversación de la línea de conversación
            let lineaMotivo = texto.match(ExpRegMotivoDaviplata)[0].replaceAll('\n', ' ').replaceAll('¿', '')

            //Obtener el motivo del pago en el comprobante
            comprobante.conversacion = lineaMotivo.substring(lineaMotivo.indexOf(' ')).trim()

        }
        
        //Si encontró el origen de la transferencia
        if (ExpRegOrigenDaviplata.test(texto) == true){
            
            //Extraer la conversación de la línea de conversación
            let lineaOrigen = texto.match(ExpRegOrigenDaviplata)[0].replaceAll('\n', ' ').replaceAll('¿', '')
            comprobante.origen = lineaOrigen
            
        }
        
  
    } catch (err) {
  
      //Mostrar el mensaje de error
      console.error(err);
  
    }
  
    //Retornar los datos
    return comprobante;
  
}

/**
 * Extrae los datos de un comprobante de pago del Banco de Bogota
 * @param {*} texto - Ruta del archivo que se va a escanear
 * @returns 
 */
async function extraerDatosTransfiya(texto){
    
    //Variable donde se almacerarán los datos encontrados
    const comprobante = JSON.parse('{}')
    
    console.log('Extrayendo datos de un comprobante de Transfiya')

    //Configurar los datos a almacenar
    try {

        //Declaración de variables para identificar datos de Daviplata
        const ExpRegFechaTransfiya = new RegExp("[\\w ]*(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)[\\w ,:.-]*", "i")
        const ExpRegValorTransfiya = new RegExp("Valor([ transfeido]{10,}|[ delnvíioO0]{7,})[\n]+[\\$ 0-9.]{4,}", "i")
        const ExpRegCuentaTransfiya = new RegExp("(Destino: |[AhorLibetóo0n ]{12,})[0-9 ]{6,}", "i")
        const ExpRegReferenciaTransfiya = new RegExp("(C[óÓoO0]digo CUS|N[oO0]. de autorizaci[óÓoO0]n:)[\n][0-9a-z]{4,}", "i")
        
        //Variables donde se guardarán los datos extraidos de las líneas de texto
        const ExpRegCuenta = new RegExp("[0-9 ]{4,}", "i")
        
        //Configurar el medio por el cual realizaron el pago
        comprobante.medio = 'Transfiya'
                            
        //Si encontró la fecha
        if (ExpRegFechaTransfiya.test(texto) == true){
            
            //Extraer la fecha de la línea de fecha
            let lineaFecha = texto.match(ExpRegFechaTransfiya)[0].replaceAll('\n', ' ').replaceAll(', ', ' a las ')
            
            //Crear la fecha que se ingresará en el movimiento a partir de la fecha encontrada
            let fecha = new Date(fechas.extraerFecha(lineaFecha))

            //Configurar la fecha del comprobante
            comprobante.fecha = fecha

        }
        
        //Si encontró el valor del movimiento
        if (ExpRegValorTransfiya.test(texto) == true){
            
            //Extraer el valor de la linea de valor encontrada
            let lineaValor = texto.match(ExpRegValorTransfiya)[0].replaceAll('\n', ' ')

            //Configurar el valor del comprobante
            comprobante.valor = lineaValor.substring(lineaValor.indexOf('$')).replaceAll('$', '').replaceAll('.', '')

        }
        
        //Si encontró el número de la cuenta
        if (ExpRegCuentaTransfiya.test(texto) == true){
            
            //Extraer la cuenta de la linea de cuenta encontrada
            let lineaCuenta = texto.match(ExpRegCuentaTransfiya)[0].replaceAll('\n', ' ')

            //Configurar la cuenta del comprobante
            comprobante.cuenta = lineaCuenta.match(ExpRegCuenta)[0].replaceAll(' ', '')

        }

        //Si encontró la referencia
        if (ExpRegReferenciaTransfiya.test(texto) == true){
            
            //Extraer la conversación de la línea de conversación
            let lineaReferencia = texto.match(ExpRegReferenciaTransfiya)[0].replaceAll('\n', ' ')

            //Obtener el motivo del pago en el comprobante
            comprobante.referencia = lineaReferencia.substring(lineaReferencia.lastIndexOf(' ')).trim()

        }
        
        //Si encontró el origen de la transferencia
        if (texto.includes('BBVA') == true){
            
            //Configurar el origen de la transferencia
            comprobante.origen = 'BBVA'
            
        }
        else if (texto.includes('Banco de Bogotá') == true){
            
            //Configurar el origen de la transferencia
            comprobante.origen = 'Banco de Bogotá'
            
        }
        
    } catch (err) {
  
      //Mostrar el mensaje de error
      console.error(err);
  
    }
  
    //Retornar los datos
    return comprobante;
  
}

module.exports = {clasificar, escanearConTesseract, escanearConGoogle, extraerDatosCorresponsal, extraerDatosNequi, extraerDatosBancolombia, extraerDatosBancolombiaALaMano, extraerDatosDaviplata, extraerDatosTransfiya}