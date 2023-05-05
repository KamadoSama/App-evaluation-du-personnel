const mongoose = require("mongoose");
const Evaluation = require( "../mongoDB/models/evaluation.js");
const User = require( "../mongoDB/models/users.js");
const Participatif = require('../mongoDB/models/participatif.js')
const Sociabilite = require("../mongoDB/models/sociabilite.js")


async function updateTotalMois(evaluation) {
    const fieldsToSum = ['ponctualite', 'sociabilite', 'respectFichePoste', 'participatif'];
    const total = fieldsToSum.reduce((acc, field) => acc + evaluation[field], 0);
    evaluation.totalMois = total;
    await evaluation.save();
}

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
exports.getAllParticiatif  = (req,res)=>{
    console.log(req.body)
    User.findOne({nom:req.body.nom,prenom:req.body.prenom})
    .then(user=>{
        Participatif.find({idEvaluer:user._id})
        .then(participatif=>{
            console.log(participatif)
            res.status(200).json(participatif)
        })
        .catch(err => {
            res.status(400).json({err})
            console.log(err)
        });
    })
    .catch(err => {
        res.status(400).json({err})
        console.log(err)
    });
}
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

exports.createParticipation = async (req,res) =>{
    try{
        console.log(req.body)
        fullName =  req.body.nom.split(" ")
        const evaluer = await User.findOne({nom:fullName[0],prenom:fullName[1]})
        const evaluateur = await User.findOne({identifiant:req.session.user.identifiant})
        const participatif = await Participatif.findOne({idAmine:evaluateur._id,idEvaluer:evaluer._id, mois:req.body.mois})

        if(participatif=== null){
            const newParticipation =  await Participatif.create({
                idAdmin: evaluateur._id,
                idEvaluer:evaluer._id,
                mois: req.body.mois,  
            })
            newParticipation.note[parseInt(req.body.semaine)] = parseInt( req.body.participatif)
            const sum =  newParticipation.note.reduce((acc,curr)=>acc+curr,0)
            console.log(sum)
            let participatifValue = 0;

            switch (sum) {
                case 0:
                    participatifValue = 0;
                    break;
                case 1:
                case 2:
                    participatifValue = sum;
                    break;
                case 3:
                case 4:
                    participatifValue = 2;
                    break;
                default:
                    participatifValue = 5;
                    break;
            }

            const evaluation = await Evaluation.findOneAndUpdate(
                { mois: req.body.mois, evaluateur: evaluateur._id, evaluer: evaluer._id },
                { participatif: participatifValue }
            );
            updateTotalMois(evaluation)
            newParticipation.save()
        }else{
            participatif.note[parseInt(req.body.semaine)] = parseInt( req.body.participatif)
            participatif.save()
            const sum =  participatif.note.reduce((acc,curr)=>acc+curr,0)
            let participatifValue = 0;

            switch (sum) {
                case 0:
                    participatifValue = 0;
                    break;
                case 1:
                case 2:
                    participatifValue = sum;
                    break;
                case 3:
                case 4:
                    participatifValue = 2;
                    break;
                default:
                    participatifValue = 5;
                    break;
            }
            const evaluation = await Evaluation.findOneAndUpdate(
                { mois: req.body.mois, evaluateur: evaluateur._id, evaluer: evaluer._id },
                { participatif: participatifValue }
            );
            updateTotalMois(evaluation)
        }
       
    }catch(error){
        console.log(error)
    }
}
exports.createSociabilite = async (req,res) =>{
    try{
        console.log(req.body)
        fullName =  req.body.nom.split(" ")
        const evaluer = await User.findOne({nom:fullName[0],prenom:fullName[1]})
        const evaluateur = await User.findOne({identifiant:req.session.user.identifiant})
        const sociabilite = await Sociabilite.findOne({idEvaluateur:evaluateur._id,idEvaluer:evaluer._id, mois:req.body.mois})

        const mois = req.body.mois
        const newSociabilite =  await Sociabilite.create({
            idEvaluateur: evaluateur._id,
            idEvaluer:evaluer._id,
            mois: req.body.mois,  
            note: req.body.sociabilite ,
            observation: req.body.observation,})

        await   newSociabilite.save()
        const moyenneSociabilite = await Sociabilite.aggregate([
            { $match: { mois } },
            { $group: { _id: '$mois', moyenne: { $avg: '$note' } } }
            ]);
          
        // Mettre à jour l'évaluation correspondante avec la moyenne des notes de sociabilité
        const evaluation =  await Evaluation.findOneAndUpdate(
            { evaluer: evaluer._id , mois },
            { sociabilite: moyenneSociabilite[0].moyenne }
        );

        updateTotalMois(evaluation)
               
    }catch(error){
        console.log(error)
    }
}

exports.deleteEvalution = (req,res)=>{};
exports.updateEvalution = (req,res)=>{};


