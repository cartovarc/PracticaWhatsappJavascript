'use strict';

var accountSid = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'; // PONER SUS CREDENCIALES
var authToken = 'fXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'; // PONER SUS CREDENCIALES

const  twilio = require('twilio');
const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 8080;

const app = express();

app.get("/", function (req, res) {
  res.sendFile("index.html", { root: __dirname });
});

const server = app.listen(PORT, () => {
  const port = server.address().port;
  console.log("http://localhost:" + port);
});

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Cliente conectado');

  socket.on("mensaje_wssp", (data) => {
    console.log("Datos del mensaje: ");
    console.log(data);

    // data -> {"celular": "+5712431234321", "mensaje": "UN MENSAJE"}
    let client = new twilio(accountSid, authToken);
    
    let celular = "whatsapp:" + data["celular"];
    client.messages.create({
        body: data["mensaje"],
        to: celular,
        from: 'whatsapp:+14155238886'
    })
    .then((message) => {
      console.log(message);
      socket.emit("respuesta", message)
    });
  });

  socket.on('disconnect', () => console.log("Cliente desconectado"));
});
