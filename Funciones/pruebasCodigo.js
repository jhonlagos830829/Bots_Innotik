const texto = `texto

10:30
El dinero que enviaste ya llegó
4G 71
Ahora
BBVA ¡Transferencia desde Transfiya EXITOSA!
El número 3016312051 acaba de aceptar...
Transferencia en proceso
7 de noviembre de 2024, 10:30 a.m.
Valor transferido
$50.000,00
Comisión: $ 0,00 IVA incluido
Más impuesto GMF
Ahorro Libretón 301631 2051
•8707
Tipo de operación
Transferencia por Transfiya
Concepto
Sin concepto
Código CUS
OORbqEOt2fnGIWM38
Recibirás el comprobante de la operación en
este correo:
⚫014@hotmail.com
`;

const ExpRegReferenciaTransfiya = new RegExp("(C[óÓoO0]digo CUS|N[oO0]. de autorizaci[óÓoO0]n:)[\n][0-9a-z]{4,}", "i")


if (ExpRegReferenciaTransfiya.test(texto) == true){

    let lineaValor = texto.match(ExpRegReferenciaTransfiya)[0].replaceAll('\n', ' ')
    console.log('ESTA ES LA LINEA DE LA CUENTA: ' + lineaValor)
    console.log('ASÍ QUEDARÁ PROCESADA:' + lineaValor.substring(lineaValor.lastIndexOf(' ')).trim())
    
}


// //const regex = /(?=.*\bTransferencia exitosa\b)(?=.*\bComprobante No\.\b)(?=.*\bProducto origen\b)(?=.*\bProducto destino\b)/;
// //const regex = new RegExp("Transferencia exitosa", "i")
// const regex = /(?=.*\bTransferencia exitosa\b|\bTransferencia realizada\b)(?=.*\bComprobante N[oO0]\b)(?=.*\bProducto origen\b)(?=.*\bProducto destino\b)/;

// console.log(texto.match(regex)[0])

// if (regex.test(texto)) {
//     console.log("Todas las frases están presentes.");
// } else {
//     console.log("Faltan una o más frases.");
// }
