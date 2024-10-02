const axios = require('axios').default;
const configuracion = require("../Configuracion/configuracion");

async function PreguntarChatpdf(mensaje) {
   
    let respuesta = '';
        
    try {

        const config = {
            headers: {
              "x-api-key": configuracion.TOKEN_CHATPDF,
              "Content-Type": "application/json",
            },
          };

        const data = {
            sourceId: configuracion.ARCHIVO_FUENTE_CHATPDF,
            messages: [
              {
                role: "user",
                content: mensaje,
              },
            ],
          };

        console.log(data)
        console.log(config)

        //const promesa = await axios.post(configuracion.URL_CHATPDF, data, config).then((response) => response.data.content);
        respuesta = await axios.post(configuracion.URL_CHATPDF, data, config).then((response) => response.data.content);

        // axios
        //   .post(configuracion.URL_CHATPDF, data, config)
        //   .then((response) => {
        //     console.log("Result:", response.data.content);
        //     respuesta = response.data.content;
        //     return response.data.content;
        //   })
        //   .catch((error) => {
        //     console.error("Error:", error.message);
        //     console.log("Response:", error.response.data);
        //   });

  
    } catch (err) {
  
        //Mostrar el mensaje de error
        console.error(err);
  
    }
  
    console.log('retornando')
    console.log(respuesta)
    //Retornar el contenido del archivo
    return respuesta;


  }


  module.exports.PreguntarChatpdf = PreguntarChatpdf;