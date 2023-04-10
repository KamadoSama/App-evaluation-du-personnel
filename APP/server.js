import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './mongoDB/connect.js';

dotenv.config()
const port = 8080 || port.env.PORT;
const app = express();

app.use(cors());



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