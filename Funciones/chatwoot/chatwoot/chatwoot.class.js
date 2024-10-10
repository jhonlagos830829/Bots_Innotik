const fs = require('fs').promises
const path = require('path')
const mime = require('mime')

class ChatwootClass{

    config = {
        account: undefined,
        token: undefined,
        endpoint: undefined,
    }

    /**
     * Recibir los parámetros de conexión con Chatwoot
     */
    constructor(_config = {}){

        //Si la cuenta no está configurada
        if(!_config?.account){
            throw new Error('ACCOUNT_ERROR')
        }
        
        //Si el token no está configurado
        if(!_config?.token){
            throw new Error('TOKEN_ERROR')
        }

        //Si el endpoint no está configurado
        if(!_config?.endpoint){
            throw new Error('ENDPOINT_ERROR')
        }

        //Configurar el archivo de conexión
        this.config = _config;

    }

    /**
     * Formatear el número
     * @param {*} numero 
     * @returns 
     */
    formatearNumero = (numero) => {

        //Si el número no contiene el +
        if(!numero.startsWith('+')){

            //Agregarle el símbolo + y retornarlo
            return '+' + numero;

        }
        return numero;
    }

    /**
     * Construir encabezado con la autorización del token
     * @returns 
     */
    construirEncabezado = () => {

        const encabezados = new Headers();
        encabezados.append('api_access_token', this.config.token);
        encabezados.append('Content-Type', 'application/json');
        return encabezados;

    }

    /**
     * Construir URL base
     * @param {*} path 
     * @returns 
     */
    construirUrlBase = (path) => {
        return this.config.endpoint + '/api/v1/accounts/' + this.config.account + path;
    }

    /**
     * Buscar un contacto por el número de teléfono
     * @param {*} from 
     * @returns 
     */
    buscarContacto = async (from) => {
        //console.log('Este es el from ' + from)
        try{

            const url = this.construirUrlBase('/contacts/search?q=' + from);
            const dataFetch = await fetch(url, {
                headers: this.construirEncabezado(),
                method: 'GET'
            });

            //console.log(dataFetch)

            const data = await dataFetch.json()
            return data.payload[0]

        } catch (error){
            
            console.error(`[Error buscarContacto]`, error)
            return []

        }

    }

    /**
     * Crear un contacto
     * @param {*} dataIn 
     * @returns 
     */
    crearContacto = async (dataIn = { from: '', name: '', inbox: '' }) => {
        try{

            dataIn.from = this.formatearNumero(dataIn.from)

            const data = {
                inbox_id: dataIn.inbox,
                name: dataIn.name,
                phone_number: dataIn.from,
            };

            const url =this.construirUrlBase('/contacts')
            const dataFetch = await fetch(url, {
                headers: this.construirEncabezado(),
                method: 'POST',
                body: JSON.stringify(data)
            })

            const response = await dataFetch.json()
            return response.payload.contact

        } catch (error){

            console.error(`[Error crearContacto]`, error)
            return []

        }
    }

    /**
     * Buscar o crear un contacto en caso que no exista
     * @param {*} dataIn 
     * @returns 
     */
    buscarCrearContacto = async (dataIn = { from:'', name: '', inbox: '' }) => {

        try{
            
            dataIn.from = this.formatearNumero(dataIn.from);
            const contactoBuscado = await this.buscarContacto(dataIn.from);
            
            if(!contactoBuscado){

                const contacto = await this.crearContacto(dataIn);
                return contacto;

            }

            return contactoBuscado;            

        }catch (error){

            console.error(`Error buscarCrearContacto`, error);
            return;

        }

    }

    /**
     * Crear una conersación
     * @param {*} dataIn 
     * @returns 
     */
    crearConversacion = async (dataIn = { inbox_id: '', contact_id: '', phone_number: '' }) => {
        try {
            
            dataIn.phone_number = this.formatearNumero(dataIn.phone_number);
            const body = {
                custom_attributes: { phone_number: dataIn.phone_number },
            };
            
            const url = this.construirUrlBase('/conversations');
            const dataFetch = await fetch(url, {
                method: 'POST',
                headers: this.construirEncabezado(),
                body: JSON.stringify({ ...dataIn, ...body}),
            });

            const data = await dataFetch.json();
            return data;

        } catch (error){

            console.error(`Error al crear la conversacion`, error);
            return;

        }
    }

