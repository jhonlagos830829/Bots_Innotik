const {addKeyword, EVENTS} = require('@bot-whatsapp/bot')
const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const { writeFile } = require("node:fs/promises");

const path = require('path');
const { createWorker } = require('tesseract.js');

//////////////////////////////////////// FUNCIONES ELABORADAS

const validaciones = require('../Funciones/validaciones')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

const flujoTipoFalla = require('./flujoReportarFallaTipoFalla')

////////////////////////////////////////////////////////////////////////////////

/*const ExpRegFalla = '/(fa)+[ly]+[aoó]+|(problem)+|(sin )+[internscvo]+|[ck]+[aely]+[andoó]+|(no ten)+[goemsíia ]+[internscvo]+|(sirv)+[eindo]+|(dañ)+[andoó]+|(urge)+[ntecia]+|(no c)+[ontamsuen]+( con )+[sc]+[ervcsio]+|(dema)+[scioad ]+[ lentoiud]+|(mu)+[ychoa]+[ lentoiud]+|[eé]+(st)+[aá]+[ lentoiud]+/gmi'
const respuestasValidas = ['Sí', 'Si', 'No']*/

module.exports = flujoGuardarImagen = addKeyword(EVENTS.MEDIA).addAction(async (ctx) => {
    try {
        fechaBruta = new Date()
        //const nombreImagen = 'Pagos_' + fechaBruta.getFullYear() + '-' + (fechaBruta.getMonth() + 1) + '-' + fechaBruta.getDate() + '-' + fechaBruta.getHours() + '-' + fechaBruta.getMinutes() + '-' + fechaBruta.getSeconds()
        const nombreImagen = 'Comprobante_' + Date.now()
        console.log('Guardando imagen')
        const buffer = await downloadMediaMessage(ctx, "buffer");
        await writeFile("./" + nombreImagen + ".jpg", buffer);

        console.log('Reconociendo texto');

        const worker = await createWorker("eng", 1, {
            logger: m => console.log(m),
        });

        const { data: { text } } = await worker.recognize("./" + nombreImagen + ".jpg");
        console.log(text);
        
    } catch (err) {
        console.log(err);
    }
  })

