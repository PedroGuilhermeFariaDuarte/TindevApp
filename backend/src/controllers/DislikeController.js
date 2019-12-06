const Dev = require("../models/Dev");

module.exports = {
    async store(req,res) {

        const {user} = req.headers;
        const {devId} = req.params;

        const loggedDev = await Dev.findById(user);
        const targetDev = await Dev.findById(devId);

        if(!loggedDev){
            return res.status(400).json({error:'error of auth'});
        }

        if(!targetDev){
            return res.status(400).json({error:'dev not exists'});
        }

        if(!loggedDev.dislikes.includes(targetDev._id)){
            loggedDev.dislikes.push(targetDev._id);            
        }

        await loggedDev.save();

        return res.json({messagge: `${loggedDev}`});
    }
}