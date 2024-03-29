const {Schema, model} = require("mongoose");

//DEFININFO A ESTRUTURA DA TABELA
const DevSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        user: {
            type: String,
            required: true
        },
        bio: String,
        avatar: {
            type: String,
            required: true,
        },
        likes: [{
            type: Schema.Types.ObjectId,
            ref: 'Dev'
        }],
        dislikes: [{
            type: Schema.Types.ObjectId,
            ref: 'Dev'
        }]
    },    
    {
        timestamps: true
    }
);

//EXPORTANDO O MODEL DEVS
//QUE REPRESENTA A TABELA Devs
module.exports = model("Devs",DevSchema);