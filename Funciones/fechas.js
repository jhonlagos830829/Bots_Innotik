//Funcion para leer el mensaje de caidas
function extraerFecha(texto) {

    //const ExpRegFecha = /(\d{1,2}) (\d{1,2}) *([a-z]*) *(\d{4}) *([0-9: .amp]+)/gmi;
    const ExpRegFecha = /(\d{1,4})[ \/]*(\d{1,2})[ \/]*(\d{1,4})[ -]*([0-9]{1,2}:[0-9]{1,2}[ .amp]*)/gmi;

    //Convertir el texto a minúsculas
    texto = texto.toLowerCase().trim()
    
    console.log('Aqui esta la FECHA ->' + texto);

    //Reemplazar los datos que no hacen parte de la fecha y los nombres de los meses por numeros
    texto = texto.replaceAll('Fecha y hora', '');
    texto = texto.replaceAll('Fecha', '');
    texto = texto.replaceAll('/', '');
    texto = texto.replaceAll(',', '');
    texto = texto.replaceAll('a las', '');
    texto = texto.replaceAll('alas', '');

    //console.log('Aqui esta ->' + texto);

    texto = texto.replaceAll(' de ', ' ');
    texto = texto.replaceAll(' a las ', ' ');
    texto = texto.replaceAll('enero', '01');
    texto = texto.replaceAll('febrero', '02');
    texto = texto.replaceAll('marzo', '03');
    texto = texto.replaceAll('abril', '04');
    texto = texto.replaceAll('mayo', '05');
    texto = texto.replaceAll('junio', '06');
    texto = texto.replaceAll('julio', '07');
    texto = texto.replaceAll('agosto', '08');
    texto = texto.replaceAll('septiembre', '09');
    texto = texto.replaceAll('octubre', '10');
    texto = texto.replaceAll('noviembre', '11');
    texto = texto.replaceAll('diciembre', '12');

    texto = texto.replaceAll('ene', '01');
    texto = texto.replaceAll('feb', '02');
    texto = texto.replaceAll('mar', '03');
    texto = texto.replaceAll('bbr', '04');
    texto = texto.replaceAll('may', '05');
    texto = texto.replaceAll('jun', '06');
    texto = texto.replaceAll('jul', '07');
    texto = texto.replaceAll('ago', '08');
    texto = texto.replaceAll('sep', '09');
    texto = texto.replaceAll('oct', '10');
    texto = texto.replaceAll('nov', '11');
    texto = texto.replaceAll('dic', '12');

    console.log('Aqui tamos ->' + texto);

    //Obtener los datos de la fecha a partir de la expresión regular
    var datosFecha = texto.matchAll(ExpRegFecha);
    var fecha = '';
    var dia = '';
    var mes = '';
    var año = '';
    var tiempo = '';

    //Recorrer las coincidencias de la fecha
    for (const dato of datosFecha) {
        
        //Si el año está en la primera posición
        if(dato[1].toString().length > 2){

            //Obtener en cada variable cada dato de la fecha
            año = dato[1];
            mes = dato[2];
            dia = dato[3];
            tiempo = dato[4];

        }
        else{

            //Obtener en cada variable cada dato de la fecha
            año = dato[3];
            mes = dato[2];
            dia = dato[1];
            tiempo = dato[4];

        }

        // console.log('El año -> ' + año);
        // console.log('El mes -> ' + mes);
        // console.log('El dia -> ' + dia);
        // console.log('El tiempo -> ' + tiempo);

    }

    //console.log('El tiempo -> ' + tiempo);

    //Extraer los datos de la hora a partir de la expresion regular
    var horas = Number(tiempo.match(/^(\d+)/)[1]);
    var minutos = Number(tiempo.match(/:(\d+)/)[1]);
    //var AMPM = tiempo.match(/\s(.*)$/)[1];
    const ExpRegAmPm = new RegExp("[amp. ]+", "i")

    //Si el tiempo está en formato de 12 horas
    if(ExpRegAmPm.test(tiempo) == true){

            
        var AMPM = tiempo.match(/[amp. ]+/)[0];

        //Remover los espacios en la variable
        AMPM = AMPM.replace(' ', '');

        //Si la hora contiene PM
        if((AMPM == "p. m." || AMPM == "p.m.") && horas<12){
            
            //Sumarle 12 a las horas
            horas = horas+12;

        }

        //Si la hora contiene AM
        if((AMPM == "a. m." || AMPM == "a.m.") && horas==12) {
            
            //Si son las 12 de la noche restarle 12 horas
            horas = horas-12;

        }


    }
    
    //Convertir en cadena las horas y los minutos
    var sHoras = horas.toString();
    var sMinutos = minutos.toString();

    //Si la hora o los minutos son de un solo digito, agregar el cero
    if(horas<10) sHoras = "0" + sHoras;
    if(minutos<10) sMinutos = "0" + sMinutos;

    //Concatenar la fecha completa
    fecha = año + '-' + mes + '-' + dia + ' ' + sHoras + ':' + sMinutos;

    console.log('La fecha completa sería: ' + fecha);

    //Retornar si lo incluye
    return fecha;
}

module.exports.extraerFecha = extraerFecha;