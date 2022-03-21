const {Keys} =  require('../crypt/rsa');
class Client {
    socket_id;
    client_ip;
    keys;

    constructor(socket_id, client_ip){
        this.client_ip = client_ip;
        this.socket_id = socket_id;
    }

    SetKeys(keys){
        this.keys = new Keys(keys);
    }

    CheckUser(socket_id, client_ip){
        return (this.client_ip == client_ip) && (this.socket_id == socket_id);
    }
}
exports.Client = Client;