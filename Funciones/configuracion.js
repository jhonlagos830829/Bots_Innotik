const { guardarCita } = require('./registrarConversacion');

//Funcion para leer el mensaje de caidas
function consultarNumerosPermitidos() {

    //Declaracion de variables
    const fs = require('fs');
    let contenidoArchivo = null;

    try {

        //Leer el contenido del archivo
        const data = fs.readFileSync('Configuracion/NumerosPermitidos.txt', 'utf8');
        //console.log(data);
        contenidoArchivo = data;

    } catch (err) {

        //Mostrar el mensaje de error
        console.error(err);

    }

    //Retornar el contenido del archivo
    return contenidoArchivo;
}

function LeerConfiguracion() {

    //Declaracion de variables
    const fs = require('fs');
    let contenidoArchivo = [];

    try {

        //Leer el contenido del archivo
        contenidoArchivo =  JSON.parse(fs.readFileSync('Configuracion/configuracion.json', 'utf8'));
        //console.log(contenidoArchivo);

    } catch (err) {

        //Mostrar el mensaje de error
        console.error(err);

    }

    //Retornar el contenido del archivo
    return contenidoArchivo;
}

function GuardarConfiguracion(config) {

    //Declaracion de variables
    const fs = require('fs');
    let contenidoArchivo = JSON.stringify(config);

    try {

        //Guardar el log en el archivo
        fs.writeFileSync ('Configuracion/configuracion.json', contenidoArchivo, 'utf8');

    } catch (err) {

        //Mostrar el mensaje de error
        console.error(err);

    }

    //Retornar el contenido del archivo
    return true;
}

function LeerListaNegra() {

    //Declaracion de variables
    const fs = require('fs');
    let contenidoArchivo = [];

    try {

        //Leer el contenido del archivo
        contenidoArchivo =  JSON.parse(fs.readFileSync('Configuracion/listanegra.json', 'utf8'));
        //console.log(contenidoArchivo);

    } catch (err) {

        //Mostrar el mensaje de error
        console.error(err);

    }

    //Retornar el contenido del archivo
    return contenidoArchivo;
}

function GuardarListaNegra(config) {

    //Declaracion de variables
    const fs = require('fs');
    let contenidoArchivo = JSON.stringify(config);

    try {

        //Guardar el log en el archivo
        fs.writeFileSync ('Configuracion/listanegra.json', contenidoArchivo, 'utf8');

    } catch (err) {

        //Mostrar el mensaje de error
        console.error(err);

    }

    //Retornar el contenido del archivo
    return true;
}

function OcuparCalendario() {

    //Declaracion de variables
    //const fs = require('fs');
    let contenidoArchivo = [];
    let nuevoContenidoArchivo = false;

    try {

        //Obtener la configuración actual
        contenidoArchivo = LeerConfiguracion()

        //Cambiar el estado del calendario
        contenidoArchivo[0].calendarioocupado = 'Si'

        //Guardar la configuración en el achivo
        GuardarConfiguracion(contenidoArchivo)

    } catch (err) {

        //Mostrar el mensaje de error
        console.error(err);

    }

    //Retornar el contenido del archivo
    return true;
}

function DesocuparCalendario() {

    //Declaracion de variables
    //const fs = require('fs');
    let contenidoArchivo = [];
    let nuevoContenidoArchivo = false;

    try {

        //Obtener la configuración actual
        contenidoArchivo = LeerConfiguracion()

        //Cambiar el estado de recepción de pedidos
        contenidoArchivo[0].calendarioocupado = 'No'

        //Guardar la configuración en el achivo
        GuardarConfiguracion(contenidoArchivo)

    } catch (err) {

        //Mostrar el mensaje de error
        console.error(err);

    }

    //Retornar el contenido del archivo
    return true;
}

module.exports.consultarNumerosPermitidos = consultarNumerosPermitidos;
module.exports.LeerConfiguracion = LeerConfiguracion;
module.exports.GuardarConfiguracion = GuardarConfiguracion;
module.exports.OcuparCalendario = OcuparCalendario;
module.exports.DesocuparCalendario = DesocuparCalendario;
module.exports.LeerListaNegra = LeerListaNegra;
module.exports.GuardarListaNegra = GuardarListaNegra;