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
        const ExpRegCorresponsal = new RegExp("[Redban]{7,}|[CORESPNAL]{10,}|[RBMDES]{6,}", "i")
        
        //Declaración de variables para identificar datos de Nequi
        const ExpRegNequi = new RegExp("[Enviío ]{4,}[Realizdo]{7,}|De d[óo]nde sali[óo] la plata|Movimiento[ hecon:]+[\na-z]+[Nequi]*|Detalle del[\n ]+movimiento|[movement\\W]{6,}[receipt\\W]{5,}[bpody\\W]{3,}[title]{3,}", "i")
        
        //Declaración de variables para identificar datos de Bancolombia
        const ExpRegBancolombia = new RegExp("[Transfeci Exto]{20,}|[¡Transfeci lzd!]{20,}|[Comprbante .0-9]{20,}|[Productigen ]{15,}|[Productdesin ]{15,}[\n]+[a-z]+[\n]+[0-9]{10}[\n]+", "i")
        
        //Declaración de variables para identificar datos de Bancolombia
        const ExpRegDaviplata = new RegExp("[WViplat?]{8,}|[Transacción exitosa]{15,}|[Código QRparcnfmarsutc]{25,}|[Pasó lt]{6,}|[*+6136]{6,}|[Motiv]{5,}", "i")

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
        else if(ExpRegDaviplata.test(texto) == true){

            //Si el comprobante es de un corresponsal
            resultado = 'DAVIPLATA'
            
        }

    } catch (err) {

        //Mostrar el mensaje de error
        console.error(err);

    }

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
        const ExpRegFechaNequi = new RegExp("[Fecha ]{3,}[\n]*[ -a-z]*[0-9]+ de [a-z]+ de [0-9]{4}[, als]*[0-9]{1,}:[0-9]{2}[amp .\n]+", "i")
        const ExpRegValorNequi = new RegExp("[Cuaánto\\?]{6}[\n]*\\$[0-9 .]+", "i")
        const ExpRegConversacionNequi = new RegExp("[Conversaió]{10,}[\na-záéíóúÁÉÏÓÚ,. 0-9]+\\¿", "i")

        //Variables donde se guardarán los datos extraidos de las líneas de texto
        const ExpRegReferencia = new RegExp("[MS]+[0-9]{4,}", "i")
        const ExpRegCuenta = new RegExp("3[0-9 ]{9,}", "i")
        const ExpRegFecha = new RegExp("[0-9]+ de [a-z]+ de [0-9]{4}[, als]*[0-9]{1,}:[0-9]{2}[amp .]+", "i")
        const ExpRegValor = new RegExp("\\$[0-9 .]+", "i")
        const ExpRegConversacion = new RegExp("\\$[0-9 .]+", "i")
        
        //Configurar el medio por el cual realizaron el pago
        comprobante.medio = 'Nequi'
        
        //Si encontró al referencia de pago
        if (ExpRegReferenciaNequi.test(texto) == true){
            
            //Extraer la referencia de la línea de referencia
            let lineaReferencia = texto.match(ExpRegReferenciaNequi)[0].replaceAll('\n', ' ')
            comprobante.referencia = lineaReferencia.match(ExpRegReferencia)[0]

        }
        
        //Si encontró la conversación
        if (ExpRegConversacionNequi.test(texto) == true){
            
            //Extraer la conversación de la línea de conversación
            let lineaConversacion = texto.match(ExpRegConversacionNequi)[0].replaceAll('\n', ' ').replaceAll('¿', '')
            comprobante.conversacion = lineaConversacion.substring(lineaConversacion.indexOf(' ')).trim()

        }
        
        //Si encontró la fecha
        if (ExpRegFechaNequi.test(texto) == true){

            //Extraer la fecha de la línea de fecha
            let lineaFecha = texto.match(ExpRegFechaNequi)[0].replaceAll('\n', ' ')
            let fechaCadena = lineaFecha.match(ExpRegFecha)[0].replaceAll('a. m.', 'a.m.').replaceAll('p. m.', 'p.m.').replaceAll(' Mm.', 'm.').trim()
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
            let lineaFecha = texto.match(ExpRegFechaBancolombia)[0].replaceAll('\n', ' ')
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
            console.log('Entró en conversacion')
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

module.exports = {clasificar, escanearConTesseract, escanearConGoogle, extraerDatosCorresponsal, extraerDatosNequi, extraerDatosBancolombia, extraerDatosDaviplata}