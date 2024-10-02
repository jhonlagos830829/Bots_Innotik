//Declaracion de variables
const fs = require('fs');
const cuenta = require('./cuenta')
const cliente = require('./cliente')

let contenidoArchivo = null;

const CrearCuenta = async function(banco, tipo, numero, titular, identificacion) {
    
    const result = await cuenta.Guardar(banco, tipo, numero, titular, identificacion)
    
    console.log(result);

}

const CrearCliente = async function(identificacion, nombre, numeroWhatsapp, numeroTelefonico, direccion, email) {
    
    const result = await cliente.Guardar(identificacion, nombre, numeroWhatsapp, numeroTelefonico, direccion, email)
    
    console.log(result);

}

try {

    //Leer el contenido del archivo
    const datos = fs.readFileSync('Archivos/cuentasInnotik.csv', 'utf8').split(/\r?\n/);
    let campos

    //console.log(data);
    contenidoArchivo = datos;

    for (const linea of contenidoArchivo){

        campos = linea.split(';')

        // console.log('La linea ' + linea)
        
        // console.log('Nombre ' + campos[0])
        // console.log('Whatsapp ' + campos[1])
        // console.log('Teléfono ' + campos[2])
        // console.log('Direccion ' + campos[3])
        // console.log('Correo ' + campos[4])

        //CrearCuenta(campos[1], campos[2], campos[3], campos[4], campos[5])
        
        CrearCliente('', campos[0], campos[1], campos[2], campos[3], campos[4].toLowerCase())

    }

} catch (err) {

    //Mostrar el mensaje de error
    console.error(err);

}
