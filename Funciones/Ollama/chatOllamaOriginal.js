const { ChatOllama } = require("@langchain/community/chat_models/ollama");
const { InMemoryChatMessageHistory } = require("@langchain/core/chat_history");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { RunnableWithMessageHistory } = require("@langchain/core/runnables");
const mensajes = require('../../Configuracion/mensajes.js')

//Crear la instancia del LLM
const modelo = new ChatOllama({
    baseUrl: "http://192.168.0.104:11434",
    model: "Asistente_Casalins",
});

const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      //`Eres un asistente útil que recuerda los detalles que el usuario comparte contigo, debes responder siempre en español.`,
      `${mensajes.PROMPT_DATOS_ENVIO_PEDIDO}`,
    ],
    ["placeholder", "{chat_history}"],
    ["human", "{input}"],
]);


//Declaración de la variable que almacenará el historial de mensajes
const messageHistories = {};
    


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
async function enviarMensajeConHistorial(idConversacion, mensaje){
    
    // //Crear la instancia del LLM
    // const modelo = new ChatOllama({
    //     baseUrl: "http://192.168.0.102:11434",
    //     model: "Asistente_Casalins",
    // });
  
    // //Declaración de la variable que almacenará el historial de mensajes
    // const messageHistories = {};
    
    // const prompt = ChatPromptTemplate.fromMessages([
    //     [
    //       "system",
    //       //`Eres un asistente útil que recuerda los detalles que el usuario comparte contigo, debes responder siempre en español.`,
    //       `${mensajes.PROMPT_COMPLETO}`,
    //     ],
    //     ["placeholder", "{chat_history}"],
    //     ["human", "{input}"],
    // ]);

    const chain = prompt.pipe(modelo);

    const withMessageHistory = new RunnableWithMessageHistory({
        runnable: chain,
        getMessageHistory: async (sessionId) => {
          if (messageHistories[sessionId] === undefined) {
            console.log('Creando una nueva sesión')
            messageHistories[sessionId] = new InMemoryChatMessageHistory();
          }
          return messageHistories[sessionId];
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

    console.log(response);
  
    //Devolver el resultado de la consulta
    return response.content;

}

module.exports = {enviarMensaje, enviarMensajeConHistorial}