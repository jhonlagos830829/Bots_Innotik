let fechaCadena = "2024-10-03T23:08:51.299Z"
// fechaCadena = fechaCadena.replaceAll('-', ' ')
// console.log('Dia:|' + fechaCadena.split(' ')[0] + '|')
// console.log('Mes:|' + fechaCadena.split(' ')[1] + '|')
// console.log('Año:|' + fechaCadena.split(' ')[2] + '|')

// let fecha = new Date(fechaCadena)
// fecha.setDate(fechaCadena.split(' ')[0])
// fecha.setMonth(fechaCadena.split(' ')[1] - 1)
// console.log('La fecha es')
// console.log(fecha)
let nuevaFecha = new Date(fechaCadena)
console.log(nuevaFecha.toLocaleString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }))