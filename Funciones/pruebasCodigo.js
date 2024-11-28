const texto = `"Nequi
COMPROBANTE DE RECARGA
CLAUDIA GISELA BAUTISTA GOMEZ
Dirección
CI 35 4 35-45
Teléfono
6324262
Fecha
2024/09/02 16:43:36
Concepto
NEQUI - RECARGAS
Nro de transacción
912528337
C.UNICO
61382
Código de autorización
M8812586
Número de celular
3169247459
Valor recarga
$ 50,000
`;

// const ExpRegReferenciaTransfiya = new RegExp("(C[óÓoO0]digo CUS|N[oO0]. de autorizaci[óÓoO0]n:)[\n][0-9a-z]{4,}", "i")


// if (ExpRegReferenciaTransfiya.test(texto) == true){

//     let lineaValor = texto.match(ExpRegReferenciaTransfiya)[0].replaceAll('\n', ' ')
//     console.log('ESTA ES LA LINEA DE LA CUENTA: ' + lineaValor)
//     console.log('ASÍ QUEDARÁ PROCESADA:' + lineaValor.substring(lineaValor.lastIndexOf(' ')).trim())
    
// }


const regex = /(?=.*\bCOMPROBANTE DE RECARGA\b)(?=.*\bNEQUI - RECARGAS\b)(?=.*\bCódigo de autorización\b)/;
//const regex = new RegExp("Transferencia exitosa", "i")
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
