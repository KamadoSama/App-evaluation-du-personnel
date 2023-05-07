const mongoose = require("mongoose")

const sociabiliteSchema = mongoose.Schema({
    idEvaluateur:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    idEvaluer:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    mois: {type: String, required:true},
    note:{type:Number, required: true} ,
    observation: {type: String, required:true},
    allObservationForThisMonth:[]
    
})

const sociabiliteModel = mongoose.model('Sociabilite',sociabiliteSchema)

module.exports = sociabiliteModel