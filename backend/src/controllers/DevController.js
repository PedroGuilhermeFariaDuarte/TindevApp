const axios = require("axios");

//CARREGANDO O MODULO DEV
const Dev = require("../models/Dev");

//DEFININDO O CONTROLLER DEVCONTROLLER COMO UM MODOLO
//QUE POR SUA VEZ, VAI RECEBER TODAS AS REQUISICOES ATRAVES DAS ROTAS
module.exports = {
    /**
     * Metodo responsavel por processar toda a requisicao enviada pela rota
     * @param {*} req 
     * @param {*} res 
     */
   async store(req, res) {
        //ACESSANDO A PRORIEDADE USERNAME DO OBEJTO body
        const  {username} = req.body;
        
        //console.log(`Controller: cadastro do usuario ${username}`);

        //VERIFICANDO SE O USUARIO REQUISITADO PARA SER INSERIDO JÁ EXISTE NO BANCO DE DADOS
        const userExists = await Dev.findOne({user: username});

        //console.log(userExists);

        if (userExists) return res.json(userExists);

        //UTILIZANDO O PACOTE AXIOS PARA EFEUTAR REQUISICOES Á API's EXTERNAS
        const response = await axios.get(`https://api.github.com/users/${username}`);

        const { name, bio,avatar_url : avatar} = response.data;

        //ADICIONANDO UM NOVO USUARIO NA TABELA DEV, E RECEBENDO O RETORNO DA CRIACAO
        const dev =  await Dev.create(
            {
                name: name,
                user: username,
                bio: bio,
                avatar: avatar
            }
        );

        //console.log(dev);

        return res.json(dev);
    },

    async index(req, res){

        const {user} = req.headers;

        const loggedDev = await Dev.findById(user);

        if(!loggedDev){
            return res.status(400).json({error:'dev not auth'});
        }

        const users = await Dev.find(
        {
            $and : [
                {_id: { $ne: user } },
                {_id: { $nin: loggedDev.likes } },
                {_id: { $nin: loggedDev.dislikes } }
            ]
        });

        return res.json(users);
    }
}