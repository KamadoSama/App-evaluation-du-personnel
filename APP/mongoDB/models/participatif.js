const mongoose = require('mongoose')

const participatifSchema =  mongoose.Schema({
    idAdmin:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    idEvaluer:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    mois:{type:String,required:true},
    note:Array(4).fill(0)
})

const participatifModel = mongoose.model('Participatif',participatifSchema)
module.exports = participatifModel

