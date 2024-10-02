//Funcion para leer el mensaje de caidas
function consultarCaidaMasiva() {

    //Declaracion de variables
    const fs = require('fs');
    let contenidoArchivo = null;

    try {

        //Leer el contenido del archivo
        const data = fs.readFileSync('Caida_Masiva/Mensaje.txt', 'utf8');
        //console.log(data);
        contenidoArchivo = data;

    } catch (err) {

        //Mostrar el mensaje de error
        console.error(err);

    }

    //Retornar el contenido del archivo
    return contenidoArchivo;
}

module.exports.consultarCaidaMasiva = consultarCaidaMasiva;