const mongoose = require("mongoose");
const Evaluation = require("../mongoDB/models/evaluation.js");
const User = require("../mongoDB/models/users.js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const session = require("express-session");

// let employes = [];

exports.getAllUser = (req,res)=>{
    User.find({rule:"Employe"})
        .then(users=> {
            console.log(users);
            res.render("pages/listEmploye", {employes: users})
        })
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
                        
                        console.log(req.session);
                        req.session.isAuthenticated = true;
                        req.session.user= req.body.identifiant;
                        console.log(`id user ${req.session.id}`)
                        res.redirect('/dashboard');
                    })
                    .catch(error=>{
                        console.log(error)
                    })
            }
        })
        .catch(error=>{console.log(error)})
        
};
exports.logoutUser = (req,res)=>{
    console.log(req.session.isAuthenticated)
    req.session.isAuthenticated = false;
    console.log(req.session.isAuthenticated)
    req.session.destroy(() => {
        res.redirect("/login");
      });
    console.log(req.session)
};


exports.deleteUser = (req,res)=>{};
exports.updateUser = (req,res)=>{};