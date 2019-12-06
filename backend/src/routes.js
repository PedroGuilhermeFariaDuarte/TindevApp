const express = require('express');

const router = express.Router();

const DevController = require('./controllers/DevController');
const LikeController = require('./controllers/LikeController');
const DislikeController = require('./controllers/DislikeController');

/*
DEFININDO DE FORMA ENCADEADA AS ROTAS DA APLICA��O PARA DOIS TIPO DE REQUISICAO
MAIS OS MIDDLEWARE ENCADEADO EM CADA ROTA
*/

router.route("/")
    .get((req,res,next) => {
        
        if(typeof req.query.name != 'undefined'){            
            //A PROPRIEADE QUERY � UM OBJETO RESPONSAVEL POR ARMAZENAR TODAS AS QUERY STRING/PARAMETRO ENVIADOS PELA REQUISI��O
            const name = req.query.name;
            res.json(`{message:'Hello World!',name: ${name}}`);
            //if(name == "security"){                
                //res.json(`{message:'Hello World!'`);
            //}else{                
                //CHAMANDO O PROXIMO MIDDLEWARE(ENCADEADO)
              //  next();
            //}                        
        }else{
            res.status(500).send("Sorry");
        }
                
    },
    (req,res,next) => {
    
        const name = req.query.name;
        if(name != 'PHILIPS'){
            res.json(`{message:'Hello World! this not security',name: ${name}}`);
        }else{
            //CHAMANDO OUTRO MIDDLEWARE(ROTA)
            next("route");
        }
        
    }   
    )
    .post((req,res) => {
        //
    });  

router.route("/devs")
      .post(
        DevController.store
        )      
      .delete((req,res) => {
        res.json("{message:'ok', status:'true'}");
      })
      .get(DevController.index);
    
router.route("/devs/:devId/likes")
    .post(LikeController.store)

router.route("/devs/:devId/dislikes")
    .post(DislikeController.store)

module.exports = router;