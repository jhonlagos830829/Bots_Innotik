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
const escanearComprobante = require('../Funciones/comprobante')
const movimiento = require('../Funciones/movimiento')

var codigoCuenta = ''

module.exports = flujoGuardarPago = addKeyword(['Ok', 'Si', 'Sí'])
.addAnswer('A continuación encontrará las cuentas disponibles para el registro de movimientos', null, async (ctx, { fallBack, flowDynamic, gotoFlow }) => {
    
    //Obtener las cuentas para el registro de los movimientos
    const cuentas = await axios('http://innotik.com.co/proyectos/Innotik/Pagos/clases/listarCuenta.php')
    
    //console.log(cuentas.data)

    //Declaración de la variable del mensaje de las cuentas
    var mensajeCuentas = ''

    //Recorrer la lista de cuentas
    for (const cuenta of cuentas.data){

        //Crear a lista de cuentas
        mensajeCuentas = mensajeCuentas + cuenta.codigo + ' ' + cuenta.banco + ' ' + cuenta.titular + '\n\n'

    }

    //Enviar mensaje con la lista de cuentas
    flowDynamic(mensajeCuentas)

})
.addAnswer('Por favor seleccione la cuenta a la cual pertenecen los movimientos que desea registrar', {capture:true}, async (ctx, { fallBack, flowDynamic, gotoFlow }) => {
    codigoCuenta = ctx.body
})
.addAnswer(['Envíe uno por uno los pantallazos de los movimientos, tenga en cuenta que *no debe enviar el siguiente movimiento antes de recibir la notificación de movimiento guardado*'], {capture:true}, async (ctx, {fallBack, gotoFlow, flowDynamic, state}) => {
    
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

        // //Mostrar en consola el proceso
        // console.log('Escaneando comrpobante')

        // //Crear la instancia que se encargará de extraer el texto de la imagen
        // const worker = await createWorker("spa", 1, {
        //     //logger: m => console.log(m),
        // })

        // //Extraer el texto de la imagen
        // const { data: { text } } = await worker.recognize(nombreDirectorioComprobantes + "/" + nombreComprobante + ".jpg")

        // //Mostrar en la consola el texto obtenido 
        // console.log(text)

        
        let contenido = await escanearComprobante.escanearConTesseract(nombreDirectorioComprobantes + "/" + nombreComprobante + ".jpg")

        console.log(contenido)
        
        
        let datosComprobante = await escanearComprobante.extraerDatosNequi(contenido)

        console.log(JSON.stringify(datosComprobante))

        //Si no se obtuvo alguno de los datos obligatorios
        if(datosComprobante.fecha == '' || datosComprobante.fecha == undefined || datosComprobante.fecha == 'Invalid Date' || datosComprobante.cuenta != '' || datosComprobante.cuenta == undefined || datosComprobante.valor == '' || datosComprobante.valor == undefined){

            
            let datosMovimiento = await movimiento.obtenerMovimiento(datosComprobante.fecha, codigoCuenta, datosComprobante.valor, datosComprobante.referencia)

            console.log('Movimiento encontrado -> ' + JSON.stringify(datosMovimiento))


        }

        //Obtener el mensaje
        textoMensaje = text

        //Guardar el movimiento enviado
        var valorMovimiento = parseFloat(await registrarPago.registrarPago(codigoCuenta, textoMensaje))

        //Incrementar la cantidad de movimientos registrados
        totalMovimientosRegistrados = totalMovimientosRegistrados + 1

        //Si el valor del movimiento es positivo
        if(valorMovimiento > 0){

            //Obtener el valor total de los ingresos registrados
            valorTotalIngresosRegistrados = valorTotalIngresosRegistrados + valorMovimiento

        }
        else{

            //Obtener el valor total de los gastos registrados
            valorTotalGastosRegistrados = valorTotalGastosRegistrados + valorMovimiento

        }

        //Reportar el procceso en la consola
        console.log(totalMovimientosRegistrados + ' movimientos registrados...\n');
        //Log = Log + totalMovimientosRegistrados + ' movimientos registrados...\n';

        //Obtener el resumen de las movimientos realizadas
        //resumenMovimientosRegistrados = totalMovimientosRegistrados + ' movimientos registrados...\n'

        //Reportar el procceso en la consola
        console.log('Total gastos ' + valorTotalGastosRegistrados + '\n');
        //Log = Log + 'Total gastos ' + valorTotalGastosRegistrados + '\n';

        //Obtener el resumen de las movimientos realizadas
        //resumenMovimientosRegistrados = resumenMovimientosRegistrados + 'Total gastos ' + valorTotalGastosRegistrados + '\n';

        //Reportar el procceso en la consola
        console.log('Total ingresos ' + valorTotalIngresosRegistrados + '\n\n');
        //Log = Log + 'Total ingresos ' + valorTotalIngresosRegistrados + '\n\n';

        //Obtener el resumen de las movimientos realizadas
        //resumenMovimientosRegistrados = resumenMovimientosRegistrados + 'Total ingresos ' + valorTotalIngresosRegistrados;

        //Informar el pago guadado
        return fallBack('Movimiento guardado, envíeme el siguiente...')

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
