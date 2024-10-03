const {addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const { delay, downloadMediaMessage } = require('@whiskeysockets/baileys');
const { writeFile } = require("node:fs/promises")
const path = require('path')
const { createWorker } = require('tesseract.js')
const fs = require('fs')
require('dotenv').config()

//////////////////////////////////////// FUNCIONES ELABORADAS

//const registrarConversacion = require('../Funciones/registrarConversacion.js')
const mensajes = require('../Configuracion/botAtencionAlCliente/mensajes.js')
const cliente = require('../Funciones/cliente.js')
const cuentaBancaria = require('../Funciones/cuenta.js')
const movimiento = require('../Funciones/movimiento.js')
const configuracion = require('../Configuracion/configuracion.js')
const fechas = require('../Funciones/fechas.js')
const temporizador = require('../Funciones/temporizador.js')
const { constants } = require('node:buffer')
const { ESLint } = require('eslint')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

//const flujoTipoFalla = require('./flujoReportarFallaTipoFalla')

////////////////////////////////////////////////////////////////////////////////

const clientesConsultados = JSON.parse('{"datos":[]}')
const ExpRegRespuestas = new RegExp("^S[íiÍ]|^N[oóÓ]", "i")
const ExpRegRespuestaNo = new RegExp("^N[oóÓ]", "i")
const ExpRegRespuestaSi = new RegExp("^S[íiÍ]", "i")
const ExpRegRespuestasTitular = new RegExp("^S[íiÍ]|[a-zA-ZñÑáéíóúÁÉÍÓÚ ]{3,}", "i")
const ExpRegRespuestasMismo = new RegExp("^S[íiÍ]", "i")
const ExpRegRespuestasOtro = new RegExp("[a-zA-ZñÑáéíóúÁÉÍÓÚ ]{3,}", "i")
var nombreArchivo = ''
let primerNombre
let idClientePago
let medio = ''
let referencia = ''
let comprobante = ''
let origen = ''
let conversacion = ''
var datosCuenta
var fecha
var valor = ''
var cuenta = ''
var idCuenta = ''
var cunico = ''
var recibo = ''
var ter = ''
var rrn = ''
var apro = ''


module.exports = flujoReportePagoEscaneoComprobante = addKeyword('EVENTS.MEDIA')
    .addAnswer(mensajes.MENSAJE_REVISANDO_COMPROBANTE, {capture:false}, async (ctx, ctxFn) => {

        //Variable donde se almacenará el texto obtenido de la imagen
        let textoComprobante = ''
        medio = ''
        referencia = ''
        comprobante = ''
        origen = ''
        conversacion = ''
        datosCuenta
        fecha = ''
        valor = ''
        cuenta = ''
        idCuenta = ''
        cunico = ''
        recibo = ''
        ter = ''
        rrn = ''
        apro = ''

        //Variables para las expresiones regulares que evaluaran la respuesta
        const ExpRegClienteElegido = new RegExp(ctxFn.state.get('posicionElegir'), "i")
        const ExpRegNinguno = new RegExp("^N[oOóÓ]$|Ning[uUúÚnoa]+", "i")

        //Declaración de variables para identificar datos de corresponsal
        const ExpRegCorresponsal = new RegExp("[Redban]{6,}|[CORESPNAL]{10,}|[REMDS]{5,}", "i")
        const ExpRegFechaCorresponsal = new RegExp("[ENFBMARYJULGOSPCTVDI]{3} [0-9]{2} [0-9]{4} [0-9]{2}:[0-9]{2}:[0-9]{2}", "i")
        const ExpRegValorCorresponsal = new RegExp("[Valor]{3,}[\n]*[$ 0-9.]{4,}|\\$[ 0-9.]{4,}", "i")
        
        //Declaración de variables para identificar datos de Nequi
        const ExpRegNequi = new RegExp("De d[óo]nde sali[óo] la plata|Movimiento[ hecon:]+[\na-z]+[Nequi]*|Detalle del[\n ]+movimiento|[movement\\W]{6,}[receipt\\W]{5,}[bpody\\W]{3,}[title]{3,}", "i")
        const ExpRegReferenciaNequi = new RegExp("[Rfencia ]{6,}[\n| ]*[MS]*[0-9]{4,}|[movement\\W]{6,}[receipt\\W]{5,}[bpody\\W]{3,}[reference\\W]{6,}[MS]*[0-9]{4,}", "i")
        const ExpRegCuentaNequi = new RegExp("[Núumeroeqi ]{4,}[\n]*3[0-9 ]{9,}", "i")
        const ExpRegFechaNequi = new RegExp("[Fecha ]{3,}[\n]*[ -a-z]*[0-9]+ de [a-z]+ de [0-9]{4}[, als]*[0-9]{1,}:[0-9]{2}[amp .\n]+", "i")
        const ExpRegValorNequi = new RegExp("[Cuaánto\\?]{6}[\n]*\\$[0-9 .]+", "i")
        const ExpRegConversacionNequi = new RegExp("[Conversaió]{10,}[\na-záéíóúÁÉÏÓÚ,. 0-9]+\\¿", "i")

        //Declaración de variables para identificar datos de Bancolombia
        const ExpRegBancolombia = new RegExp("[Transfeci Exto]{20,}|[Comprbante .0-9]{20,}|[Productigen ]{15,}|[Productdesin ]{15,}[\n]+[a-z]+[\n]+[0-9]{10}[\n]+", "i")
        const ExpRegComprobanteBancolombia = new RegExp("[Comprbante .0-9]{20,}\n", "i")
        const ExpRegOrigenBancolombia = new RegExp("[Productigena ]{15,}[\n]+[Cuenta]{4,}[\n]+[AhorsCient]{4,}[\n]+[*0-9]{5}", "i")
        const ExpRegFechaBancolombia = new RegExp("\n[0-9]{1,2}[a-z ]{5}[0-9]{4}[ -]{2,}[0-9]{2}:[0-9]{2}[ amp.]{4,}\n", "i")
        const ExpRegValorBancolombia = new RegExp("[Valor eniad]{10,}[\n][$ 0-9.]+", "i")
        const ExpRegCuentaBancolombia = new RegExp("[Productdesin ]{15,}[\n]+[a-z]+[\n]+[0-9]{10}[\n]+", "i")

        //Declaración de variables para identificar datos de Bancolombia
        const ExpRegDaviplata = new RegExp("[WViplat?]{6,}|[Transacción exitosa]{15,}|[Código QRparcnfmarsutc]{25,}|[Pasó lt]{6,}|[*+6136]{6,}|[Motiv]{5,}", "i")
        const ExpRegFechaDaviplata = new RegExp("[Fechayor: ]{10,}[0-9]{2}-[0-9]{2}-[0-9]{4} [0-9]{2}:[0-9]{2}[ amp]{3}", "i")
        const ExpRegValorDaviplata = new RegExp("\\$[0-9 .]{4,}", "i")
        const ExpRegCuentaDaviplata = new RegExp("[Pasó lt]{8,}[\n]*[a-z ]{6,}\\W[*0-9]{4,}", "i")
        const ExpRegMotivoDaviplata = new RegExp("[Motiv]{4,}[\n]*[a-záéíóúÁÉÍÓÚ0-9 ]{10,}[\n]", "i")
        const ExpRegOrigenDaviplata = new RegExp("[DaviPlt ]{6,}[*0-9]{8,}", "i")

        //Registrar el inicio de la conversación
        try {

            //Evaluar si el usuario envió una nota de voz
            if(ctx.body.includes('event_voice_note')==true){

                //Informar al cliente que en el momento no se pueden procesar sus notas de voz
                await ctxFn.flowDynamic(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)
                
                //Hacer una pausa de 2 segundos
                await delay(1000)

                //Retorar la respuesta a opción incorrecta
                return ctxFn.fallBack(ctxFn.state.get('mensajePreguntaActual'))
                
            }
            else if(ExpRegClienteElegido.test(ctx.body) == false){

                //Solicitar una respuesta valida
                return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + ctxFn.state.get('mensajePreguntaActual'))
                
            }
            else{

                //Mostrar en consola el proceso
                console.log('Escaneando comrpobante')

                //Crear la instancia que se encargará de extraer el texto de la imagen
                const worker = await createWorker("spa", 1, {
                    //logger: m => console.log(m),
                })

                console.log('El archivo es: ' + ctxFn.state.get('archivoComprobante'))

                //Extraer el texto del comprobante de pago
                const { data: { text: texto } } = await worker.recognize(ctxFn.state.get('archivoComprobante'))

                //Mostrar en la consola el texto obtenido 
                console.log(texto)

                //Obtener el texto del comprobante
                textoComprobante = texto

                //Si el comprobante escaneado es de un corresponsal
                if(ExpRegCorresponsal.test(textoComprobante) == true){
                    console.log('Es de un corresponsal')
                    //Variables de Google vision para detectar el texto
                    const vision = require('@google-cloud/vision')
                    
                    // Creates a client
                    const cliente = new vision.ImageAnnotatorClient()

                    //Archivo que se escaneará
                    //const comprobante = nombreArchivo
                    const comprobante = ctxFn.state.get('archivoComprobante')

                    //Extraer el texto del archivo
                    const [salida] = await cliente.textDetection(comprobante)
                    const hallazgos = salida.textAnnotations

                    //Obtener el texto extraído del comprobante
                    textoComprobante = hallazgos[0].description

                    console.log('textoComprobante' + textoComprobante)
                    
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
                    medio = 'Corresponsal'

                    //Si tiene al menos una coincidencia
                    if (ExpRegFecha.test(textoComprobante) == true){
                        
                        //Extraer la fecha de la línea de fecha
                        let lineaFecha = textoComprobante.match(ExpRegFechaCorresponsal)[0].replaceAll('\n', ' ')
                        
                        //Extraer el mes de la fecha
                        let mes = lineaFecha.substring(0, lineaFecha.indexOf(' ') + 1).replace('ENE','JAN').replace('ABR','APR').replace('AGO','AUG').replace('DEC','DIC').replace('¿UN', 'JUN')

                        //Remover el mes del principio de la línea para formatearla correctamente
                        lineaFecha = lineaFecha.replace(mes, '')

                        //Agregar el mes a la fecha
                        lineaFecha = lineaFecha.slice(0, lineaFecha.indexOf(' ') + 1) + mes.trim() + lineaFecha.slice(lineaFecha.indexOf(' '))

                        //Crear la fecha que se ingresará en el movimiento a partir de la fecha encontrada
                        fecha = new Date( lineaFecha)

                    }

                    //Si tiene al menos una coincidencia
                    if (ExpRegCuenta.test(textoComprobante) == true){
                        
                        //Obtener la línea de la cuenta
                        let lineaCuenta = textoComprobante.match(ExpRegCuenta)[0]

                        //Obtener la cuenta
                        cuenta = lineaCuenta.substring(lineaCuenta.indexOf(' ') + 1).replaceAll(' ', '').trim()

                        //Buscar en la base de datos la cuenta en la cual se realizó el pago
                        datosCuenta = await cuentaBancaria.obtenerCuenta('', cuenta)

                        //Si la búsqueda de la cuenta no arrojó resultados
                        if (Object.keys(datosCuenta.data).length == 0){

                            //Enviar comprobante del problema
                            await ctxFn.provider.sendImage(configuracion.NUMERO_NOTIFICAR, nombreArchivo, mensajes.MENSAJE_NOTIFICAR_PAGO_A_CUENTA_INEXISTENTE)

                            //Enviar datos extraidos del comprobante
                            await ctxFn.provider.sendText(configuracion.NUMERO_NOTIFICAR, mensajes.MENSAJE_NOTIFICAR_TEXTO_ESCANEADO + textoComprobante)

                            //Informar al cliente que la cuenta está errada
                            return ctxFn.fallBack(mensajes.MENSAJE_CUENTA_NO_EXISTE.replaceAll('{CUENTA}', cuenta))
                            
                        }
                        else{

                            //Obtener el id de la cuenta en la cual se realizó el pago
                            idCuenta = datosCuenta.data[0].id

                        }

                    }
                    console.log('VA PARA EL VALOR')
                    //Si tiene al menos una coincidencia
                    if (ExpRegValorCorresponsal.test(textoComprobante) == true){
                        
                        //Obtener la línea del valor
                        let lineaValor = textoComprobante.match(ExpRegValorCorresponsal)[0]

                        console.log('lineaValor ' + lineaValor)
                        
                        //Obtener el valor de la línea
                        //valor = lineaValor.replaceAll('$', '').replaceAll('\n', '').replaceAll(' ', '').replaceAll('.', '')
                        valor = lineaValor.match(ExpRegValor)[0].replaceAll('.', '').replaceAll('\n', '')

                    }

                    //Si tiene al menos una coincidencia
                    if (ExpRegCodigoUnico.test(textoComprobante) == true){
                        
                        //Obtener la línea del valor
                        let lineaCunico = textoComprobante.match(ExpRegCodigoUnico)[0]

                        //Obtener el cunico de la línea
                        cunico = lineaCunico.substring(lineaCunico.lastIndexOf(' ') + 1)

                    }

                    //Si tiene al menos una coincidencia
                    if (ExpRegRecibo.test(textoComprobante) == true){
                        
                        //Obtener la línea del valor
                        let lineaRecibo = textoComprobante.match(ExpRegRecibo)[0]

                        //Obtener el cunico de la línea
                        recibo = lineaRecibo.substring(lineaRecibo.lastIndexOf(' ') + 1)

                    }

                    
                    //Si tiene al menos una coincidencia
                    if (ExpRegTer.test(textoComprobante) == true){
                        
                        //Obtener la línea del valor
                        let lineaTer = textoComprobante.match(ExpRegTer)[0]

                        //Obtener el cunico de la línea
                        ter = lineaTer.substring(lineaTer.lastIndexOf(' ') + 1)

                    }

                    //Si tiene al menos una coincidencia
                    if (ExpRegRrn.test(textoComprobante) == true){
                        
                        //Obtener la línea del valor
                        let lineaRrn = textoComprobante.match(ExpRegRrn)[0]

                        //Obtener el cunico de la línea
                        rrn = lineaRrn.substring(lineaRrn.lastIndexOf(' ') + 1)

                    }

                    //Si tiene al menos una coincidencia
                    if (ExpRegApro.test(textoComprobante) == true){
                        
                        //Obtener la línea del valor
                        let lineaApro = textoComprobante.match(ExpRegApro)[0]

                        //Obtener el cunico de la línea
                        apro = lineaApro.substring(lineaApro.lastIndexOf(' ') + 1)

                    }

                }
                else if(ExpRegNequi.test(textoComprobante) == true){
                    console.log('Es de Nequi')
                    //Variables donde se guardarán los datos extraidos de las líneas de texto
                    const ExpRegReferencia = new RegExp("[MS]+[0-9]{4,}", "i")
                    const ExpRegCuenta = new RegExp("3[0-9 ]{9,}", "i")
                    const ExpRegFecha = new RegExp("[0-9]+ de [a-z]+ de [0-9]{4}[, als]*[0-9]{1,}:[0-9]{2}[amp .]+", "i")
                    const ExpRegValor = new RegExp("\\$[0-9 .]+", "i")
                    const ExpRegConversacion = new RegExp("\\$[0-9 .]+", "i")
                    
                    //Configurar el medio por el cual realizaron el pago
                    medio = 'Nequi'
                    
                    //Si encontró al referencia de pago
                    if (ExpRegReferenciaNequi.test(textoComprobante) == true){
                        
                        //Extraer la referencia de la línea de referencia
                        let lineaReferencia = textoComprobante.match(ExpRegReferenciaNequi)[0].replaceAll('\n', ' ')
                        referencia = lineaReferencia.match(ExpRegReferencia)[0]

                    }
                    
                    //Si encontró la conversación
                    if (ExpRegConversacionNequi.test(textoComprobante) == true){
                        
                        //Extraer la conversación de la línea de conversación
                        let lineaConversacion = textoComprobante.match(ExpRegConversacionNequi)[0].replaceAll('\n', ' ').replaceAll('¿', '')
                        conversacion = lineaConversacion.substring(lineaConversacion.indexOf(' ')).trim()

                    }
                    
                    //Si encontró la fecha
                    if (ExpRegFechaNequi.test(textoComprobante) == true){

                        //Extraer la fecha de la línea de fecha
                        let lineaFecha = textoComprobante.match(ExpRegFechaNequi)[0].replaceAll('\n', ' ')
                        let fechaCadena = lineaFecha.match(ExpRegFecha)[0].replaceAll('a. m.', 'a.m.').replaceAll('p. m.', 'p.m.').replaceAll(' Mm.', 'm.').trim()
                        let horaAmPm = ''

                        //Otener la hora de la fecha
                        horaAmPm = fechaCadena.substring(fechaCadena.lastIndexOf(' '))
                        
                        console.log('lineaFecha=' + lineaFecha)
                        console.log('fechaCadena=' + fechaCadena)
                        console.log('horaAmPm=' + horaAmPm)
                        
                        //Si la hora incluye a.
                        if(horaAmPm.includes('a.')){

                            //Crear la fecha que se ingresará en el movimiento a partir de la fecha encontrada
                            fecha = new Date(fechas.extraerFecha(fechaCadena.replaceAll(horaAmPm, ' a.m.')))

                        }
                        else if(horaAmPm.includes('p.')){

                            //Crear la fecha que se ingresará en el movimiento a partir de la fecha encontrada
                            fecha = new Date(fechas.extraerFecha(fechaCadena.replaceAll(horaAmPm, ' p.m.')))

                        }

                    }
                    
                    //Si encontró el valor del movimiento
                    if (ExpRegValorNequi.test(textoComprobante) == true){
                        
                        //Extraer el valor de la linea de valor encontrada
                        let lineaValor = textoComprobante.match(ExpRegValorNequi)[0].replaceAll('\n', ' ')
                        console.log('Valor antes:|' + lineaValor + '|')
                        valor = lineaValor.match(ExpRegValor)[0].replaceAll('$', '').replaceAll('.', '').trim()
                        console.log('Valor despues:|' + valor + '|')

                    }
                    
                    //Si encontró el número de la cuenta
                    if (ExpRegCuentaNequi.test(textoComprobante) == true){
                        
                        //Extraer la cuenta de la linea de cuenta encontrada
                        let lineaCuenta = textoComprobante.match(ExpRegCuentaNequi)[0].replaceAll('\n', ' ')
                        cuenta = lineaCuenta.match(ExpRegCuenta)[0].replaceAll(' ', '')

                        //Buscar en la base de datos la cuenta en la cual se realizó el pago
                        datosCuenta = await cuentaBancaria.obtenerCuenta('', cuenta)

                        //Si la búsqueda de la cuenta no arrojó resultados
                        if (Object.keys(datosCuenta.data).length == 0){

                            //Enviar comprobante del problema
                            await ctxFn.provider.sendImage(configuracion.NUMERO_NOTIFICAR, nombreArchivo, mensajes.MENSAJE_NOTIFICAR_PAGO_A_CUENTA_INEXISTENTE)

                            //Enviar datos extraidos del comprobante
                            await ctxFn.provider.sendText(configuracion.NUMERO_NOTIFICAR, mensajes.MENSAJE_NOTIFICAR_TEXTO_ESCANEADO + textoComprobante)

                            //Informar al cliente que la cuenta está errada
                            return ctxFn.fallBack(mensajes.MENSAJE_CUENTA_NO_EXISTE.replaceAll('{CUENTA}', cuenta))
                            
                        }
                        else{

                            //Obtener el id de la cuenta en la cual se realizó el pago
                            idCuenta = datosCuenta.data[0].id

                        }

                    }

                }
                else if(ExpRegBancolombia.test(textoComprobante) == true){
                    
                    //Variables donde se guardarán los datos extraidos de las líneas de texto
                    const ExpRegComprobante = new RegExp("[0-9]+", "i")
                    const ExpRegOrigen = new RegExp("[Cuenta]{4,}[\nAhorsCient ]{6,}[*0-9]{5}", "i")
                    const ExpRegFecha = new RegExp("[0-9]{1,2}[a-z ]{5}[0-9]{4}[ -]{2,}[0-9]{2}:[0-9]{2}[ amp.]{4,}", "i")
                    const ExpRegValor = new RegExp("[0-9.]+", "i")
                    const ExpRegCuenta = new RegExp("[0-9]{10,}", "i")
                    
                    //Configurar el medio por el cual realizaron el pago
                    medio = 'Bancolombia'
                    
                    //Si encontró el comprobante de pago
                    if (ExpRegComprobanteBancolombia.test(textoComprobante) == true){
                        
                        //Extraer la referencia de la línea de referencia
                        let lineaComprobante = textoComprobante.match(ExpRegComprobanteBancolombia)[0].replaceAll('\n', ' ')
                        comprobante = lineaComprobante.match(ExpRegComprobante)[0]

                    }
                    
                    //Si encontró la conversación
                    if (ExpRegOrigenBancolombia.test(textoComprobante) == true){
                        
                        //Extraer la conversación de la línea de conversación
                        let lineaOrigen = textoComprobante.match(ExpRegOrigenBancolombia)[0].replaceAll('\n', ' ').replaceAll('¿', '')
                        origen = lineaOrigen.match(ExpRegOrigen)[0]
                        
                    }
                    
                    //Si encontró la fecha
                    if (ExpRegFechaBancolombia.test(textoComprobante) == true){

                        //Extraer la fecha de la línea de fecha
                        let lineaFecha = textoComprobante.match(ExpRegFechaBancolombia)[0].replaceAll('\n', ' ')
                        let fechaCadena = lineaFecha.match(ExpRegFecha)[0].trim().replace(' - ', ' ')
                        let horaAmPm = ''
                        
                        //Otener la hora de la fecha
                        horaAmPm = fechaCadena.substring(fechaCadena.lastIndexOf(' '))
                        
                        //Si la hora incluye a.
                        if(horaAmPm.includes('a.')){

                            //Crear la fecha que se ingresará en el movimiento a partir de la fecha encontrada
                            fecha = new Date( fechas.extraerFecha(fechaCadena.replaceAll(horaAmPm, ' a.m.')))

                        }
                        else if(horaAmPm.includes('p.')){

                            //Crear la fecha que se ingresará en el movimiento a partir de la fecha encontrada
                            fecha = new Date( fechas.extraerFecha(fechaCadena.replaceAll(horaAmPm, ' p.m.')))

                        }
                        
                    }
                    
                    //Si encontró el valor del movimiento
                    if (ExpRegValorBancolombia.test(textoComprobante) == true){
                        
                        //Extraer el valor de la linea de valor encontrada
                        let lineaValor = textoComprobante.match(ExpRegValorBancolombia)[0].replaceAll('\n', ' ')
                        valor = lineaValor.match(ExpRegValor)[0].replaceAll('$', '').replaceAll('.', '').trim()

                    }
                    
                    //Si encontró el número de la cuenta
                    if (ExpRegCuentaBancolombia.test(textoComprobante) == true){
                        
                        //Extraer la cuenta de la linea de cuenta encontrada
                        let lineaCuenta = textoComprobante.match(ExpRegCuentaBancolombia)[0].replaceAll('\n', ' ')
                        cuenta = lineaCuenta.match(ExpRegCuenta)[0].replaceAll(' ', '')

                        //Buscar en la base de datos la cuenta en la cual se realizó el pago
                        datosCuenta = await cuentaBancaria.obtenerCuenta('', cuenta)

                        //Si la búsqueda de la cuenta no arrojó resultados
                        if (Object.keys(datosCuenta.data).length == 0){

                            //Enviar comprobante del problema
                            await ctxFn.provider.sendImage(configuracion.NUMERO_NOTIFICAR, nombreArchivo, mensajes.MENSAJE_NOTIFICAR_PAGO_A_CUENTA_INEXISTENTE)

                            //Enviar datos extraidos del comprobante
                            await ctxFn.provider.sendText(configuracion.NUMERO_NOTIFICAR, mensajes.MENSAJE_NOTIFICAR_TEXTO_ESCANEADO + textoComprobante)

                            //Informar al cliente que la cuenta está errada
                            return ctxFn.fallBack(mensajes.MENSAJE_CUENTA_NO_EXISTE.replaceAll('{CUENTA}', cuenta))
                            
                        }
                        else{

                            //Obtener el id de la cuenta en la cual se realizó el pago
                            idCuenta = datosCuenta.data[0].id

                        }

                    }

                }
                else if(ExpRegDaviplata.test(textoComprobante) == true){
                    console.log('Es de Daviplata')


                    /////////////////PROCESAR EL COMPROBANTE CO GOOGLE///////////////////

                    //Variables de Google vision para detectar el texto
                    const vision = require('@google-cloud/vision')
                    
                    // Creates a client
                    const cliente = new vision.ImageAnnotatorClient()

                    //Archivo que se escaneará
                    //const comprobante = nombreArchivo
                    const comprobante = ctxFn.state.get('archivoComprobante')

                    //Extraer el texto del archivo
                    const [salida] = await cliente.textDetection(comprobante)
                    const hallazgos = salida.textAnnotations

                    //Obtener el texto extraído del comprobante
                    textoComprobante = hallazgos[0].description

                    console.log('textoComprobante' + textoComprobante)

                    /////////////////////////////////////////////////////////////////////////


                    //Variables donde se guardarán los datos extraidos de las líneas de texto
                    const ExpRegCuenta = new RegExp("[0-9]{4,}", "i")
                    const ExpRegFecha = new RegExp("[0-9]{2}-[0-9]{2}-[0-9]{4} [0-9]{2}:[0-9]{2}[ amp]{3}", "i")
                    const ExpRegValor = new RegExp("\\$[0-9 .]+", "i")
                    //const ExpRegOrigen = new RegExp("[Cuenta]{4,}[\nAhorsCient ]{6,}[*0-9]{5}", "i")
                    
                    //Configurar el medio por el cual realizaron el pago
                    medio = 'Daviplata'
                                        
                    //Si encontró la fecha
                    if (ExpRegFechaDaviplata.test(textoComprobante) == true){

                        //Extraer la fecha de la línea de fecha
                        let lineaFecha = textoComprobante.match(ExpRegFechaDaviplata)[0].replaceAll('\n', ' ')
                        let fechaCadena = lineaFecha.match(ExpRegFecha)[0].replaceAll('a. m.', 'a.m.').replaceAll('p. m.', 'p.m.').replaceAll(' Mm.', 'm.').trim()

                        console.log('fechaCadena:|' + fechaCadena + '|')

                        //Crear la fecha que se ingresará en el movimiento a partir de la fecha encontrada
                        fecha = new Date(fechaCadena)

                        //Remover de la fecha los guiones
                        fechaCadena = fechaCadena.replaceAll('-', ' ')

                        //Configurar el día de la fecha
                        fecha.setDate(parseInt(fechaCadena.split(' ')[0]))

                        //Configurar el mes de la fecha
                        fecha.setMonth(parseInt(fechaCadena.split(' ')[1]) - 1)

                    }
                    
                    //Si encontró el valor del movimiento
                    if (ExpRegValorDaviplata.test(textoComprobante) == true){
                        
                        //Extraer el valor de la linea de valor encontrada
                        let lineaValor = textoComprobante.match(ExpRegValorDaviplata)[0].replaceAll('\n', ' ')
                        console.log('Valor antes:|' + lineaValor + '|')
                        valor = lineaValor.match(ExpRegValor)[0].replaceAll('$', '').replaceAll('.', '').trim()
                        console.log('Valor despues:|' + valor + '|')

                    }
                    
                    //Si encontró el número de la cuenta
                    if (ExpRegCuentaDaviplata.test(textoComprobante) == true){
                        
                        //Extraer la cuenta de la linea de cuenta encontrada
                        let lineaCuenta = textoComprobante.match(ExpRegCuentaDaviplata)[0].replaceAll('\n', ' ')

                        console.log('lineaCuenta |' + lineaCuenta + '|')

                        cuenta = lineaCuenta.match(ExpRegCuenta)[0].replaceAll(' ', '')

                        console.log('cuenta |' + cuenta + '|')

                        //Buscar en la base de datos la cuenta en la cual se realizó el pago
                        datosCuenta = await cuentaBancaria.obtenerCuenta('Daviplata', cuenta)

                        //Si la búsqueda de la cuenta no arrojó resultados
                        if (Object.keys(datosCuenta.data).length == 0){

                            //Enviar comprobante del problema
                            await ctxFn.provider.sendImage(configuracion.NUMERO_NOTIFICAR, nombreArchivo, mensajes.MENSAJE_NOTIFICAR_PAGO_A_CUENTA_INEXISTENTE)

                            //Enviar datos extraidos del comprobante
                            await ctxFn.provider.sendText(configuracion.NUMERO_NOTIFICAR, mensajes.MENSAJE_NOTIFICAR_TEXTO_ESCANEADO + textoComprobante)

                            //Informar al cliente que la cuenta está errada
                            return ctxFn.fallBack(mensajes.MENSAJE_CUENTA_NO_EXISTE.replaceAll('{CUENTA}', cuenta))
                            
                        }
                        else{

                            //Obtener el id de la cuenta en la cual se realizó el pago
                            idCuenta = datosCuenta.data[0].id

                        }

                    }

                    //Si encontró la conversación
                    if (ExpRegMotivoDaviplata.test(textoComprobante) == true){
                        
                        //Extraer la conversación de la línea de conversación
                        let lineaMotivo = textoComprobante.match(ExpRegMotivoDaviplata)[0].replaceAll('\n', ' ').replaceAll('¿', '')

                        //Obtener el motivo del pago en el comprobante
                        conversacion = lineaMotivo.substring(lineaMotivo.indexOf(' ')).trim()

                    }
                    
                    //Si encontró el origen de la transferencia
                    if (ExpRegOrigenDaviplata.test(textoComprobante) == true){
                        
                        //Extraer la conversación de la línea de conversación
                        let lineaOrigen = textoComprobante.match(ExpRegOrigenDaviplata)[0].replaceAll('\n', ' ').replaceAll('¿', '')
                        origen = lineaOrigen
                        
                    }
                    
                }
                // console.log('Creo que va aca')
                // //Variable para obtener el resumen de la cuenta
                // let resumenCuenta = 'Banco: *' + ctxFn.state.get('cuentaBanco') + '* \nTipo: ' + ctxFn.state.get('cuentaTipo') + '\nNúmero: *' + ctxFn.state.get('cuentaNumero').slice(0, 3) + ' ' + ctxFn.state.get('cuentaNumero').slice(3, 6) + ' ' + ctxFn.state.get('cuentaNumero').slice(6) + '* \nNombre: ' + ctxFn.state.get('cuentaTitular') + '\nIdentificación: ' + ctxFn.state.get('cuentaIdentificacion')
                
                console.log('Los datos necesarios son:')
                console.log(fecha)
                console.log(idCuenta)
                console.log(valor)


                //Si los datos básicos del movimiento están completos
                if(fecha != '' && idCuenta != '' && valor != '' && fecha != 'Invalid Date'){

                    //Variale para almacenar los datos del movimiento
                    let datosMovimiento = await movimiento.obtenerMovimiento(fecha, idCuenta, valor, referencia, cunico, recibo, rrn, apro)

                    //Si el movimiento enviado ya existe
                    if(Object.keys(datosMovimiento.data).length > 0){
                        
                        //Mostrar las opciones de nuevo
                        ctxFn.flowDynamic(mensajes.MENSAJE_COMPROBANTE_YA_EXISTE)
                        
                        //Iniciar el temporizador de espera de respuesta del cliente
                        temporizador.detenerTemporizador(ctx)
                        temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAtencionAlCliente/flujoNoTengoRespuestaAtencionAlCliente', mensajes.MENSAJE_SIN_DATOS_NECESARIOS)
                
                        //Ir al flujo de despedida
                        ctxFn.gotoFlow(require('./flujoAlgoMasAtencionAlCliente.js'))

                    }
                    else{

                        //Guardar en la variable de estado el mensaje para enviarlo en un fallback si es necesario
                        ctxFn.state.update({mensajePreguntaActual: mensajes.MENSAJE_COMPROBANTE_CONFIRMACION.replace('{NOMBRE_CLIENTE}', ctxFn.state.get('nombreClientePago'))})

                        //Mostrar las opciones de nuevo
                        ctxFn.flowDynamic(mensajes.MENSAJE_COMPROBANTE_CONFIRMACION.replace('{NOMBRE_CLIENTE}', ctxFn.state.get('nombreClientePago')))

                    }

                }
                else{

                    //Mostrar mensaje de información
                    console.log('Hacen falta datos del pago')

                    //Mostrar las opciones de nuevo
                    ctxFn.flowDynamic(mensajes.MENSAJE_DATOS_INCOMPLETOS)


                }

            }
            
        } catch (error) {

            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación en el flujo flujoFalla, el sistema respondió: ' + error)

        }

        //Iniciar el temporizador de espera de respuesta del cliente
        temporizador.detenerTemporizador(ctx)
        temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAtencionAlCliente/flujoNoTengoRespuestaAtencionAlCliente', mensajes.MENSAJE_SIN_DATOS_NECESARIOS)

    })
    .addAction({capture:true}, async (ctx, ctxFn) => {

        //Variable para crear la expresión regular que evauará la respuesta
        const ExpRegConfirmarPago = new RegExp("^S[íiÍ]|^N[oóÓ]", "i")
        const ExpRegConfirmarPagoSi = new RegExp("^S[íiÍ]", "i")
        const ExpRegConfirmarPagoNo = new RegExp("^N[oóÓ]", "i")

        //Registrar el inicio de la conversación
        try {

            //Evaluar si el usuario envió una nota de voz
            if(ctx.body.includes('event_voice_note')==true){

                //Informar al cliente que en el momento no se pueden procesar sus notas de voz
                await ctxFn.flowDynamic(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)
                
                //Hacer una pausa de 2 segundos
                await delay(1000)

                //Retorar la respuesta a opción incorrecta
                return ctxFn.fallBack(ctxFn.state.get('mensajePreguntaActual'))
                
            }
            else if(ExpRegConfirmarPago.test(ctx.body) == false){

                //Solicitar una respuesta valida
                return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + ctxFn.state.get('mensajePreguntaActual'))
                
            }
            else{

                //Si el cliente respundió no
                if(ExpRegConfirmarPagoNo.test(ctx.body) == true){

                    //Iniciar el temporizador de espera de respuesta del cliente
                    temporizador.detenerTemporizador(ctx)
                    temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAtencionAlCliente/flujoNoTengoRespuestaAtencionAlCliente', mensajes.MENSAJE_SIN_DATOS_NECESARIOS)

                    //Ir al flujo de despedida
                    ctxFn.gotoFlow(require('./flujoReportePagoDiferenteTitular.js'))

                }

                //Si el cliente respundió si
                if(ExpRegConfirmarPagoSi.test(ctx.body) == true){

                    //Guardar el movimiento en la base de datos
                    await movimiento.Guardar(ctxFn.state.get('idCliente'), medio, fecha, idCuenta, valor, referencia, conversacion, 'Cliente', ctx.from, '', cunico, recibo, ter, rrn, apro, comprobante, origen, false)

                    //Mostrar las opciones de nuevo
                    ctxFn.flowDynamic(mensajes.MENSAJE_COMPROBANTE_RECIBIDO)
                    
                    //Iniciar el temporizador de espera de respuesta del cliente
                    temporizador.detenerTemporizador(ctx)
                    temporizador.iniciarTemporizador(ctx, ctxFn, '../FlujosBotAtencionAlCliente/flujoNoTengoRespuestaAtencionAlCliente')
            
                    //Ir al flujo de despedida
                    ctxFn.gotoFlow(require('./flujoAlgoMasAtencionAlCliente.js'))

                }

            }
            
        } catch (error) {

            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación en el flujo flujoFalla, el sistema respondió: ' + error)

        }

    })
    
