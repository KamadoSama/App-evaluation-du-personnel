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
function moyenne(moyenneSociabilite){
    if (moyenneSociabilite.length > 0) {
        const moyenne = moyenneSociabilite[0].moyenne;
        if (moyenne > 4) {
          return 5;
        } else if (moyenne > 3) {
            return 2;
        } else if (moyenne >= 1) {
            return 1;
        } else {
            return 0;
        }
      } else {
        return 0;
      }
}
async function updateParticipation(participatif,mois,semaine,evaluateur,evaluer,participatifs){
    if(participatif=== null){
        const newParticipation =  await Participatif.create({
            idAdmin: evaluateur._id,
            idEvaluer:evaluer._id,
            mois: mois,  
        })
        newParticipation.note[parseInt(semaine)] = parseInt(participatifs)
        const sum =  newParticipation.note.reduce((acc,curr)=>acc+curr,0)
     
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
            { mois: mois, evaluateur: evaluateur._id, evaluer: evaluer._id },
            { participatif: participatifValue }
        );
        const evaluations = await Evaluation.findOne(
            { mois: mois, evaluateur: evaluateur._id, evaluer: evaluer._id },
            
        );
        updateTotalMois(evaluations)
        newParticipation.save()
    }else{
        participatif.note[parseInt(semaine)] = parseInt(participatifs)
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
            { mois: mois, evaluateur: evaluateur._id, evaluer: evaluer._id },
            { participatif: participatifValue }
        );
        const evaluations = await Evaluation.findOne(
            { mois: mois, evaluateur: evaluateur._id, evaluer: evaluer._id },
            
        );
        updateTotalMois(evaluations)
    }
}

