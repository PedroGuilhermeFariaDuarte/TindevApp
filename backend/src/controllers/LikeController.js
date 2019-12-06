const Dev = require("../models/Dev");

module.exports = {
    /**
     * Armazena na tabela o Like do usuario 
     * @param {*} req 
     * @param {*} res 
     */
    async store(req,res){

        //console.log(req.io, req.connectedUsers);

        const { user } = req.headers;
        const { devId } = req.params;

        //console.log(req.params);
        //onsole.log(`ID DO USUARIO LOGADO: ${user}`);
        //console.log(`ID DO USUARIO QUE RECEBEU O LIKE: ${devId}`);

        const loggedDev = await Dev.findById(user);
        const targetDev = await Dev.findById(devId);        

        if(!loggedDev) {
            return res.status(400).json({error:"Error of auth"});
        }

        if (!targetDev) {
            return res.status(400).json({error:'Dev not exists'});
        }

        if(targetDev.likes.includes(loggedDev._id)){
            const loggedSocket = req.connectedUsers[user];
            const targetSocket = req.connectedUsers[devId];

            if (loggedSocket && targetSocket ){
                req.io.to(loggedSocket).emit('match', targetDev);
                req.io.to(targetSocket).emit('match', loggedDev);
            }            
        }

        
        loggedDev.likes.push(targetDev._id);   
        
        await loggedDev.save();

        return res.json(loggedDev);
    }
}