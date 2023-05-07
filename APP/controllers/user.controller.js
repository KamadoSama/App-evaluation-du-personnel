const mongoose = require("mongoose");
const Evaluation = require("../mongoDB/models/evaluation.js");
const User = require("../mongoDB/models/users.js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const session = require("express-session");

// let employes = [];

exports.getAllUser =async (req,res)=>{
    try{
        const users = await User.find({rule:"Employe"}).populate("allMyEvaluation")
        res.status(200).json(users)
    }
    catch(error){console.log(error)}
};


exports.registerUser = (req,res)=>{
    bcrypt.hash(req.body.password,10)
        .then(hash=>{
            const user = new User({
                ...req.body,
                password:hash
            })
            user.save()
            .then(()=>{
                res.render('pages/admin/register',{register:'utilisateur enregistrer avec succès...!'});
                res.end('utilisateur enregister');
            })
        })
        .catch(error=>{
            console(error)
        })
};

exports.loginUser = (req,res)=>{
    // console.log(req.body);
    
    User.findOne({identifiant:req.body.identifiant})
        .then(user=>{
          // console.log(user.password)
            if(!user){
                res.render('pages/login',{login: "nom d'utilisateur incorrect ou non enregistrer...!"});
            }else{
                bcrypt.compare( req.body.password,user.password)
                    .then(valid=>{
                      // console.log(valid)
                       if(!valid){
                        res.render('pages/login',{login: "nom d'utilisateur incorrect ou mot de passe incorrect...!"});
                        
                       }
                       
                       req.session.isAuthenticated = true;
                       req.session.user= user;
                       req.session.rule = user.rule
                      
                       res.redirect('/dashboard');
                    })
                    .catch(error=>{
                      res.render('pages/login',{login: "nom d'utilisateur incorrect ou non enregistrer...!"});
                      console.log(error)
                    })
            }
        })
        .catch(error=>{console.log(error)})
        
};
exports.logoutUser = (req,res)=>{
    // console.log(req.session.isAuthenticated)
    req.session.isAuthenticated = false;
    // console.log(req.session.isAuthenticated)
    req.session.destroy(() => {
        res.redirect("/login");
      });
    console.log(req.session)
};

exports.getAllUserForAdmin = async (req,res)=>{
    User.find({ rule: 'Employe' })
    .populate({
      path: 'allMyEvaluation',
      model: 'Evaluation',
      select: '-evaluateur -evaluer.__v -evaluer.password -evaluer.rule',
    })
    .populate({
      path: 'allEvaluationOnMe',
      model: 'Evaluation',
      select: '-evaluer -evaluateur.__v -evaluateur.password -evaluateur.rule',
    })
    .then((users) => {
      const result = users.map((user) => {
        const moyennesParMois = {};
        const evaluationsOnMe = user.allEvaluationOnMe
    
        for (const evaluation of evaluationsOnMe) {
          
          const mois = evaluation.mois;
          if (!moyennesParMois[mois]) {
            moyennesParMois[mois] = {
              mois: mois,
              moyenne: 0,
              total:0,
              count:0,
            };
          }
          moyennesParMois[mois].total += (evaluation.totalMois) ;
          moyennesParMois[mois].count+=1
        }
  
        for (const mois in moyennesParMois) {
          moyennesParMois[mois].moyenne = Math.round(moyennesParMois[mois].total/moyennesParMois[mois].count) ;
        }
  
        const moyenneAnnuelle = Object.values(moyennesParMois).reduce((total, current) => total + current.moyenne, 0) / 12;
  
        return {
          nom: user.nom,
          prenom: user.prenom,
          identifiant: user.identifiant,
          rule: user.rule,
          moyennesParMois: Object.values(moyennesParMois),
          moyenneAnnuelle: Math.round(moyenneAnnuelle) ,
        };
      });
      //console.log(result);
      res.status(200).json(result)
    })
    .catch((err) => console.error(err));
  
      
}
exports.deleteUser = async (req,res)=>{
  const { nom, prenom } = req.body;
  try {
    const user = await User.findOneAndDelete({ nom, prenom });
    if (user===null) {
      res.render('pages/admin/delete',{bad:'Aucun employé de ce nom...!'});
    }else{
      res.render('pages/admin/delete',{Supprimer:'Employé supprimer avec succès...!'});
    }
  } catch (error) {
    console.log(error);
  }
};
exports.updateUser = (req,res)=>{};