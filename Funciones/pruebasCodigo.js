const texto = `¡Genial! La reserva ha sido confirmada.

Los datos de la reserva son:

{
"nombrecliente": "Juan Carlos Gómez Vázquez",
"fechahora": "2024-12-02T20:00:00Z",
"sucursal": "Cabecera",
"plan": "Mesa de los navegantes",
"cantidadpersonas": 6,
"celebracion": "Cumpleaños",
"nombrehomenajeado": "",
"sexohomenajeado": "mujer",
"dificultadsubirescaleras": false
}

¡Hasta pronto!
`;

// const ExpRegReferenciaTransfiya = new RegExp("(C[óÓoO0]digo CUS|N[oO0]. de autorizaci[óÓoO0]n:)[\n][0-9a-z]{4,}", "i")


// if (ExpRegReferenciaTransfiya.test(texto) == true){

//     let lineaValor = texto.match(ExpRegReferenciaTransfiya)[0].replaceAll('\n', ' ')
//     console.log('ESTA ES LA LINEA DE LA CUENTA: ' + lineaValor)
//     console.log('ASÍ QUEDARÁ PROCESADA:' + lineaValor.substring(lineaValor.lastIndexOf(' ')).trim())
    
// }


//const regex = /(?=.*\bCOMPROBANTE DE RECARGA\b)(?=.*\bNEQUI - RECARGAS\b)(?=.*\bCódigo de autorización\b)/;
const regex = new RegExp("{[\\wáéíóúüñÁÉÍÓÚÜÑ ,-:\"\n]*}", "i")
//const regex = /(?=.*\bTransferencia exitosa\b|\bTransferencia realizada\b)(?=.*\bComprobante N[oO0]\b)(?=.*\bProducto origen\b)(?=.*\bProducto destino\b)/;
//const regex = new RegExp(`(?=.*\bCOMPROBANTE DE RECARGA\b)(?=.*\bNEQUI - RECARGAS\b)(?=.*\bCódigo de autorización\b)`, "gmi")
//const regex = new RegExp("(?=.*\\bTransferencia exitosa\\b|\\bTransferencia realizada\\b)", "i")
//const regex = new RegExp("(?=.*\\bComprobante N[oO0]\\b)", "i")
//const regex = new RegExp("(?=.*\\bProducto origen\\b)(?=.*\\bProducto destino\\b)", "i")

//console.log(texto.match(regex)[0])

if (regex.test(texto)) {
    console.log("Todas las frases están presentes.");
} else {
    console.log("Faltan una o más frases.");
}
