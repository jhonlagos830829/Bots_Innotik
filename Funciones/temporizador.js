const configuracion = require('../Configuracion/configuracion');

// Arreglo para almacenar los temporizadores
const timers = {};

// Variable global para el tiempo de espera
const globalIdle = configuracion.TIEMPO_ESPERA_RESPUESTA * 1000;

// Function to start the timer
function iniciarTemporizador(ctx, ctxFn, flujo, mensaje) {

    //let rutaFlujo = '../FlujosBotAsistenciaTecnica/' + flujo;

    // Si se terminó el temporizador
    timers[ctx.from] = setTimeout(() => {

        //Reportar en la consola
        console.log(`¡Tiempo agotado para el cliente ${ctx.from}!` + ' han pasado ' + (globalIdle/1000) + ' segundos')

        //Si tiene algún mensaje por enviar
        if(mensaje != undefined){

            //Enviar mensaje
            ctxFn.flowDynamic(mensaje)

        }

        //Ir al flujo especificado
        //return ctxFn.gotoFlow(flujo);
        return ctxFn.gotoFlow(require(flujo))
        
    }, globalIdle);

}

// Function para reiniciar el temporizador
function reiniciarTemporizador(ctx, ctxFn) {

    // Si hay algún temporizador ya corriendo, detenerlo
    detenerTemporizador(ctx);

    // Iniciar el temporizador
    iniciarTemporizador(ctx, ctxFn);

    //Mostrar mensaje
    console.log('Teproizador reiniciado')
}

// Function detener el temporizador
function detenerTemporizador(ctx) {

    // Si hay algun temporizador en ejecución, detenerlo
    if (timers[ctx.from]) {

        //Remover el temporizador de la lista
        clearTimeout(timers[ctx.from]);
        
    }

}

module.exports.iniciarTemporizador = iniciarTemporizador;
module.exports.reiniciarTemporizador = reiniciarTemporizador;
module.exports.detenerTemporizador = detenerTemporizador;