exports.getAllEvalution = (req,res)=>{   
    User.find({ rule: 'Employe', _id: { $ne: req.session.user._id }  })
    .populate({ 
      path: 'allEvaluationOnMe',
      match: { evaluateur: req.session.user._id}
    })
    // .populate('allEvaluationOnMe')
    .exec()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      console.log(err)
    });
};
exports.getAllObservation= (req,res)=>{   
    
    User.find({ rule: 'Employe', _id: { $ne: req.session.user._id }  })
    .populate({ 
      path: 'allMyObservationOnMe',
      match: { idEvaluateur: req.session.user._id}
    })
    .populate('allMyObservationOnMe')
    .exec()
    .then(users => {
       
        res.status(200).json(users);
    })
    .catch(err => {
      console.log(err)
    });
};
exports.getAllParticiatif  = (req,res)=>{
   
    User.findOne({nom:req.body.nom,prenom:req.body.prenom})
    .then(user=>{
        Participatif.find({idEvaluer:user._id})
        .then(participatif=>{
            
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
        if(req.session.rule === "Administrateur")
        {
            const evaluations = await Evaluation.aggregate([
                {
                  $group: {
                    _id: "$mois",
                    moyenne: { $avg: "$totalMois" }
                  }
                }
              ]);
              res.status(200).json( evaluations)
        }else{
            const evaluation =  await Evaluation.find({evaluer:req.session.user._id})
            res.status(200).json(evaluation)
        }
       
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
    const evaluation = await Evaluation.findOne({mois:req.body.mois,evaluer:evaluer._id})
    if(evaluation===null){
        const newEvaluation =  await Evaluation.create({
            ...req.body,
            evaluateur:evaluateur._id,
            evaluer: evaluer._id,
            annee: new Date().getFullYear(),
        })
        evaluateur.allMyEvaluation.push(newEvaluation)
        evaluateur.save()
        evaluer.allEvaluationOnMe.push(newEvaluation)
        evaluer.save()
    }else{
        await Evaluation.findOneAndUpdate({evaluer:evaluer._id,mois:req.body.mois},{ponctualite:req.body.ponctualite,respectFichePoste:req.body.respectFichePoste,evaluateur:evaluateur._id})
        const upeval = await Evaluation.findOne({mois:req.body.mois,evaluer:evaluer._id,evaluateur:evaluateur._id})
        evaluer.allEvaluationOnMe.push(upeval)
        evaluer.save()
        updateTotalMois(upeval)
    }
    const employe = await User.find({rule:"Employe"}).populate('allEvaluationOnMe')
    if(evaluateur.rule==="Administrateur"){
        res.render('pages/admin/evaluation',{employe});
        res.end('evaluation enregister');
    }
   }
   catch(error){
    console.log(error)
   }
}

exports.createParticipation = async (req,res) =>{
    try{
        
        fullName =  req.body.nom.split(" ")
        const evaluer = await User.findOne({nom:fullName[0],prenom:fullName[1]})
        const evaluateur = await User.findOne({identifiant:req.session.user.identifiant})
        const participatif = await Participatif.findOne({idAmine:evaluateur._id,idEvaluer:evaluer._id, mois:req.body.mois})
        const evaluation = await Evaluation.findOne({mois:req.body.mois,evaluer:evaluer._id}) 
        const mois = req.body.mois
        const semaine = req.body.semaine
        const participatifs = req.body.participatif
        if(evaluation===null){
            await Evaluation.create({
                evaluateur:evaluateur._id,
                evaluer: evaluer._id,
                mois:mois,
                annee: new Date().getFullYear(),
            })
            updateParticipation(participatif,mois,semaine,evaluateur,evaluer,participatifs)
            
            res.redirect("/participatif")
        }else{
         
            updateParticipation(participatif,mois,semaine,evaluateur,evaluer,participatifs)
           
            res.redirect("/participatif")
        }
        
    }catch(error){
        console.log(error)
    }
}
exports.createSociabilite = async (req,res) =>{
    try{
        
        fullName =  req.body.nom.split(" ")
        const evaluer = await User.findOne({nom:fullName[0],prenom:fullName[1]})
        
        const evaluateur = await User.findOne({identifiant:req.session.user.identifiant})
        // const sociabilite = await Sociabilite.findOne({idEvaluateur:evaluateur._id,idEvaluer:evaluer._id, mois:req.body.mois})
        const evaluation = await Evaluation.findOne({mois:req.body.mois,evaluer:evaluer._id}) 

        if(evaluation===null){
            
            await Evaluation.create({
                evaluer: evaluer._id,
                mois:req.body.mois,
                annee: new Date().getFullYear(),
            })
           
            const mois = req.body.mois

            const sociabilite = await Sociabilite.create({
                idEvaluateur: evaluateur._id,
                idEvaluer:evaluer._id,
                mois: req.body.mois,  
                note: req.body.sociabilite ,
                observation: req.body.observation,
            })
                
            
            evaluer.allMyObservationOnMe.push(sociabilite)
            evaluer.save()
            const moyenneSociabilite = await Sociabilite.aggregate([
                { $match: { mois } },
                { $group: { _id: '$mois', moyenne: { $avg: '$note' } } }
                ]);
            
                
            await Evaluation.findOneAndUpdate(
                { evaluer: evaluer._id , mois },
                { sociabilite: moyenne(moyenneSociabilite)}
            );
           
            const evaluation = await Evaluation.findOne({evaluer:evaluer._id,mois:mois})
            updateTotalMois(evaluation)
            res.redirect("/listEmploye")
        }else{
            const mois = req.body.mois
            const sociabilite = await Sociabilite.create({
                idEvaluateur: evaluateur._id,
                idEvaluer:evaluer._id,
                mois: req.body.mois,  
                note: req.body.sociabilite ,
                observation: req.body.observation,})
            await Sociabilite.findOne({ idEvaluateur: evaluateur._id,
                idEvaluer:evaluer._id,
                mois: req.body.mois, }) 
            evaluer.allMyObservationOnMe.push(sociabilite)
            evaluer.save()
            const moyenneSociabilite = await Sociabilite.aggregate([
                { $match: { mois } },
                { $group: { _id: '$mois', moyenne: { $avg: '$note' } } }
                ]);
            
            await Evaluation.findOneAndUpdate(
                { evaluer: evaluer._id , mois },
                { sociabilite: moyenneSociabilite[0].moyenne }
            );
            
            const evaluation = await Evaluation.findOne({evaluer:evaluer._id,mois:mois})
            
            updateTotalMois(evaluation)
            res.redirect("/listEmploye")
            
        }
        
    }catch(error){
        console.log(error)
    }
}

exports.deleteEvalution = (req,res)=>{};
exports.updateEvalution = (req,res)=>{};


