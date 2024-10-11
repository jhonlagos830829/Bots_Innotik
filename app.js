const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

////////////// FUNCIONES PARA CHATWOOT //////////////

const { downloadMediaMessage } = require("@whiskeysockets/baileys")
const fs = require('fs')
const { writeFile } = require("node:fs/promises")
const Queue = require('queue-promise')
const mimeType = require('mime-types')
const ServerHttp = require('./Funciones/chatwoot/http/index')
const ChatwootClass = require('./Funciones/chatwoot/chatwoot/chatwoot.class')
const { manejadorDeMensajes } = require('./Funciones/chatwoot/chatwoot')
const configuracion = require('./Configuracion/configuracion')
const configuracionBot = require('./Funciones/configuracion')
const puertoExpress = configuracion.PUERTO_EXPRESS

///////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN EN EL BOT DE ASISTENCIA TECNICA /////////////

const flujoSaludo = require('./FlujosBotAsistenciaTecnica/flujoSaludo')
const flujoReportarFallaTipoFalla = require('./FlujosBotAsistenciaTecnica/flujoReportarFallaTipoFalla')
const flujoAsistentePagos = require('./FlujosBotAsistenciaTecnica/flujoAsistentePagos')
const flujoTextoFallaMasiva = require('./FlujosBotAsistenciaTecnica/flujoTextoFallaMasiva')
const flujoReportePago = require('./FlujosBotAsistenciaTecnica/flujoReportePago')
const flujoNotaDeVozEnviada = require('./FlujosBotAsistenciaTecnica/flujoNotaDeVozEnviada')
const flujoImagenEnviada = require('./FlujosBotAsistenciaTecnica/flujoImagenEnviada')
const flujoReportarFalla = require('./FlujosBotAsistenciaTecnica/flujoReportarFalla')
const flujoReportarFallaNombreTitular = require('./FlujosBotAsistenciaTecnica/flujoReportarFallaNombreTitular')
const flujoReportarFallaBuscarDeNuevo = require('./FlujosBotAsistenciaTecnica/flujoReportarFallaBuscarDeNuevo')

const flujoReportarFallaServicioLentoIntermitenteTiendaAplicaciones = require('./FlujosBotAsistenciaTecnica/flujoReportarFallaServicioLentoIntermitenteTiendaAplicaciones')

///////////////////////////////////////////////////////////////////////////////////////////////////

///////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN EN EL BOT DE ATENCIÓN AL CLIENTE /////////////

const flujoSaludoAtencionAlCliente = require('./FlujosBotAtencionAlCliente/flujoSaludoAtencionAlCliente')
const flujoReportePagoAtencionAlCliente = require('./FlujosBotAtencionAlCliente/flujoReportePago')
const flujoReportePagoDiferenteTitular = require('./FlujosBotAtencionAlCliente/flujoReportePagoDiferenteTitular')
const flujoReportePagoEscaneoComprobante = require('./FlujosBotAtencionAlCliente/flujoReportePagoEscaneoComprobante')
const flujoAlgoMasAtencionAlCliente = require('./FlujosBotAtencionAlCliente/flujoAlgoMasAtencionAlCliente')
const flujoFacturasPendientesNombrePropio = require('./FlujosBotAtencionAlCliente/flujoFacturasPendientesNombrePropio')
const flujoFacturasPendientesOtroNombre = require('./FlujosBotAtencionAlCliente/flujoFacturasPendientesOtroNombre')
const flujoNumeroNoRegistrado = require('./FlujosBotAtencionAlCliente/flujoNumeroNoRegistrado')
const flujoCuentaParaPagarOtroNombre = require('./FlujosBotAtencionAlCliente/flujoCuentaParaPagarOtroNombre')
const flujoNotaDeVozEnviadaAtencionAlCliente = require('./FlujosBotAtencionAlCliente/flujoNotaDeVozEnviada')
///////////////////////////////////////////////////////////////////////////////////////////////////

///////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN EN EL BOT ASISTENTE /////////////

