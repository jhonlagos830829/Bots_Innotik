import { ChatOllama } from "@langchain/community/chat_models/ollama";

const ollamaLlm = new ChatOllama({
  baseUrl: "http://192.168.0.102:11434", // Default value
  model: "llama3", // Default value
});

// const response = await ollamaLlm.invoke(
//   "Cual es la capital de Rusia"
// );
// console.log(response.content);


// import "cheerio";
// import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";

// const loader = new CheerioWebBaseLoader(
//   "http://8eee09125afe.sn.mynetname.net:1337/api/cl-productos"
// );
// const docs = await loader.load();

// const textSplitter = new RecursiveCharacterTextSplitter({
//   chunkSize: 500,
//   chunkOverlap: 0,
// });
// const allSplits = await textSplitter.splitDocuments(docs);
// console.log(allSplits.length);

// import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
// import { MemoryVectorStore } from "langchain/vectorstores/memory";

// const embeddings = new OllamaEmbeddings(ollamaLlm);
// const vectorStore = await MemoryVectorStore.fromDocuments(
//   allSplits,
//   embeddings
// );

// const question1 = "Cual es el valor de baja california?";
// const docus1 = await vectorStore.similaritySearch(question1);
// console.log(docus1.length);
// console.log(docus1);

// import { RunnableSequence } from "@langchain/core/runnables";
// import { StringOutputParser } from "@langchain/core/output_parsers";
// import { PromptTemplate } from "@langchain/core/prompts";
// import { createStuffDocumentsChain } from "langchain/chains/combine_documents";

// const prompt = PromptTemplate.fromTemplate(
//   "Hágame un resumen de lo que encontró en los documentos recuperados: {context}"
// );

// //console.log(prompt)

// const chain = await createStuffDocumentsChain({
//   llm: ollamaLlm,
//   outputParser: new StringOutputParser(),
//   prompt,
// });

// const question = "Cual es el plan más económico?";
// const docus = await vectorStore.similaritySearch(question);
// const salida = await chain.invoke({
//   context: docus,
// });
// console.log(salida)


// import { pull } from "langchain/hub";
// import { ChatPromptTemplate } from "@langchain/core/prompts";

// const ragPrompt = await pull<ChatPromptTemplate>("rlm/rag-prompt");

// console.log(ragPrompt)

// const chain1 = await createStuffDocumentsChain({
//   llm: ollamaLlm,
//   outputParser: new StringOutputParser(),
//   prompt: ragPrompt,
// });

// const salida1 = await chain1.invoke({ context: docs, question });
// console.log(salida1)

// ------------------------------------------------------------------------------------------------

// IMPLEMENTACIÓN DE AGENTES

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";

const loader1 = new CheerioWebBaseLoader(
  "http://8eee09125afe.sn.mynetname.net:1337/api/cl-productos?pagination[pageSize]=300"
);
const rawDocs = await loader1.load();

// console.log('Todos los datos enteros')
// console.log(rawDocs)

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});
const docs1 = await splitter.splitDocuments(rawDocs);

// console.log('Los documentos')
// console.log(docs1)
// console.log(docs1.length + ' documentos en total')

const embeddings1 = new OllamaEmbeddings(ollamaLlm);

const vectorstore = await MemoryVectorStore.fromDocuments(
  docs1,
  //new OpenAIEmbeddings()
  embeddings1
);
const retriever = vectorstore.asRetriever();

// console.log('El retriever contiene...')
// console.log(retriever)

const retrieverResult = await retriever.getRelevantDocuments(
  "¿Que es Baja California?"
);
//console.log(retrieverResult[0]);

// /*
//   Document {
//     pageContent: "your application progresses through the beta testing phase, it's essential to continue collecting data to refine and improve its performance. LangSmith enables you to add runs as examples to datasets (from both the project page and within an annotation queue), expanding your test coverage on real-world scenarios. This is a key benefit in having your logging system and your evaluation/testing system in the same platform.Production​Closely inspecting key data points, growing benchmarking datasets, annotating traces, and drilling down into important data in trace view are workflows you’ll also want to do once your app hits production. However, especially at the production stage, it’s crucial to get a high-level overview of application performance with respect to latency, cost, and feedback scores. This ensures that it's delivering desirable results at scale.Monitoring and A/B Testing​LangSmith provides monitoring charts that allow you to track key metrics over time. You can expand to",
//     metadata: {
//       source: 'https://docs.smith.langchain.com/user_guide',
//       loc: { lines: [Object] }
//     }
//   }
// */

import { createRetrieverTool } from "langchain/tools/retriever";

const retrieverTool = createRetrieverTool(retriever, {
  name: "consulta_productos",
  description:
    "Busca inormación de los productos en la lista de productos",
});

const tools = [/*searchTool, */retrieverTool];

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { pull } from "langchain/hub";

// // Get the prompt to use - you can modify this!
// // If you want to see the prompt in full, you can at:
// // https://smith.langchain.com/hub/hwchase17/openai-functions-agent
// const prompt = await pull<ChatPromptTemplate>(
//   "hwchase17/openai-functions-agent"
// );

// set the LANGCHAIN_API_KEY environment variable (create key in settings)
import * as hub from "langchain/hub";
const prompt = await hub.pull("hwchase17/openai-functions-agent");

console.log(prompt)

import { createOpenAIFunctionsAgent } from "langchain/agents";

const agent = await createOpenAIFunctionsAgent({
  ollamaLlm,
  tools,
  prompt,
});