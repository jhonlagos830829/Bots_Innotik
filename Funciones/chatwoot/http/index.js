const express = require('express');
const cors = require('cors');
const {join} = require('path');
const { createReadStream } = require('fs');
const configuracion = require('../../../Funciones/configuracion')

/**
 * Clase para para el endpoint y las rutas de express
 */
class ServerHttp {

    app;
    port;

    constructor(_port = 4000){

        this.port = _port;

    }

    /**
     * Controlador para mostrar el código QR
     * @param {*} _ 
     * @param {*} res 
     */
    controladorQr = (_, res) => {
        const rutaImagenQr = join(process.cwd(), 'bot.qr.png');
        const fileStream = createReadStream(rutaImagenQr);
        res.writeHead(200, { "Content-Type": "image/png"});
        fileStream.pipe(res);
    }

    /**
     * Controlador de eventos del Chatwoot
     * @param {*} _ 
     * @param {*} res 
     */
    controladorChatwoot = async (req, res) => {
        
        const body = req.body;
        const attachments = body?.attachments
        const bot = req.bot;

        try{

            const mapperAttributes = body?.changed_attributes?.map((a) => Object.keys(a)).flat(2)

            if(body?.event === 'conversation_updated' && mapperAttributes.includes('assignee_id')){

                const phone = body?.meta?.sender?.phone_number.replace('+', '');
                const idAssigned = body?.changed_attributes[0]?.assignee_id?.current_value ?? null;

                //Si existe algún agente asignado a la conversación
                if(idAssigned){

                    //Agregar el número del cliente a la lista negra para que el bot no le responda
                    bot.dynamicBlacklist.add(phone);

                    //Obtener la lista negra almacenada localmente
                    let listaNegra = configuracion.LeerListaNegra();

                    //Si en lalista no está incuido el número que se puso en la lista negra del bot
                    if(!listaNegra.includes(phone)){
                        
                        //Agregar el número a la lista negra local                        
                        listaNegra.push(phone)

                        //Guardar la lista negra local                        
                        configuracion.GuardarListaNegra(listaNegra)

                    }


                }else{

                    //Obtener los números existentes en la lista negra
                    const list = await bot.dynamicBlacklist.getList();

                    //Si el número del cliente existe en la lista negra
                    if(list.includes(phone)){

                        //Remover el número de la lista negra para que el bot siga interactuando con el ciente
                        bot.dynamicBlacklist.remove(phone);

                        //Obtener la lista negra almacenada localmente
                        let listaNegra = configuracion.LeerListaNegra();
                        
                        //Remover de la lista negra local el número                        
                        listaNegra.splice(listaNegra.indexOf(phone), 1)
                        
                        //Guardar la lista negra local
                        configuracion.GuardarListaNegra(listaNegra)

                    }
                    
                }

                res.send('ok');
                return;

            }

            const checkIfMessage = body?.private == false && body?.event == 'message_created' && body?.message_type ==='outgoing' && body?.conversation?.channel.includes('Channel::Api')
            
            if(checkIfMessage){

                const phone = body.conversation?.meta?.sender?.phone_number.replace('+', '');
                const content = body?.content ?? '';
                const agente = body?.sender?.name ?? '';
                
                //const file = attachments?.lenght ? attachments[0] : null; // SE COMENTAREÓ LA LINEA PORQUE EN EL JSON NO EXISTE EL ATRIBUTO attachments?.lenght Y POR LO TANTO NO ENCONTRABA EL ARCHIVO
                const file = attachments ? attachments[0] : null;

                console.log(file)
                
                if (file) {

                    await bot.providerClass.sendMedia(
                        `${phone}@s.whatsapp.net`,
                        file.data_url,
                        '*' + agente + '*: ' + content,
                    );
                    res.send('ok');
                    return;
                }
                
                await bot.providerClass.sendMessage(
                    `${phone}`,
                    '*' + agente + '*\n\n' + content,
                    {}
                )
            }

        }catch (error){

            console.log(error);

        }
    }

    /**
     * Iniciar el servidor http e instanciar el bot
     */
    initialization = (bot = undefined) => {

        if(!bot){
            throw new Error('DEBES_DE_PASAR_BOT');
        }

        this.app = express();
        this.app.use(cors());
        this.app.use(express.json());

        this.app.use((req, res, next) => {
            req.bot = bot;
            next();
        })
        
        this.app.post('/chatwoot', this.controladorChatwoot)
        this.app.get('/scan-qr', this.controladorQr)

        this.app.listen(this.port, () => console.log('http://localhost:' + this.port + '/scan-qr'))

    }

}

module.exports = ServerHttp