const flujoPrincipal = require('./FlujosBotAsistente/flujoPrincipal')
const flujoNuevoCliente = require('./FlujosBotAsistente/flujoNuevoCliente')
const flujoReportarPagoCliente = require('./FlujosBotAsistente/flujoReportarPagoClienteNombre')

///////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////// ELEMENTOS NECESARIOS PARA CHATWOOT ////////////////////////////////////


const serverHttp = new ServerHttp(puertoExpress)
const chatwoot = new ChatwootClass({
    account: configuracion.ID_CUENTA_CHATWOOT,
    token: configuracion.TOKEN_CHATWOOT,
    endpoint: configuracion.ENDPOINT_CHATWOOT
})

const queue = new Queue({
    concurrent:1,
    interval:500
})


///////////////////////////////////////////////////////////////////////////////////////////////////


const mainBotAsistenciaTecnica = async () => {
    const nombreBot = 'botAsistenciaTecnica'
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([/*flujoReportarFallaBuscarDeNuevo, flujoReportarFallaNombreTitular, flujoReportarFalla, flujoSaludo, flujoReportarFallaTipoFalla, flujoTextoFallaMasiva, flujoNotaDeVozEnviada, flujoAsistentePagos, flujoReportarFallaServicioLentoIntermitenteTiendaAplicaciones*/flujoAsistentePagos])
    const adapterProvider = createProvider(BaileysProvider, { name:nombreBot })

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb({port:3003})
}

