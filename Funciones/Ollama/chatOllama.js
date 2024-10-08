const { ChatOllama } = require("@langchain/community/chat_models/ollama");
const { InMemoryChatMessageHistory } = require("@langchain/core/chat_history");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { RunnableWithMessageHistory } = require("@langchain/core/runnables");
const mensajes = require('../../Configuracion/botAtencionAlCliente/mensajes')

//Crear la instancia del LLM
const modelo = new ChatOllama({
    baseUrl: "http://192.168.0.104:11434",
    model: "Innotik_Clasificador_Comprobantes",
});

const promptDatosEnvio = ChatPromptTemplate.fromMessages([
    [
      "system",
      //`Eres un asistente útil que recuerda los detalles que el usuario comparte contigo, debes responder siempre en español.`,
      `${mensajes.PROMPT_CLASIFICADOR_COMPROBANTE}`,
    ],
    ["placeholder", "{chat_history}"],
    ["human", "{input}"],
]);

//Declaración de la variable que almacenará el historial de mensajes
const historialMensajesDatosEnvio = {};
 
const promptProductosPedido = ChatPromptTemplate.fromMessages([
  [
    "system",
    //`Eres un asistente útil que recuerda los detalles que el usuario comparte contigo, debes responder siempre en español.`,
    `${mensajes.PROMPT_VALIDAR_PRODUCTOS}`,
  ],
  ["placeholder", "{chat_history}"],
  ["human", "{input}"],
]);

//Declaración de la variable que almacenará el historial de mensajes
const historialMensajesProductosPedido = {};
 


//Función para enviar mensajes a Ollama
async function enviarMensaje(mensaje){
    
    // //Crear la instancia del LLM
    // const modelo = new ChatOllama({
    //     baseUrl: "http://192.168.0.102:11434",
    //     model: "Asistente_Casalins",
    // });
  
    //Realizar la consulta al LLM
    const response = await modelo.invoke(
        mensaje
    );
  

  console.log(response.content);
  
  //Devolver el resultado de la consulta
  return response;

}

//Función para enviar mensajes a Ollama
async function enviarMensajeConHistorialDatosEnvio(idConversacion, mensaje){
    console.log('El texto que me envio es ' + mensaje)
    // //Crear la instancia del LLM
    // const modelo = new ChatOllama({
    //     baseUrl: "http://192.168.0.102:11434",
    //     model: "Asistente_Casalins",
    // });
  
    // //Declaración de la variable que almacenará el historial de mensajes
    // const historialMensajesDatosEnvio = {};
    
    // const prompt = ChatPromptTemplate.fromMessages([
    //     [
    //       "system",
    //       //`Eres un asistente útil que recuerda los detalles que el usuario comparte contigo, debes responder siempre en español.`,
    //       `${mensajes.PROMPT_COMPLETO}`,
    //     ],
    //     ["placeholder", "{chat_history}"],
    //     ["human", "{input}"],
    // ]);

    const chain = promptDatosEnvio.pipe(modelo);
    
    const withMessageHistory = new RunnableWithMessageHistory({
        runnable: chain,
        getMessageHistory: async (sessionId) => {
          if (historialMensajesDatosEnvio[sessionId] === undefined) {
            console.log('Creando una nueva sesión en promptDatosEnvio')
            historialMensajesDatosEnvio[sessionId] = new InMemoryChatMessageHistory();
          }
          return historialMensajesDatosEnvio[sessionId];
        },
        inputMessagesKey: "input",
        historyMessagesKey: "chat_history",
    });
    
    const config = {
        configurable: {
          sessionId: idConversacion,
        },
    };
    
    const response = await withMessageHistory.invoke(
        {
          input: mensaje,
        },
        config
    );
    console.log('La respuesta es -> ' + response)
    //console.log(response);
  
    //Devolver el resultado de la consulta
    return response.content;

}

//Función para enviar mensajes a Ollama
async function enviarMensajeConHistorialProductosPedido(idConversacion, mensaje){
    
  // //Crear la instancia del LLM
  // const modelo = new ChatOllama({
  //     baseUrl: "http://192.168.0.102:11434",
  //     model: "Asistente_Casalins",
  // });

  // //Declaración de la variable que almacenará el historial de mensajes
  // const historialMensajesProductosPedido = {};
  
  // const prompt = ChatPromptTemplate.fromMessages([
  //     [
  //       "system",
  //       //`Eres un asistente útil que recuerda los detalles que el usuario comparte contigo, debes responder siempre en español.`,
  //       `${mensajes.PROMPT_COMPLETO}`,
  //     ],
  //     ["placeholder", "{chat_history}"],
  //     ["human", "{input}"],
  // ]);

  const chain = promptProductosPedido.pipe(modelo);

  const withMessageHistory = new RunnableWithMessageHistory({
      runnable: chain,
      getMessageHistory: async (sessionId) => {
        if (historialMensajesProductosPedido[sessionId] === undefined) {
          console.log('Creando una nueva sesión en promptProductosPedido')
          historialMensajesProductosPedido[sessionId] = new InMemoryChatMessageHistory();
        }
        return historialMensajesProductosPedido[sessionId];
      },
      inputMessagesKey: "input",
      historyMessagesKey: "chat_history",
  });

  const config = {
      configurable: {
        sessionId: idConversacion,
      },
  };

  const response = await withMessageHistory.invoke(
      {
        input: mensaje,
      },
      config
  );

  //console.log(response);

  //Devolver el resultado de la consulta
  return response.content;

}

module.exports = {enviarMensaje, enviarMensajeConHistorialDatosEnvio, enviarMensajeConHistorialProductosPedido}