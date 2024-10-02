
//Funcion para leer el mensaje de caidas
function revisarRespuesta(respuestasValidas, respuesta) {
    
    //Declaracion de variable
    let incluye = false;
    
    //Recorrer la lista de respuestas válidas
    for (let i = 0; i < respuestasValidas.length ; i++) { 
        
        //Si la respuesta está dentro de las respuestas válidas        
        if(respuesta.includes(respuestasValidas[i])==true){
            incluye = true;
            break;
        }

    }

    //Retornar si lo incluye
    return incluye;
}

//Funcion para leer el mensaje de caidas
function revisarRespuestaRegex(Cadena, ExpresionRegular) {

    //console.log('Evaluando la cadena...' + Cadena)

    //Declaracion de variables
    const ExpRegRespuesta = new RegExp(ExpresionRegular, 'i')
    resultado = ExpRegRespuesta.test(Cadena)

    //console.log(resultado)

    //Retornar el contenido del archivo
    return resultado;
}

module.exports.revisarRespuesta = revisarRespuesta;
module.exports.revisarRespuestaRegex = revisarRespuestaRegex;