const mongoose = require("mongoose");

const userSchema= new mongoose.Schema({
    nom:{type:String,required:true},
    prenom:{type:String,required:true},
    identifiant:{type:String,required:true},
    rule:{type:String,required:true},
    password:{type:String,required:true},
    allMyEvaluation:[{type:mongoose.Schema.Types.ObjectId,ref:'Evaluation'}],
    allEvaluationOnMe:[{type:mongoose.Schema.Types.ObjectId,ref:'Evaluation'}],
    allMyObservationOnMe:[{type:mongoose.Schema.Types.ObjectId,ref:'Sociabilite'}],
})

;const userModel = mongoose.model('User',userSchema);

module.exports = userModel;
