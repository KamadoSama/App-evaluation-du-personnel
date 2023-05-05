const express = require('express');
const dotenv = require('dotenv');
const path = require('path')
const cors = require('cors');
const {connectDB} = require('./mongoDB/connect.js');
const bodyParser = require( 'body-parser');
const session = require( 'express-session');

const  userRouter = require('./routers/user.router.js')
const evaluationRouter= require('./routers/evaluation.router.js')
const cookieParser = require("cookie-parser");
const authentificate = require("./middleware/authentification.js")
const User = require("./mongoDB/models/users.js");

dotenv.config()
const port = 8080 || port.env.PORT;
const app = express();
app.set('view engine','ejs')

app.use(cors());

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser()); 

app.use('/static',express.static(path.join(__dirname,'public')))
app.use('/assets',express.static(path.join(__dirname,'public/assets')))
app.use('/js',express.static(path.join(__dirname,'public/js')))
console.log(path.join(__dirname,'static'))

app.use(
      session({
        secret: "M@_CH@INE_DE_S£CR£T",
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 3600000, // 1 heure en millisecondes
          httpOnly: true,
        },
      })
    );
app.use('/user',userRouter);
app.use('/evaluation',evaluationRouter);

app.get("/evaluation/",authentificate.isAuthenticated,(req,res)=>{
  if(req.session.rule === "Administrateur"){
    
    res.render("pages/admin/evaluation",{NomUser:req.session.user.nom,PrenomUser:req.session.user.prenom})

  
  }else{
    res.render("pages/user/evaluation",{NomUser:req.session.user.nom,PrenomUser:req.session.user.prenom})

  }
})

app.get('/register',authentificate.isAuthenticated, (req, res) => {
  res.render("pages/admin/register",{NomUser:req.session.user.nom,PrenomUser:req.session.user.prenom});
})

app.get('/participatif',authentificate.isAuthenticated, (req, res) => {
  res.render("pages/admin/participation",{NomUser:req.session.user.nom,PrenomUser:req.session.user.prenom});
})

app.get('/listEmploye',authentificate.isAuthenticated, (req, res) => {
  if(req.session.rule === "Administrateur"){
    res.render("pages/admin/listEmploye",{NomUser:req.session.user.nom,PrenomUser:req.session.user.prenom})
  }else{
    res.render("pages/user/listEmploye",{NomUser:req.session.user.nom,PrenomUser:req.session.user.prenom});
  }
 })


app.get('/', authentificate.isNotAuthenticated, (req,res)=>{
    res.render('pages/login');
})

app.get("/login", authentificate.isNotAuthenticated, (req, res) => {
  res.render("pages/login");
});

app.get('/dashboard', authentificate.isAuthenticated, (req,res)=>{
  if(req.session.rule === "Administrateur"){
  
    res.render('pages/admin/dashboard',{NomUser:req.session.user.nom,PrenomUser:req.session.user.prenom})
  }else{
    res.render('pages/user/dashboard',{NomUser:req.session.user.nom,PrenomUser:req.session.user.prenom})
  }
})

const startServer = async () =>{
    try{
        connectDB(process.env.MONGODB_URL)
        app.listen(port,console.log(`app dispo sur http://localhost:${port}`));
    }catch(error){
        console.log(error);
    }
}
    
startServer();