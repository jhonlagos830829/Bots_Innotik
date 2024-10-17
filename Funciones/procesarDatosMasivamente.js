//Declaracion de variables
const fs = require('fs');
const cuenta = require('./cuenta')
const cliente = require('./cliente')
const articulo = require('./articulo')
const elemento = require('./elemento')
const modelo = require('./modelo')
const { delay } = require('@whiskeysockets/baileys');

let contenidoArchivo = null;

const CrearCuenta = async function(banco, tipo, numero, titular, identificacion) {
    
    const result = await cuenta.Guardar(banco, tipo, numero, titular, identificacion)
    
    console.log(result);

}

const CrearCliente = async function(identificacion, nombre, numeroWhatsapp, numeroTelefonico, direccion, email) {
    
    const result = await cliente.Guardar(identificacion, nombre, numeroWhatsapp, numeroTelefonico, direccion, email)
    
    console.log(result);

}

const BuscarCliente = async function(identificacion) {
    
    const result = await cliente.obtenerCliente(identificacion)
        
    console.log(result);

}

const CrearModelo = async function(nombre) {
    
  const result = await modelo.Guardar(nombre)
  console.log(result);

}

const CrearArticulo = async function(nombre, codigoUpc, codigoEan13, tipo_articulo, fabricante, modelo, unidad_medida) {
    
  const result = await articulo.Guardar(nombre, codigoUpc, codigoEan13, tipo_articulo, fabricante, modelo, unidad_medida)
  console.log(result);

}

const CrearElemento = async function(fechaCompra, factura, mac, serial, precio, articulo, proveedor) {
    
  const result = await elemento.Guardar(fechaCompra, factura, mac, serial, precio, articulo, proveedor)
  console.log(result);

}

async function consultarConFor() {
    
    // //console.log('Consultando 91278786')
    // let salida = await cliente.obtenerCliente('91278786', '', '')
    // console.log(JSON.stringify(salida))

    //Leer el contenido del archivo
    const clientes = fs.readFileSync('Archivos/ValidaClientes.csv', 'utf8').split(/\r?\n/);
    
    //Obtener el contenido del archivo
    let contenidoArchivo = clientes;
    let campos

    const resultados = [];
  
    for (const linea of contenidoArchivo) {

        try {

            //Obtener los campos separados por ,
            campos = linea.split(';')

            //console.log('Consultando ' + campos[0])

            //Buscar al cliente en la base de datos
            const resultado = await cliente.obtenerCliente(campos[0], '', ''); // Espera que se complete cada consulta

            //Si la consulta no arrojó resultados
            if (Object.keys(resultado.data).length == 0){
                console.log('El cliente: ' + campos[0] + ' no se ha creado aún')
            }
            // else{
            //     console.log('El cliente: ' + campos[0] + ' ya está')
            // }
            
            //console.log('Resultado: ' + JSON.stringify(resultado))
            
            //resultados.push(resultado);

        } catch (error) {

            console.error(`Error en la consulta con el dato:`, error);

        }

    }
  
    //console.log(JSON.stringify(resultados))
    return resultados; // Retorna todos los resultados una vez finalizadas las consultas
  }
  
  async function consultaDB(dato) {
    // Simulando una consulta a la base de datos que devuelve una promesa
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (dato % 2 === 0) {
          resolve(`Resultado para el dato ${dato}`);
        } else {
          reject(`Error con el dato ${dato}`);
        }
      }, 1000); // Simulamos que la consulta toma 1 segundo
    });
  }

  
const CrearModelos = async function() {

  const datos = fs.readFileSync('Archivos/Modelo.csv', 'utf8').split(/\r?\n/);
  let campos

  //console.log(data);
  contenidoArchivo = datos;

  for (const linea of contenidoArchivo){

      campos = linea.split(';')

      await CrearModelo(campos[1])

  }
}

 
const CrearArticulos = async function() {

  const datos = fs.readFileSync('Archivos/Elemento.csv', 'utf8').split(/\r?\n/);
  let campos

  //console.log(data);
  contenidoArchivo = datos;

  for (const linea of contenidoArchivo){

      campos = linea.split(';')

      await CrearArticulo(campos[2], campos[0], campos[1], campos[3], campos[4], campos[5], campos[6])

  }
}
 
const CrearElementos = async function() {

  const datos = fs.readFileSync('Archivos/Articulo.csv', 'utf8').split(/\r?\n/);
  let campos

  //console.log(data);
  contenidoArchivo = datos;

  for (const linea of contenidoArchivo){

      campos = linea.split(';')

      let fecha = new Date(campos[1])

      //console.log(fecha)

      await CrearElemento(fecha, campos[2], campos[3], campos[4], campos[5], campos[6], campos[7])

  }
}


try {


  // CrearModelos()
  
  // CrearArticulos()

  CrearElementos()
  
    // // consultarConFor()

    // //Leer el contenido del archivo
    // //const datos = fs.readFileSync('Archivos/Elemento.csv', 'utf8').split(/\r?\n/);
    // const datos = fs.readFileSync('Archivos/Modelo.csv', 'utf8').split(/\r?\n/);
    // let campos

    // //console.log(data);
    // contenidoArchivo = datos;

    // for (const linea of contenidoArchivo){

    //     campos = linea.split(';')

    //     // console.log('La linea ' + linea)
        
    //     // console.log('Identificacion ' + campos[0])
    //     // console.log('Nombre ' + campos[1])
    //     // console.log('Whatsapp ' + campos[2])
    //     // console.log('Teléfono ' + campos[3])
    //     // console.log('Direccion ' + campos[4])
    //     // console.log('Correo ' + campos[5])

    //     await CrearModelo(campos[1])
    //     //CrearArticulo(campos[2], campos[0], campos[1], campos[3], campos[4], campos[5], campos[6])

        
        
    //     //let salida = await BuscarCliente(campos[0])

    //     //ValidarClientes(campos[0])

    //     // console.log('Encontré este')
    //     // console.log(salida)

    // }


} catch (err) {

    //Mostrar el mensaje de error
    console.error(err);

}
