const express = require('express');
const dotenv = require('dotenv');
const path = require('path')
const cors = require('cors');
const connectDB = require('./mongoDB/connect.js');
const bodyParser = require( 'body-parser');
const session = require( 'express-session');
const uuid = require( 'uuid');

dotenv.config()
const port = 8080 || port.env.PORT;
const app = express();
app.set('view enginge','ejs')

app.use(cors());

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use('/static',express.static(path.join(__dirname,'public')))
app.use('/assets',express.static(path.join(__dirname,'public/assets')))
console.log(path.join(__dirname,'public/assets'))

app.use(session(
    {
        secret:uuid(),
        resave:false,
        saveUninitialized:true
    }

))

app.get('/',(req,res)=>{
    res.send("KAMADO SAMA")
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