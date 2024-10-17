const fechas = require('../Funciones/fechas')
const registrarConversacion = require('../Funciones/registrarConversacion')


function registrarPago(codigoCuenta, textoMensaje) {

    //Declaracion de variables
    const fs = require('fs');
    fechaBruta = new Date()
    const nombreArchivoPagos = 'Pagos_' + fechaBruta.getFullYear() + '-' + (fechaBruta.getMonth() + 1) + '-' + fechaBruta.getDate() + '.txt';
    const nombreArchivoLogPagos = 'LogPagos_' + fechaBruta.getFullYear() + '-' + (fechaBruta.getMonth() + 1) + '-' + fechaBruta.getDate() + '.txt';
    const ExpRegSalidas = /((Retiro |Impuesto |Env[íi]+o |Sacaste )(en[ \/]*Cajero|del gobierno|Realizad[oa]+|a banco|en Corresponsal Bancolombia))|(Para)+[\/ ]+[a-z ]+|(Pago en)[\/]+[a-z0-9 .]+|(Conversación)[\/]+[a-záéíóú\ñ .,-]+|(Nombre)[a-z ]+|(\¿Cuánto)[a-z \?]+[\/ ]*[\$ 0-9.,]+|(Valor)[ \/]*[\$ 0-9.,]+|(Número)[a-z \/]*[0-9 ]+|(Fecha)( y hora)*[\/ ]+[0-9 ,a-z:.]+|(Referencia)+[ \/MS0-9]+/gmi;
    const ExpRegIngresos = /((Movimiento |Recarga )(Realizad[oa]))|((Env[íi]o )(Recibido)[\/ ]*(de)+[\/ ]*[a-z ]+)|(Recarga en)[\/]+[a-z]+|(Conversación)[\/]+[a-záéíóú0-9\ñ .,-\/]+|(Recarga )[desen]+[ a-z]+|(Intereses)|(\¿Dónde\?)[\/]+[a-z ]+|(\¿Cuánto\?)+[\/ ]+[\$ 0-9.,]+|(Fecha)[\/ ]+[0-9 a-z:.]+|(Referencia)[\/]+[ a-z0-9]+/gmi;
    const ExpRegFecha = /(\d{1,2})\-(\d{1,2})\-(\d{4}) ([0-9: .amp]+)/gmi;
    const ExpRegHora = /(\d{1,2})\:(\d{1,2}) ([0-9: .amp]+)/gmi;
    var contenido = '';
    var conceptoMovimiento = '';
    var tipoMovimiento = '';
    var origenMovimiento = '';
    var destinoMovimiento = '';
    var notaMovimiento = '';
    var valorMovimiento = '';
    var referenciaMovimiento = '';
    var Log = '';
    
    //Reportar en la consola el proceso
    //console.log('Procesando movimiento para la cuenta... ' + nombreBanco + ' ' + codigoCuenta);
    //Log = Log + 'Procesando movimiento para la cuenta... ' + nombreBanco + ' ' + codigoCuenta + '\n';

    try {

        //Si el texto del mensaje contiene identificadores de salidas de dinero
        if(textoMensaje.includes("Sacaste en") || textoMensaje.includes("Envío a banco") || textoMensaje.includes("Envio a banco") || textoMensaje.includes("Envío Realizado") || textoMensaje.includes("Envio Realizado") || textoMensaje.includes("Pago Realizado") || textoMensaje.includes("Pago en") || textoMensaje.includes("Impuesto") || textoMensaje.includes("Retiro")){
            
            //Reportar en la consola que se esta registrando una salida de dinero
            console.log('Registrando una salida...');
            Log = Log + 'Registrando una salida...\n';

            //Reemplazar los saltos de linea por /// para usarlos como delimitadores de campos y facilitar el procesamiento de los datos
            textoMensaje = textoMensaje.replace(/(\r\n|\n|\r)/gm, '///');

            //console.log('Asi va...\n\n')
            console.log(textoMensaje)
            
            //Aregar la palabra salida y un salto de linea para identificarlo en el archivo de transacciones
            textoMensaje = "Salida" + '\r\n' + textoMensaje;
            
            //Configurar el tipo de movimiento
            tipoMovimiento = 'Gasto';

            //Configurar el concepto del movimiento
            conceptoMovimiento = '14';

            //Obtener los datos de la transasccion a partir de la expresion regular
            const coincidencias = textoMensaje.matchAll(ExpRegSalidas);
            
            //Recorrer las coincidencias de la transaccion
            for (const coincidencia of coincidencias) {

                //Obtener el contenido de la coincidencia
                contenido = coincidencia[0]

                //console.log(contenido);

                //Si el contenido contiene la frase 'Envio Recibido'
                if(contenido.includes('Envio Recibido')){

                    contenido = contenido.replaceAll('Envio Recibido', '');
                    contenido = contenido.replaceAll('/', '');
                    //console.log(contenido);

                }
                else if(contenido.includes('¿Dónde?') || contenido.includes('Sacaste en') || contenido.includes('Retiro en Cajero')){

                    contenido = contenido.replaceAll('///', ' ');
                    origenMovimiento = origenMovimiento + contenido;
                    console.log('Origen ' + origenMovimiento);
                    Log = Log + 'Origen ' + origenMovimiento + '\n';
                    
                    
                }
                else if(contenido.includes('Retiro en///Cajero') || contenido.includes('Retiro en Cajero') || contenido.includes('Impuesto del gobierno') || contenido.includes('Para///') || contenido.includes('Para ') || contenido.includes('Pago')){

                    contenido = contenido.replaceAll('///', ' ');
                    destinoMovimiento = destinoMovimiento + contenido;
                    console.log('Destino ' + destinoMovimiento);
                    Log = Log + 'Destino ' + destinoMovimiento + '\n';
                    
                    
                }
                else if(contenido.includes('Nombre') || contenido.includes('Conversación///') || contenido.includes('Número Nequi')){

                    contenido = contenido.replaceAll('Conversación///', '');
                    contenido = contenido.replaceAll('///', ' ');
                    notaMovimiento = notaMovimiento + contenido;
                    console.log('Nota ' + notaMovimiento);
                    Log = Log + 'Nota ' + notaMovimiento + '\n';
                    
                }
                else if(contenido.includes('Valor') || contenido.includes('¿Cuánto')){

                    contenido = contenido.replaceAll('¿Cuánto pagaste?', '');
                    contenido = contenido.replaceAll('¿Cuánto?', '');
                    contenido = contenido.replaceAll('Valor', '');
                    contenido = contenido.replaceAll('/', '');
                    contenido = contenido.replaceAll('$', '');
                    contenido = contenido.replaceAll(' ', '');
                    contenido = contenido.replaceAll('.', '');
                    valorMovimiento = '-' + contenido;
                    //valorTotalGastosRegistrados = valorTotalGastosRegistrados + Number(valorMovimiento.replace(',', '.'));
                    console.log('Valor ' + valorMovimiento);
                    Log = Log + 'Valor ' + valorMovimiento + '\n';
                    
                }
                else if(contenido.includes('Fecha')){
                    
                    //Obtener a fecha
                    var fecha = fechas.extraerFecha(contenido);
                    console.log('Fecha ' + fecha);
                    Log = Log + 'Fecha ' + fecha + '\n';
                    
                }
                else if(contenido.includes('Referencia')){

                    contenido = contenido.replaceAll('Referencia', '');
                    contenido = contenido.replaceAll('/', '');
                    contenido = contenido.replaceAll(' ', '');
                    referenciaMovimiento = contenido;
                    console.log('Referencia ' + referenciaMovimiento);
                    Log = Log + 'Referencia ' + referenciaMovimiento + '\n';

                }
            
            }
        
        }
        else{

            //Reportar en la consola que se esta registrando un ingreso de dinero
            console.log('Registrando un ingreso...');
            Log = Log + 'Registrando un ingreso...\n';
            
            //Reemplazar los saltos de linea por /// para usarlos como delimitadores de campos y facilitar el procesamiento de los datos
            textoMensaje = textoMensaje.replace(/(\r\n|\n|\r)/gm, '///');

            //console.log(textoMensaje)
            
            //Aregar la palabra ingreso y un salto de linea para identificarlo en el archivo de transacciones
            textoMensaje = "Ingreso" + '\r\n' + textoMensaje;
            
            //Configurar el tipo de movimiento
            tipoMovimiento = 'Ingreso';

            //Configurar el concepto del movimiento
            conceptoMovimiento = '1';

            //Obtener los datos de la transasccion a partir de la expresion regular
            const coincidencias = textoMensaje.matchAll(ExpRegIngresos);

            //Recorrer las coincidencias de la transaccion
            for (const coincidencia of coincidencias) {

                //Obtener el contenido de la coincidencia
                contenido = coincidencia[0]

                //console.log(contenido);

                //Si el contenido contiene la frase 'Envio Recibido'
                if(contenido.includes('¿Dónde?') || contenido.includes('Recarga en') || contenido.includes('Recarga desde') || contenido.includes('Recarga Desde') || contenido.includes('Envío Recibido') || contenido.includes('Envío recibido') || contenido.includes('Envio Recibido') || contenido.includes('Intereses')){

                    contenido = contenido.replaceAll('Envío Recibido///', '');
                    contenido = contenido.replaceAll('Envio Recibido///', '');
                    contenido = contenido.replaceAll('¿Dónde?', ' ');
                    contenido = contenido.replaceAll('///', ' ');
                    origenMovimiento = contenido;
                    console.log('Origen ' + origenMovimiento);
                    Log = Log + 'Origen ' + origenMovimiento + '\n';

                }
                else if(contenido.includes('Conversación///')){

                    contenido = contenido.replaceAll('Conversación///', '');
                    contenido = contenido.replaceAll('///', '');
                    notaMovimiento = contenido;
                    console.log('Nota ' + notaMovimiento);
                    Log = Log + 'Nota ' + notaMovimiento + '\n';
                    
                }
                else if(contenido.includes('¿Cuánto?')){

                    contenido = contenido.replaceAll('¿Cuánto?', '');
                    contenido = contenido.replaceAll('/', '');
                    contenido = contenido.replaceAll('$', '');
                    contenido = contenido.replaceAll(' ', '');
                    contenido = contenido.replaceAll('.', '');
                    valorMovimiento = contenido;
                    console.log('Valor ' + valorMovimiento);
                    Log = Log + 'Valor ' + valorMovimiento + '\n';
                    
                }
                else if(contenido.includes('Fecha')){
                    
                    //console.log('La fechota ' + contenido);

                    //Obtener a fecha
                    var fecha = fechas.extraerFecha(contenido);
                    console.log('Fecha ' + fecha);
                    Log = Log + 'Fecha ' + fecha + '\n';

                }
                else if(contenido.includes('Referencia')){

                    contenido = contenido.replaceAll('Referencia', '');
                    contenido = contenido.replaceAll('/', '');
                    contenido = contenido.replaceAll(' ', '');
                    referenciaMovimiento = contenido;
                    console.log('Referencia ' + referenciaMovimiento);
                    Log = Log + 'Referencia ' + referenciaMovimiento + '\n';

                }
            
            }

        }
        
        //Guardar el pago en el archivo
        fs.appendFileSync('Archivos/Pagos/' + nombreArchivoPagos, textoMensaje + '\r\n\r\n');

        console.log(codigoCuenta)
        console.log(conceptoMovimiento)
        console.log(fecha)
        console.log(tipoMovimiento)
        console.log(origenMovimiento)
        console.log(destinoMovimiento)
        console.log(notaMovimiento)
        console.log(valorMovimiento)
        console.log(referenciaMovimiento)

        //Guardar el movimiento en la base de datos
        registrarConversacion.registrarMovimientoCuenta(codigoCuenta, conceptoMovimiento, fecha, tipoMovimiento, origenMovimiento, destinoMovimiento, notaMovimiento, valorMovimiento, referenciaMovimiento);

        //Incrementar la cantidad de transacciones en 1
        //totalTransaccionesRegistradas = totalTransaccionesRegistradas + 1;

        //Reportar el procceso en la consola
        console.log('\n\nMovimiento registrado correctamente...\n\n');
        Log = Log + '\n\nMovimiento registrado correctamente...\n\n';

        //Reportar el procceso en la consola
        //console.log(totalTransaccionesRegistradas + ' transacciones registradas...\n');
        //Log = Log + totalTransaccionesRegistradas + ' transacciones registradas...\n';

        //Obtener el resumen de las transacciones realizadas
        //resumenMovimientosRegistrados = totalTransaccionesRegistradas + ' transacciones registradas...\n'

        //Reportar el procceso en la consola
        //console.log('Total gastos ' + valorTotalGastosRegistrados + '\n');
        //Log = Log + 'Total gastos ' + valorTotalGastosRegistrados + '\n';

        //Obtener el resumen de las transacciones realizadas
        //resumenMovimientosRegistrados = resumenMovimientosRegistrados + 'Total gastos ' + valorTotalGastosRegistrados + '\n';

        //Reportar el procceso en la consola
        //console.log('Total ingresos ' + valorTotalIngresosRegistrados + '\n\n');
        //Log = Log + 'Total ingresos ' + valorTotalIngresosRegistrados + '\n\n';

        //Obtener el resumen de las transacciones realizadas
        //resumenMovimientosRegistrados = resumenMovimientosRegistrados + 'Total ingresos ' + valorTotalIngresosRegistrados;

        //Guardar el log en el archivo
        fs.appendFileSync('Archivos/Pagos/' + nombreArchivoLogPagos, Log);

    } catch (err) {

        //Mostrar el mensaje de error
        console.error(err);

    }

    //Retornar el contenido valor del movimiento
    return valorMovimiento;
}


module.exports.registrarPago = registrarPago;