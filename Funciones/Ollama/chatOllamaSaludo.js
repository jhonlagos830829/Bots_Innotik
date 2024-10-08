const { ChatOllama } = require("@langchain/community/chat_models/ollama");
const { InMemoryChatMessageHistory } = require("@langchain/core/chat_history");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { RunnableWithMessageHistory } = require("@langchain/core/runnables");
const mensajes = require('../../Configuracion/mensajes.js')
const configuracion = require('../../Configuracion/configuracion.js')

//Crear la instancia del LLM
const modelo = new ChatOllama({
    baseUrl: configuracion.URL_OLLAMA,  //"http://192.168.0.104:11434",
    model: configuracion.MODELO_OLLAMA, //"Asistente_Casalins",
});

//Configurar el prompt que usará paa la conversación
const promptSaludo = ChatPromptTemplate.fromMessages([
    [
      "system",
      //`Eres un asistente útil que recuerda los detalles que el usuario comparte contigo, debes responder siempre en español.`,
      `${configuracion.PROMPT_SALUDO}`,
    ],
    ["placeholder", "{chat_history}"],
    ["human", "{input}"],
]);

//Declaración de la variable que almacenará el historial de mensajes
const historialMensajes = {};

//Función para enviar mensajes a Ollama
async function enviarMensaje(idConversacion, mensaje){
    console.log('El texto que me envio es ' + mensaje)

    //Declaración de la cadena que manejará los mensajes
    const chain = promptSaludo.pipe(modelo);
    
    //Crear la sesión con historial de mensjes
    const withMessageHistory = new RunnableWithMessageHistory({
        runnable: chain,
        getMessageHistory: async (sessionId) => {
          if (historialMensajes[sessionId] === undefined) {
            console.log('Creando una nueva sesión en promptSaludo')
            historialMensajes[sessionId] = new InMemoryChatMessageHistory();
          }
          return historialMensajes[sessionId];
        },
        inputMessagesKey: "input",
        historyMessagesKey: "chat_history",
    });
    
    //Configurar el id de la sesión
    const config = {
        configurable: {
          sessionId: idConversacion,
        },
    };
    
    //Enviar el texto al modelo y obtener la respuesta
    const response = await withMessageHistory.invoke(
        {
          input: mensaje,
        },
        config
    );
    
    //console.log('La respuesta es -> ' + response)
    //console.log(response);
  
    //Devolver el resultado de la consulta
    return response.content;

}

module.exports = {enviarMensaje}