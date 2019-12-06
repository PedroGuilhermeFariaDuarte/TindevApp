require("dotenv").config();
//IMPORTANDO O FRAMEWORK EXPRESS
const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes");
const cors = require("cors");

//DEFININDO A CONEXAO COM O BANCO DE DADOS
mongoose.connect(process.env.MONGO_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//UTILIZANDO O EXPRESS PARA MANIPULAR TODAS AS REQUISICOES ENVIADAS AO SERVIDOR
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const connectedUsers = {};

io.on("connection", socket => {
  const { user } = socket.handshake.query;
  connectedUsers[user] = socket.id;
});

app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;

  return next();
});

//DEFINE O MODO DE LEITURA NO BODY DA REQUISICAO, NESTE CASO O EXPRESS VAI LER/INTERPRETAR OS DADOS ESTRUTURADO EM JSON
app.use(express.json());
app.use(cors());
//DEFININDO A ROTA
app.use(router);

//DEFININDO A PORTA DE COMUNICA��O/REQUISI��O COM O SERVIDOR @3333
server.listen(3333, () => {
  console.log(
    "Server online in 3333 port, open new terminal and start frontend app with yarn start command"
  );
});
