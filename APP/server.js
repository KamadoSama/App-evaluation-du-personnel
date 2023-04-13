const express = require('express');
const dotenv = require('dotenv');
const path = require('path')
const cors = require('cors');
const {connectDB} = require('./mongoDB/connect.js');
const bodyParser = require( 'body-parser');
const session = require( 'express-session');
const {v4:uuidv4} = require('uuid');
const  userRouter = require('./routers/user.router.js')
const cookieParser = require("cookie-parser");
const authentificate = require("./middleware/authentification.js")

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

app.get('/register', (req, res) => {
  res.render("pages/register");
})
app.get('/listEmploye', (req, res) => {
  res.render("pages/listEmploye");
})
app.get('/', authentificate.isNotAuthenticated, (req,res)=>{
    res.render('pages/login');
})
app.get("/login", authentificate.isNotAuthenticated, (req, res) => {
  res.render("pages/login");
});
app.get('/dashboard', authentificate.isAuthenticated, (req,res)=>{
  console.log(`dashboard ${req.session.isAuthenticated}`)
  res.render('pages/dashboard',{user:req.session.user})
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