const mainBotServicioAlCliente = async () => {
    const nombreBot = 'botServicioAlCliente'
    const adapterDB = new MockAdapter()

    // FLUJOS PARA ATENCION AL CLIENTE
    const adapterFlow = createFlow([flujoNotaDeVozEnviadaAtencionAlCliente, flujoSaludoAtencionAlCliente, flujoReportePagoAtencionAlCliente, flujoReportePagoDiferenteTitular, flujoReportePagoEscaneoComprobante, flujoAlgoMasAtencionAlCliente, flujoFacturasPendientesNombrePropio, flujoFacturasPendientesOtroNombre, flujoNumeroNoRegistrado, flujoCuentaParaPagarOtroNombre])
    
    // // FLUJOS PARA ATENCION AL ASISTENTE
    // const adapterFlow = createFlow([flujoPrincipal, flujoNuevoCliente, flujoReportarPagoCliente])

    // // FLUJOS PARA EL ASISTENTE
    // const adapterFlow = createFlow([flujoAsistentePagos])

    const adapterProvider = createProvider(BaileysProvider, { name:nombreBot })

    const bot = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    
    ////////////////////////// ELEMENTOS NECESARIOS PARA CHATWOOT ////////////////////////////////////


    //Obtener los números de la lista negra local
    const listaNegra = configuracionBot.LeerListaNegra()

    //Recorrer la lista negra local
    for(const numero of listaNegra){

        //Agregar el número del cliente a la lista negra para que el bot no le responda
        bot.dynamicBlacklist.add(numero);

    }

    serverHttp.initialization(bot)

    //Envento que se dispara cuando ingresa un mensaje
    adapterProvider.on('message', (payload) => {
        
        //Obtener los archivos adjuntos
        const getAttachments = async () => {

            //Declaración de variables
            const attachment = []

            //Si el mensaje contiene algún archivo adjunto
            if (payload?.body.includes('_event_')) {
                
                //Obtener el archivo adjunto
                const mime = payload?.message?.imageMessage?.mimetype ?? payload?.message?.videoMessage?.mimetype ?? payload?.message?.documentMessage?.mimetype ?? payload?.message?.audioMessage?.mimetype;

                //Obtener la extensión del archivo
                const extension = mimeType.extension(mime);
                
                //Descargar el archivo adjunto
                const buffer = await downloadMediaMessage(payload, "buffer", {});
                
                //Configurar el nombre del archivo y la extensión
                const fileName = `file-${Date.now()}.${extension}`
                
                //Elaborar el nombde del directorio donde se guardarán las imagenes
                const nombreDirectorioAdjuntos = 'Archivos/Adjuntos/' + fechaBruta.getFullYear() + '-' + (fechaBruta.getMonth() + 1) + '-' + fechaBruta.getDate() + '/' + payload.from
                
                //Si el directorio no existe
                if (!fs.existsSync(nombreDirectorioAdjuntos)){
                    
                    //Crear el directorio
                    fs.mkdirSync(nombreDirectorioAdjuntos, { recursive: true });
                    
                }

                //Configurar la ruta completa para el archivo
                const pathFile = nombreDirectorioAdjuntos + '/' + fileName

                //Guardar el archivo adjunto en la ruta creada previamente
                await writeFile(pathFile, buffer);

                //Agregar la ruta del archivo a la lista de archivos adjuntos
                attachment.push(pathFile)

                //Devolver la lista de archivos adjuntos
                return attachment;

            }
      
            return null
        }

        //Encolar el proceso de construcción del mensaje
        queue.enqueue(async () =>{

            //Obtener los archivos adjuntos del mensaje enviado
            const attachments = await getAttachments()

            //Configurar los datos del mensaje
            let message = payload.body

            //Si la lista de archivos adjuntos no está vacía o nula
            if (attachments?.length) {

                //Si el mensaje enviado no es nulo
                if (payload?.message) {

                    //Obtener el tipo de mensaje enviado por el cliente
                    const typeMessage = Object.keys(payload?.message)
                        .find((key) => ['imageMessage', 'videoMessage', 'documentMessage', 'audioMessage'].includes(key))

                    //Si el tipo de mensaje no es vacío no nulo
                    if (typeMessage) {

                        // //Si el tipo de mensaje es diferente a mensaje de audio
                        // if ('audioMessage' !== typeMessage) {

                        //     //Configutar el mensaje a mostrar
                        //     message = payload.message[typeMessage].caption || "Archivo adjunto :paperclip:. Click en **Descargar** para ver el contenido."

                        // } else {

                        //     message = "Audio adjunto :paperclip:. Click en **Descargar** para escuchar el audio."

                        // }

                        //Si el tipo de mensaje es diferente a mensaje de audio
                        if (typeMessage == 'imageMessage') {

                            //Configutar el mensaje a mostrar
                            message = payload.message[typeMessage].caption || "Imágen adjunta. Click en **Descargar** para obtener la imágen."

                        }
                        if (typeMessage == 'videoMessage') {

                            //Configutar el mensaje a mostrar
                            message = payload.message[typeMessage].caption || "Video adjunto. Click en **Descargar** para obtener el video."

                        }
                        if (typeMessage == 'documentMessage') {

                            //Configutar el mensaje a mostrar
                            message = payload.message[typeMessage].caption || "Documento adjunto. Click en **Descargar** para obtener el documento."

                        }
                        if (typeMessage == 'audioMessage') {

                            //Configutar el mensaje a mostrar
                            message = payload.message[typeMessage].caption || "Audio adjunto. Click en **Descargar** para obtener el audio."

                        }else {

                            //Configutar el mensaje a mostrar
                            message = "Archivo adjunto. Click en **Descargar** para obtener el archivo."

                        }

                    }
                }

            }

            //Configurar el manejador de los mensajes
            await manejadorDeMensajes({
                
                phone: payload.from,
                name: payload.pushName,
                //message: payload.body,
                message: message,
                mode: 'incoming',
                attachment: attachments ?? null,

            }, chatwoot)

        })
        
    })

    //Envento que se dispara cuando sale un mensaje
    bot.on('send_message', (payload) => {
        
        queue.enqueue(async () =>{
            
            await manejadorDeMensajes({
                
                phone: payload.numberOrId,
                name: payload.pushName,
                message: payload.answer,
                mode: 'outgoing'

            }, chatwoot)
            
        })
        
    })


    /////////////////////////////////////////////////////////////////////////////////////////////////


    QRPortalWeb({port:3004})
}

const mainBotAsistente = async () => {
    const nombreBot = 'botAsistente'
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flujoPrincipal, flujoNuevoCliente, flujoReportarPagoCliente])
    const adapterProvider = createProvider(BaileysProvider, { name:nombreBot })

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb({port:3005})
}

//mainBotAsistenciaTecnica()

mainBotServicioAlCliente()

//mainBotAsistente()