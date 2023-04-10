import mongoose from "mongoose";

const evaluationSchema = new mongoose.Schema({

    ponctualite: {type:Number,required:true},          
    sociabilite :{type:Number,required:true},           
    respectFichePoste:{type:Number,required:true},    
    participatif :{type:Number,required:true},
    evaluateur:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    evaluer:{type:mongoose.Schema.Types.ObjectId,ref:'User'}
});

const evaluationModel = mongoose.model('Evaluation',evaluationSchema);

export default evaluationModel;
