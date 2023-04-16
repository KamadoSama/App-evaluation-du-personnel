const mongoose = require("mongoose");
const Evaluation = require( "../mongoDB/models/evaluation.js");
const User = require( "../mongoDB/models/users.js");

exports.getAllEvalution = (req,res)=>{
   
    User.find({ rule: 'Employe', _id: { $ne: req.session.user._id }  })
    .populate({ 
      path: 'allEvaluationOnMe',
      match: { evaluateur: req.session.user._id}
    })
    .exec()
    .then(users => {
     
      res.status(200).json(users);
    })
    .catch(err => {
      console.log(err)
    });
};
exports.getAllEvalutionForEvaluer= async (req,res)=>{
    try{
        const evaluation =  await Evaluation.find({evaluer:req.session.user._id})
        res.status(200).json(evaluation)
    }catch(err){
        console.log(err)
        res.status(404).json(err)
    }
    
}
exports.createEvalution = async(req,res)=>{
   try{
    fullName =  req.body.nom.split(" ")
    const evaluer = await User.findOne({nom:fullName[0],prenom:fullName[1]})
    const evaluateur = await User.findOne({identifiant:req.session.user.identifiant})
    
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
    if(evaluateur.rule==="Administrateur"){
        res.render('pages/admin/evaluation',{employe});
        res.end('evaluation enregister');
    }else{
        res.render('pages/user/evaluation',{employe});
        res.end('evaluation enregister');
    }
   }
   catch(error){
    console.log(error)
   }
}
exports.deleteEvalution = (req,res)=>{};
exports.updateEvalution = (req,res)=>{};


