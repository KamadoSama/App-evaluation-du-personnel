const mongoose = require("mongoose");
const Evaluation = require("../mongoDB/models/evaluation.js");
const User = require("../mongoDB/models/users.js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const session = require("express-session");

exports.getAllUser = (req,res)=>{
    User.find({})
        .then(users=>res.json(users))
        .catch(error=>console.log(error))
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
                res.render('pages/register',{register:'utilisateur enregistrer avec succès...!'});
                res.end('utilisateur enregister');
            })
        })
        .catch(error=>{
            console(error)
        })
};

exports.loginUser = (req,res)=>{
    console.log(req.body);
    
    User.findOne({identifiant:req.body.identifiant})
        .then(user=>{
            if(!user){
                res.end('mot de passe ou identifiant incorrect')
            }else{
                bcrypt.compare(user.password, req.body.password)
                    .then(valid=>{
                        
                        console.log(req.session)
                        req.session.user= req.body.identifiant;
                        res.redirect('/user/dashboard');
                    })
                    .catch(error=>{
                        console.log(error)
                    })
            }
        })
        .catch(error=>{console.log(error)})
        
};
exports.logoutUser = (req,res)=>{
    req.session.destroy(function(err){
        if(err){
            console.log(err)
            res.send('Error')
        }
        req.logout()
        res.location('/')
    })
    console.log(req.session)
};
exports.dashboard = (req,res)=>{
    if(req.session.user){
        res.render('pages/dashboard',{user:req.session.user})
    }else{
        res.send('utilisateur non autorisé')
    }
}

exports.deleteUser = (req,res)=>{};
exports.updateUser = (req,res)=>{};