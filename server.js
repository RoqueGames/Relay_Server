const WebSocket = require("ws");

const port = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port });

wss.on("connection", (ws) => {
  console.log("Novo cliente conectado");

  ws.on("message", (msg) => {
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        // A CORREÇÃO ESTÁ AQUI: envie 'msg' diretamente
        client.send(msg);
      }
    });
  });

  ws.on("close", () => console.log("Cliente desconectado"));
});

console.log("Servidor relay rodando na porta", port);

