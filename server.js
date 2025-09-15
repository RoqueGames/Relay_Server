extends Node

const PORT = 8080
const MESSAGE_TYPE = "message"
var server = TCPServer.new()
var clients = []

func _ready():
    if server.listen(PORT) == OK:
        print("Servidor iniciado na porta ", PORT)
    else:
        print("Erro ao iniciar servidor")

func _process(_delta):
    # Aceitar novas conexões
    if server.is_connection_available():
        var client = server.take_connection()
        clients.append(client)
        print("Novo cliente conectado: ", client)
    
    # Processar mensagens dos clientes
    for client in clients:
        if client.get_status() == StreamPeerTCP.STATUS_CONNECTED:
            if client.get_available_bytes() > 0:
                var message = client.get_string(client.get_available_bytes())
                broadcast(message, client)
        else:
            clients.erase(client)
            print("Cliente desconectado")

func broadcast(message, sender):
    var json = JSON.new()
    var error = json.parse(message)
    
    if error == OK:
        var data = json.data
        if data is Dictionary and data.has("type") and data["type"] == MESSAGE_TYPE:
            # Enviar para todos os clientes exceto o remetente
            for client in clients:
                if client != sender and client.get_status() == StreamPeerTCP.STATUS_CONNECTED:
                    client.put_string(message + "\n")
    else:
        print("JSON inválido: ", message)
