require("dotenv-safe").config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const server = express();
//importa as rotas criadas da API
const routes = require('./server/routes');
//const SERVER_PORT = process.env || 4000;
const SERVER_PORT = 5000;

//habilida o uso da biblioca bodyParser para que seja permitido a transferência de dados JSON num tamanho prédefinido de 10 mb
server.use(bodyParser.urlencoded({extended: true, limit: '10mb'}));
server.use(bodyParser.json({limit: '10mb'}));
//habilita o cors
server.use(cors());
//middleware configura as requisições que serão permitidas
var allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'HEAD,GET,PUT,POST,DELETE,OPTIONS,PATCH');
    res.header("Access-Control-Max-Age", "3600");
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Accept")
    next();
}

//configura o middleware acima
server.use(allowCrossDomain);
//define uma rota base da API
server.get('/api', (req, res) => {
    res.status(200).send('Rota raiz da API Click Ideia');
});
//vincula ao servidor as rotas criadas
server.use('/api', routes);
//inicializa o servidor na porta configurada
server.listen(SERVER_PORT, () => {

    console.log(`Servidor da API Click Ideia sendo executado na porta ${SERVER_PORT}`);
});