    /**
     * Buscar si existe una conversación previa
     * @param {*} dataIn 
     * @returns 
     */
    buscarConversacion = async (dataIn = { phone_number: '' }) => {
        
        try {
            dataIn.phone_number = this.formatearNumero(dataIn.phone_number);
            const payload = [
                {
                    attribute_key: 'phone_number',
                    attribute_model: 'standard',
                    filter_operator: 'equal_to',
                    values: [dataIn.phone_number],
                    custom_attribute_type: '',
                },
                
            ];
            
            const url = this.construirUrlBase('/conversations/filter');
            const dataFetch = await fetch(url, {
                method: 'POST',
                headers: this.construirEncabezado(),
                body: JSON.stringify({ payload }),
            });

            const data = await dataFetch.json();
            return data.payload;

        } catch (error){

            console.error(`Error al crear la conversacion`, error);
            return;

        }

    }

    /**
     * 
     * @param {*} dataIn 
     * @returns 
     */
    buscarCrearConversacion = async (dataIn = { inbox_id: '', contact_id: '', phone_number: ''}) =>{

        try{
            
            dataIn.phone_number = this.formatearNumero(dataIn.phone_number);
            const conversacionBuscada = await this.buscarConversacion(dataIn);
            if(!conversacionBuscada.length){
                
                const idConversacion = await this.crearConversacion(dataIn);
                return idConversacion;

            }

            return conversacionBuscada[0]

        } catch (error){

            console.error(`Error crearBuscarConversacion`, error)
            return

        }

    }

    /**
     * Esta funcion ha sido modificada para poder enviar archivos multimedia y texto
     * [messages]
     * @param {mode}  "incoming" | "outgoing"
     * @param {*} dataIn 
     * @returns 
     */
    crearMensaje = async (dataIn = { msg: '', mode: '', conversation_id: '', attachment: [] }) => {
        try {
            const url = this.construirUrlBase(`/conversations/${dataIn.conversation_id}/messages`)
            const form = new FormData();
          
            form.set("content", dataIn.msg);
            form.set("message_type", dataIn.mode);
            form.set("private", "true");

            if(dataIn.attachment?.length){
                
                const mimeType = mime.lookup(dataIn.attachment[0]).toString();
                
                const fileName  = `${dataIn.attachment[0]}`.split('/').pop()
                const blob = new Blob([await fs.readFile(dataIn.attachment[0])], {type: mimeType});
                form.set("content", '');
                form.set("attachments[]", blob, fileName);
            }
            const dataFetch = await fetch(url,
                {
                    method: "POST",
                    headers: {
                        api_access_token: this.config.token
                    },
                    body: form
                }
            );
            const data = await dataFetch.json();
            return data
        } catch (error) {
            console.error(`[Error createMessage]`, error)
            return
        }
    }

    /**
     * [inboxes]
     * Crear un inbox si no existe
     * @param {*} dataIn 
     * @returns 
     */
    crearInbox = async (dataIn = { name: '' }) => {
        try {
            const payload = {
                name: dataIn.name,
                channel: {
                    type: "api",
                    webhook_url: "",
                },
            };

            const url = this.construirUrlBase('/inboxes')
            const dataFetch = await fetch(url, {
                headers: this.construirEncabezado(),
                method: 'POST',
                body: JSON.stringify(payload)
            })

            const data = await dataFetch.json();
            return data;

        } catch (error) {

            console.error(`[Error crearInbox]`, error)
            return

        }
    }

    /**
     * [inboxes]
     * Buscar si existe un inbox creado
     * @param {*} dataIn 
     * @returns 
     */
    buscarInbox = async (dataIn = { name: '' }) => {
        try {
            
            const url = this.construirUrlBase('/inboxes')
            const dataFetch = await fetch(url, {
                headers: this.construirEncabezado(),
                method: 'GET',
            })
            
            const data = await dataFetch.json();
            const payload = data.payload

            const inboxBuscado = payload.find((o) => o.name === dataIn.name)

            //Si el inbox existe
            if (!inboxBuscado) {

                return

            }

            return inboxBuscado;

        } catch (error) {

            console.error(`[Error buscarInbox]`, error)
            return

        }
    }

    /**
     * [inboxes]
     * Buscar o crear inbox
     * @param {*} dataIn 
     * @returns 
     */
    buscarCrearInbox = async (dataIn = { name: '' }) => {
        try {
            
            const inboxBuscado = await this.buscarInbox(dataIn)

            //Si existe el inbox
            if (!inboxBuscado) {

                const idInbox = await this.crearInbox(dataIn)
                return idInbox

            }

            return inboxBuscado

        } catch (error) {

            console.error(`[Error buscarCrearInbox]`, error)
            return
            
        }
    }

}

module.exports = ChatwootClass