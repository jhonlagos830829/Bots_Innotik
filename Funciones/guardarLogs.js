//Funcion para guardar el mensaje de caidas
function guardarMensaje(textoMensaje) {

    //Declaracion de variables
    const fs = require('fs');

    try {

        //console.log(textoMensaje);
        if(textoMensaje == 'Nulo'){
            
            //Guardar el contenido del archivo
            fs.appendFileSync('Mensajes/Mensajes.txt', '');
        
        }
        else{

            //Guardar el contenido del archivo
            fs.appendFileSync('Mensajes/Mensajes.txt', textoMensaje);
        
        }
        
        //contenidoArchivo = data;

    } catch (err) {

        //Mostrar el mensaje de error
        console.error(err);

    }

    //Retornar el contenido del archivo
    //return contenidoArchivo;
}

module.exports.guardarMensaje = guardarMensaje;