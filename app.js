const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

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

const flujoSaludoServicioAlCliente = require('./FlujosBotAtencionAlCliente/flujoSaludoAtencionAlCliente')
const flujoReportePagoAtencionAlCliente = require('./FlujosBotAtencionAlCliente/flujoReportePago')
const flujoReportePagoDiferenteTitular = require('./FlujosBotAtencionAlCliente/flujoReportePagoDiferenteTitular')
const flujoReportePagoEscaneoComprobante = require('./FlujosBotAtencionAlCliente/flujoReportePagoEscaneoComprobante')
const flujoAlgoMasAtencionAlCliente = require('./FlujosBotAtencionAlCliente/flujoAlgoMasAtencionAlCliente')
const flujoFacturasPendientesNombrePropio = require('./FlujosBotAtencionAlCliente/flujoFacturasPendientesNombrePropio')
const flujoFacturasPendientesOtroNombre = require('./FlujosBotAtencionAlCliente/flujoFacturasPendientesOtroNombre')
const flujoNumeroNoRegistrado = require('./FlujosBotAtencionAlCliente/flujoNumeroNoRegistrado')
const flujoCuentaParaPagarOtroNombre = require('./FlujosBotAtencionAlCliente/flujoCuentaParaPagarOtroNombre')

///////////////////////////////////////////////////////////////////////////////////////////////////

///////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN EN EL BOT ASISTENTE /////////////

const flujoPrincipal = require('./FlujosBotAsistente/flujoPrincipal')
const flujoReportarPagoCliente = require('./FlujosBotAsistente/flujoReportarPagoCliente')

///////////////////////////////////////////////////////////////////////////////////////////////////

var clienteSaludado = false

const mainBotAsistenciaTecnica = async () => {
    const nombreBot = 'botAsistenciaTecnica'
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([/*flujoReportarFallaBuscarDeNuevo, flujoReportarFallaNombreTitular, flujoReportarFalla, flujoSaludo, flujoReportarFallaTipoFalla, flujoTextoFallaMasiva, flujoNotaDeVozEnviada, flujoAsistentePagos, flujoReportarFallaServicioLentoIntermitenteTiendaAplicaciones*/])
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
    const adapterFlow = createFlow([flujoSaludoServicioAlCliente, flujoReportePagoAtencionAlCliente, flujoReportePagoDiferenteTitular, flujoReportePagoEscaneoComprobante, flujoAlgoMasAtencionAlCliente, flujoFacturasPendientesNombrePropio, flujoFacturasPendientesOtroNombre, flujoNumeroNoRegistrado, flujoCuentaParaPagarOtroNombre])
    const adapterProvider = createProvider(BaileysProvider, { name:nombreBot })

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb({port:3004})
}

const mainBotAsistente = async () => {
    const nombreBot = 'botAsistente'
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flujoPrincipal, flujoReportarPagoCliente])
    const adapterProvider = createProvider(BaileysProvider, { name:nombreBot })

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb({port:3005})
}

mainBotAsistenciaTecnica()

mainBotServicioAlCliente()

mainBotAsistente()