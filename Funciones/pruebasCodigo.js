let fechaCadena = '02-10-2024 06:39 am'
fechaCadena = fechaCadena.replaceAll('-', ' ')
console.log('Dia:|' + fechaCadena.split(' ')[0] + '|')
console.log('Mes:|' + fechaCadena.split(' ')[1] + '|')
console.log('Año:|' + fechaCadena.split(' ')[2] + '|')

let fecha = new Date(fechaCadena)
fecha.setDate(fechaCadena.split(' ')[0])
fecha.setMonth(fechaCadena.split(' ')[1] - 1)
console.log('La fecha es')
console.log(fecha)