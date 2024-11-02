const axios = require('axios').default;
const fechas = require('../Funciones/fechas')
const registrarConversacion = require('../Funciones/registrarConversacion')
const registrarPago = require('../Funciones/registrarPago')


//Declaración de variables
var resumenMovimientosRegistrados = '';
var totalMovimientosRegistrados = 0;
var valorTotalGastosRegistrados = 0;
var valorTotalIngresosRegistrados = 0;

const {addKeyword} = require('@bot-whatsapp/bot')
const { downloadMediaMessage } = require("@whiskeysockets/baileys")
const { writeFile } = require("node:fs/promises")
const path = require('path')
const { createWorker } = require('tesseract.js')
const fs = require('fs')
const mensajes = require('../Configuracion/botAtencionAlCliente/mensajes.js')
const escanearComprobante = require('../Funciones/comprobante')
const movimiento = require('../Funciones/movimiento')
const crm = require('../Funciones/crm.js')
const cuenta = require('../Funciones/cuenta.js')

var codigoCuenta = ''

module.exports = flujoGuardarPago = addKeyword(['Ok', 'Si', 'Sí'])
.addAnswer('A continuación encontrará las cuentas disponibles para el registro de movimientos', null, async (ctx, { fallBack, flowDynamic, gotoFlow }) => {
    
    //Obtener las cuentas para el registro de los movimientos
    //const cuentas = await axios('http://innotik.com.co/proyectos/Innotik/Pagos/clases/listarCuenta.php')
    const cuentas = await cuenta.ListarCuentas()
    
    //console.log(JSON.stringify(cuentas.data))

    //Declaración de la variable del mensaje de las cuentas
    var mensajeCuentas = ''

    //Recorrer la lista de cuentas
    for (const cuenta of cuentas.data){
        //console.log(JSON.stringify(cuenta))
        //Crear a lista de cuentas
        mensajeCuentas = mensajeCuentas + cuenta.id + ' ' + cuenta.attributes.banco + ' ' + cuenta.attributes.titular + '\n\n'

    }

    //Enviar mensaje con la lista de cuentas
    flowDynamic(mensajeCuentas)

})
.addAnswer('Por favor seleccione la cuenta a la cual pertenecen los movimientos que desea registrar', {capture:true}, async (ctx, { fallBack, flowDynamic, gotoFlow }) => {
    codigoCuenta = ctx.body
})
.addAnswer(['Envíe uno por uno los pantallazos de los movimientos, tenga en cuenta que *no debe enviar el siguiente movimiento antes de recibir la notificación de movimiento guardado*'], {capture:true}, async (ctx, ctxFn) => {
    
    //console.log(ctx.body)

    //Si el mensaje enviado por el cliente es una imagen
    if(ctx.body.includes('_event_media_')){

        //Obtener la fecha del sistema
        fechaBruta = new Date()

        //Elaborar el nombde del directorio donde se guardarán las imagenes
        const nombreDirectorioComprobantes = 'Archivos/Pagos/' + fechaBruta.getFullYear() + '-' + (fechaBruta.getMonth() + 1) + '-' + fechaBruta.getDate()

        //Si el directorio no existe
        if (!fs.existsSync(nombreDirectorioComprobantes)){

            //Crear el directorio
            fs.mkdirSync(nombreDirectorioComprobantes, { recursive: true });

        }

        //Elaborar el nombre  con el cual se guardará el comprobante
        const nombreComprobante = 'Comprobante_' + Date.now()
        const buffer = await downloadMediaMessage(ctx, "buffer")
        await writeFile(nombreDirectorioComprobantes + "/" + nombreComprobante + ".jpg", buffer)

        //Mostrar en consola el proceso
        console.log('Escaneando comrpobante')

        // ////////////////////////// METODOLOGÍA ATERIOR //////////////////////////

        // //Crear la instancia que se encargará de extraer el texto de la imagen
        // const worker = await createWorker("spa", 1, {
        //     //logger: m => console.log(m),
        // })

        // //Extraer el texto de la imagen
        // const { data: { text } } = await worker.recognize(nombreDirectorioComprobantes + "/" + nombreComprobante + ".jpg")

        // //Mostrar en la consola el texto obtenido 
        // console.log(text)

        // ////////////////////////////////////////////////////////////////////////

        ////////////////////////// METODOLOGÍA NUEVA //////////////////////////
        
        //Obtener el contenido del comprobante
        //let contenido = await escanearComprobante.escanearConTesseract(nombreDirectorioComprobantes + "/" + nombreComprobante + ".jpg")
        let contenido = await escanearComprobante.escanearConGoogle(nombreDirectorioComprobantes + "/" + nombreComprobante + ".jpg")

        //Inicializar la variable de egreso como falsa
        let unEgreso = false

        //Expresión regular para evaluar si el comprobante es una salida de dinero
        const ExpRegEnvio = new RegExp("Env[íi]+o[ abncorelizd]{4,}[\n]+Para[\n]+[a-z ]{2,}|[Pago cnQARelizd]{4,}[\n]+[Pago en]{4,}[\n]+[a-z 0-9]{4,}|[Movient ]{4,}[Impuesto dlgobrn]{12,}|Retiro[en ]{2,}[\n]+[cajero]{4,}", "i")

        //Si el comprobante es un envío
        if (ExpRegEnvio.test(contenido) == true){

            //Marcarlo como un egreso
            unEgreso = true 

        }

        //Extraer los datos del text del comprobante
        let datosComprobante = await escanearComprobante.extraerDatosNequi(contenido)

        console.log('DATOS EXTRAIDOS DEL COMPROBANTE ' + JSON.stringify(datosComprobante))
        
        //Si no se obtuvo alguno de los datos obligatorios
        if(datosComprobante.fecha != '' && datosComprobante.fecha != undefined && datosComprobante.fecha != 'Invalid Date' && /*datosComprobante.cuenta != '' && datosComprobante.cuenta != undefined && */datosComprobante.valor != '' && datosComprobante.valor != undefined){
            
            //Variable donde se guardarán los datos del movimiento
            var datosMovimiento

            //Si va a bucar en la base de datos
            if(datosComprobante.tipodocumento == 'INGRESO_POR_CORRESPONSAL' || datosComprobante.tipodocumento.includes('RECARGA_DESDE') || datosComprobante.tipodocumento == 'INGRESO_DESDE_OTROS_BANCOS'){
                
                //Buscar el movimiento en la base de datos
                //let datosMovimiento = await movimiento.ObtenerMovimiento(datosComprobante.medio, datosComprobante.fecha.toISOString(), codigoCuenta, datosComprobante.valor, datosComprobante.referencia, datosComprobante.conversacion, datosComprobante.reporta, datosComprobante.numeroReporta, datosComprobante.descripcion, false, datosComprobante.ter, datosComprobante.rrn, datosComprobante.apro, datosComprobante.cUnico, datosComprobante.recibo, datosComprobante.comprobante, '', datosComprobante.idCliente, datosComprobante.idCaja, datosComprobante.tipo, datosComprobante.archivo, datosComprobante.idConcepto)
                datosMovimiento = await movimiento.ObtenerMovimiento('', datosComprobante.fecha.toISOString(), codigoCuenta, datosComprobante.valor, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '')
            
            }
            else{

                //Buscar el movimiento en la base de datos
                datosMovimiento = await movimiento.ObtenerMovimiento(datosComprobante.medio, datosComprobante.fecha.toISOString(), codigoCuenta, datosComprobante.valor, datosComprobante.referencia, datosComprobante.conversacion, datosComprobante.reporta, datosComprobante.numeroReporta, datosComprobante.descripcion, false, datosComprobante.ter, datosComprobante.rrn, datosComprobante.apro, datosComprobante.cUnico, datosComprobante.recibo, datosComprobante.comprobante, '', datosComprobante.idCliente, datosComprobante.idCaja, datosComprobante.tipo, datosComprobante.archivo, datosComprobante.idConcepto)
                //let datosMovimiento = await movimiento.ObtenerMovimiento(datosComprobante.fecha.toISOString(), codigoCuenta, datosComprobante.valor)
            
            }

            console.log('CONVENIDO DEL COMPROBANTE ' + JSON.stringify(datosMovimiento))

            //Si se encontró el movimiento
            if (Object.keys(datosMovimiento.data).length > 0){
                //console.log('LOS DATOS DEL COMPROBANTE ENCONTRADO SON ' + JSON.stringify(datosMovimiento))
                //Enviar el mensaje de resumen de las clientes
                await ctxFn.flowDynamic(mensajes.MOVIMIENTO_ENCONTRADO.replace('{MEDIO}', datosMovimiento.data[0].attributes.medio).replace('{FECHA}', datosComprobante.fecha.toLocaleString().replace(',', '')).replace('{VALOR}', parseInt(datosComprobante.valor).toLocaleString("es-CO", {style: "currency", currency: "COP", minimumFractionDigits: 0, maximumFractionDigits: 0,})).replace('{REFERENCIA}', datosComprobante.referencia).replace('{VALOR}', datosComprobante.valor).replace('{NOMBRE_CLIENTE}', datosMovimiento.data[0].attributes.cliente.data.attributes.nombre).replace('{CONVERSACION}', datosComprobante.conversacion))

                //Verificar el movimiento
                movimiento.VerificarMovimiento(datosMovimiento.data[0].id, datosMovimiento.data[0].attributes.medio, datosMovimiento.data[0].attributes.fecha, datosMovimiento.data[0].attributes.cuenta.data.id, datosMovimiento.data[0].attributes.valor, datosMovimiento.data[0].attributes.referencia, datosMovimiento.data[0].attributes.conversacion, datosMovimiento.data[0].attributes.reporta, datosMovimiento.data[0].attributes.numeroReporta, datosMovimiento.data[0].attributes.descripcion, true, datosMovimiento.data[0].attributes.ter, datosMovimiento.data[0].attributes.rrn, datosMovimiento.data[0].attributes.apro, datosMovimiento.data[0].attributes.cUnico, datosMovimiento.data[0].attributes.recibo, datosMovimiento.data[0].attributes.comprobante, datosComprobante.origen, datosMovimiento.data[0].attributes.cliente.data.id, datosMovimiento.data[0].attributes.caja.data?.id ?? null, datosMovimiento.data[0].attributes.tipo, datosMovimiento.data[0].attributes.archivo, datosMovimiento.data[0].attributes.concepto.data?.id ?? null)

                //INSTRUCCION REAL SE DEBE DESCOMENTAR
                let datosPago = await crm.RegistrarPago(parseInt(datosMovimiento.data[0].attributes.cliente.data.attributes.identificacion), "4145b5f5-3bbc-45e3-8fc5-9cda970c62fb", datosComprobante.fecha.toISOString().replace(/\.\d{3}Z$/, "+0000"), parseFloat(datosComprobante.valor), 'Referencia ' + datosComprobante.referencia + ' Conversacion: ' + datosComprobante.conversacion, parseInt('1'))

                // //FUNCIONANDO CORRECTAMENTE
                // let datosPago = await crm.RegistrarPago(parseInt("91278984"), "4145b5f5-3bbc-45e3-8fc5-9cda970c62fb", datosComprobante.fecha.toISOString().replace(/\.\d{3}Z$/, "+0000"), parseFloat(datosComprobante.valor), 'Referencia: ' + datosComprobante.referencia + ' Conversacion: ' + datosComprobante.conversacion, parseInt('1'))

                //Enviar el mensaje de resumen de las clientes
                await ctxFn.flowDynamic(mensajes.ENVIAR_RECIBO_PAGO)

                //Enviar por medio del CRM recibo de pago al cliente
                await crm.EnviarRecibo(datosPago.id)

                //Enviar el mensaje de resumen de las clientes
                await ctxFn.flowDynamic(mensajes.RECIBO_PAGO_ENVIADO.replace('{ID_RECIBO}', datosPago.id))

                // console.log('RECIBO ENVIADO')
                
                // //Enviar el mensaje de resumen de las clientes
                // await ctxFn.flowDynamic('Enviando confirmación al cliente')

                //Enviar mensaje de notificación de nueva cita creada
                await ctxFn.provider.sendText(datosMovimiento.data[0].attributes.numeroReporta + '@s.whatsapp.net', mensajes.PAGO_VERIFICADO.replace('{MEDIO}', datosMovimiento.data[0].attributes.medio).replace('{FECHA}', new Date(datosMovimiento.data[0].attributes.fecha).toLocaleString().replace(',', '')).replace('{CUENTA}', datosMovimiento.data[0].attributes.cuenta.data.attributes.numero).replace('{TITULAR}', datosMovimiento.data[0].attributes.cuenta.data.attributes.titular).replace('{VALOR}', parseInt(datosMovimiento.data[0].attributes.valor).toLocaleString("es-CO", {style: "currency", currency: "COP", minimumFractionDigits: 0, maximumFractionDigits: 0,})).replace('{CLIENTE}', datosMovimiento.data[0].attributes.cliente.data.attributes.nombre))

                
                //Enviar el mensaje de resumen de las clientes
                await ctxFn.flowDynamic(mensajes.CLIENTE_NOTIFICADO)

                
                // // //Enviar el mensaje de resumen de las clientes
                // // await ctxFn.flowDynamic(mensajes.MOVIMIENTO_ENCONTRADO.replace('{MEDIO}', datosMovimiento.data[0].attributes.medio).replace('{FECHA}', datosComprobante.fecha.toLocaleString()).replace('{VALOR}', datosComprobante.valor).replace('{REFERENCIA}', datosComprobante.referencia).replace('{VALOR}', datosComprobante.valor).replace('{NOMBRE_CLIENTE}', datosComprobante.cliente.nombre).replace('{CONVERSACION}', datosComprobante.conversacion))


            }
            else{

                console.log('PAGO PARA INGRESAR')
                
                //Enviar el mensaje de resumen de las clientes
                await ctxFn.flowDynamic(mensajes.PAGO_NO_ENCONTRADO)
                
                // //Obtener el mensaje
                // textoMensaje = text

                // //Guardar el movimiento enviado
                // var valorMovimiento = parseFloat(await registrarPago.registrarPago(codigoCuenta, textoMensaje))

                //Si el comprobante es un egreso
                if(unEgreso == true){

                    //Guardar el movimiento en la base de datos
                    await movimiento.Guardar(datosComprobante.medio, datosComprobante.fecha, parseInt(codigoCuenta), parseFloat(datosComprobante.valor) * -1, datosComprobante.referencia, datosComprobante.conversacion, 'Asistente', ctx.from, datosComprobante.descripcion, true, datosComprobante.ter, datosComprobante.rrn, datosComprobante.apro, datosComprobante.cunico, datosComprobante.recibo, datosComprobante.comprobante, datosComprobante.origen, '', '', 'Egreso', '', '')

                }
                else{

                    //Guardar el movimiento en la base de datos
                    await movimiento.Guardar(datosComprobante.medio, datosComprobante.fecha, parseInt(codigoCuenta), parseFloat(datosComprobante.valor), datosComprobante.referencia, datosComprobante.conversacion, 'Asistente', ctx.from, datosComprobante.descripcion, true, datosComprobante.ter, datosComprobante.rrn, datosComprobante.apro, datosComprobante.cunico, datosComprobante.recibo, datosComprobante.comprobante, datosComprobante.origen, '', '', 'Ingreso', '', '')

                }

            }


        }

        ////////////////////////////////////////////////////////////////////////

        // //Obtener el mensaje
        // textoMensaje = text

        // //Guardar el movimiento enviado
        // var valorMovimiento = parseFloat(await registrarPago.registrarPago(codigoCuenta, textoMensaje))

        // //Incrementar la cantidad de movimientos registrados
        // totalMovimientosRegistrados = totalMovimientosRegistrados + 1

        // //Si el valor del movimiento es positivo
        // if(valorMovimiento > 0){

        //     //Obtener el valor total de los ingresos registrados
        //     valorTotalIngresosRegistrados = valorTotalIngresosRegistrados + valorMovimiento

        // }
        // else{

        //     //Obtener el valor total de los gastos registrados
        //     valorTotalGastosRegistrados = valorTotalGastosRegistrados + valorMovimiento

        // }

        // //Reportar el procceso en la consola
        // console.log(totalMovimientosRegistrados + ' movimientos registrados...\n');
        // //Log = Log + totalMovimientosRegistrados + ' movimientos registrados...\n';

        // //Obtener el resumen de las movimientos realizadas
        // //resumenMovimientosRegistrados = totalMovimientosRegistrados + ' movimientos registrados...\n'

        // //Reportar el procceso en la consola
        // console.log('Total gastos ' + valorTotalGastosRegistrados + '\n');
        // //Log = Log + 'Total gastos ' + valorTotalGastosRegistrados + '\n';

        // //Obtener el resumen de las movimientos realizadas
        // //resumenMovimientosRegistrados = resumenMovimientosRegistrados + 'Total gastos ' + valorTotalGastosRegistrados + '\n';

        // //Reportar el procceso en la consola
        // console.log('Total ingresos ' + valorTotalIngresosRegistrados + '\n\n');
        // //Log = Log + 'Total ingresos ' + valorTotalIngresosRegistrados + '\n\n';

        // //Obtener el resumen de las movimientos realizadas
        // //resumenMovimientosRegistrados = resumenMovimientosRegistrados + 'Total ingresos ' + valorTotalIngresosRegistrados;

        //Informar el pago guadado
        return ctxFn.fallBack('Movimiento guardado, envíeme el siguiente...')

    }
    else if(ctx.body == 'Terminé'){

        //Reiniciar las variables
        resumenMovimientosRegistrados = totalMovimientosRegistrados + ' Movimiento(s) registrado(s)' + '\n\n' + 'Total gastos $ ' + valorTotalGastosRegistrados.toFixed(2) + '\n\n' + 'Total ingresos $ ' + valorTotalIngresosRegistrados.toFixed(2);
        totalMovimientosRegistrados = 0;
        valorTotalGastosRegistrados = 0;
        valorTotalIngresosRegistrados = 0;

        //Enviar mensaje de resumen
        flowDynamic([{body: resumenMovimientosRegistrados}])
    }
    else if(ctx.body != 'Terminé'){

        //Informar el movimiento guadado
        return fallBack('Recuerde que no debe enviar texto, únicamente se aceptan las *imágenes o capturas de los comprobantes de movimiento*.\n\nSi no desea enviar imagen o captura alguna, deberá escribir *Terminé*')
    }

}).addAnswer('Movimientos guardados... 👍')
