const mongoose = require("mongoose");
const Evaluation = require( "../mongoDB/models/evaluation.js");
const User = require( "../mongoDB/models/users.js");

exports.getAllEvalution =async (req,res)=>{
    try{
        const employe = await User.find({rule:"Employe"}).populate('allEvaluationOnMe')
        console.log("Evaluation")
        console.log(employe);
        res.render("pages/evaluation", {employe})
        res.send(employe)
    }    
    catch(error){console.log(error)}
};
exports.createEvalution = async(req,res)=>{
   try{
    fullName =  req.body.nom.split(" ")
    const evaluer = await User.findOne({nom:fullName[0],prenom:fullName[1]})
    const evaluateur = await User.findOne({identifiant:req.session.user})
    console.log(`Evaluer ${evaluer}`)
    console.log(`Evaluateur ${evaluateur}`)
    const newEvaluation =  await Evaluation.create({
        ...req.body,
        evaluateur:evaluateur._id,
        evaluer: evaluer._id
    })
    evaluateur.allMyEvaluation.push(newEvaluation)
    evaluateur.save()
    evaluer.allEvaluationOnMe.push(newEvaluation)
    evaluer.save()
    const employe = await User.find({rule:"Employe"}).populate('allEvaluationOnMe')
    res.render('pages/evaluation',{employe});
    res.end('evaluation enregister');
   }
   catch(error){
    console.log(error)
   }
}
exports.deleteEvalution = (req,res)=>{};
exports.updateEvalution = (req,res)=>{};


