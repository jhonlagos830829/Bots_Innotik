const texto = `8:49-
85784
51
Ahora
Bancolombia: Transferiste
$60,000.00 desde tu cuenta *...
¡Transferencia realizada!
Comprobante No. 0000074986
3 Oct 2024 08:49 p.m.
Producto origen
Reynaldo Alvarez Leon
Ahorros
*9965
Producto destino
John Lagos
NEQUI
3102106136
Valor enviado
$ 60.000,00
Descripción
Referencia
Pago internet anticipado octubre 2024
`;

// const ExpRegReferenciaTransfiya = new RegExp("(C[óÓoO0]digo CUS|N[oO0]. de autorizaci[óÓoO0]n:)[\n][0-9a-z]{4,}", "i")


// if (ExpRegReferenciaTransfiya.test(texto) == true){

//     let lineaValor = texto.match(ExpRegReferenciaTransfiya)[0].replaceAll('\n', ' ')
//     console.log('ESTA ES LA LINEA DE LA CUENTA: ' + lineaValor)
//     console.log('ASÍ QUEDARÁ PROCESADA:' + lineaValor.substring(lineaValor.lastIndexOf(' ')).trim())
    
// }


//const regex = /(?=.*\bTransferencia exitosa\b)(?=.*\bComprobante No\.\b)(?=.*\bProducto origen\b)(?=.*\bProducto destino\b)/;
//const regex = new RegExp("Transferencia exitosa", "i")
//const regex = /(?=.*\bTransferencia exitosa\b|\bTransferencia realizada\b)(?=.*\bComprobante N[oO0]\b)(?=.*\bProducto origen\b)(?=.*\bProducto destino\b)/;
const regex = new RegExp(`(?=.*\bTransferencia exitosa\b|\bTransferencia realizada\b)(?=.*\bComprobante N[oO0]\b)(?=.*\bProducto origen\b)(?=.*\bProducto destino\b)`, "gmi")
//const regex = new RegExp("(?=.*\\bTransferencia exitosa\\b|\\bTransferencia realizada\\b)", "i")
//const regex = new RegExp("(?=.*\\bComprobante N[oO0]\\b)", "i")
//const regex = new RegExp("(?=.*\\bProducto origen\\b)(?=.*\\bProducto destino\\b)", "i")

//console.log(texto.match(regex)[0])

if (regex.test(texto)) {
    console.log("Todas las frases están presentes.");
} else {
    console.log("Faltan una o más frases.");
}
