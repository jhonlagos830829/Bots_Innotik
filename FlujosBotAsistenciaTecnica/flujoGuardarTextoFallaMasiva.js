
//Funcion para guardar el mensaje de caidas
function guardarCaidaMasiva() {

    //Declaracion de variables
    const fs = require('fs');

    try {

        //console.log(textoMensaje);
        if(textoMensaje == 'Nulo'){
            
            //Guardar el contenido del archivo
            fs.writeFileSync('Caida_Masiva/Mensaje.txt', '');
        
        }
        else{

            //Guardar el contenido del archivo
            fs.writeFileSync('Caida_Masiva/Mensaje.txt', textoMensaje);
        
        }
        
        //contenidoArchivo = data;

    } catch (err) {

        //Mostrar el mensaje de error
        console.error(err);

    }

    //Retornar el contenido del archivo
    //return contenidoArchivo;
}

const {addKeyword} = require('@bot-whatsapp/bot')

module.exports = flujoGuardarTextoFallaMasiva = addKeyword([null])
    .addAnswer('Guardando el texto...', null, 
    async (ctx, { flowDynamic }) => {
        const caidas = await guardarCaidaMasiva()
        //return await flowDynamic([{body: 'El resultado fue -> ' + caidas}])
    }).addAnswer('Texto guardado... 👍')
