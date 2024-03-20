import express from "express";
import dotenv from 'dotenv';
import database from './databse.js';
import routes from './routes/index.js';
import cors from 'cors';

const app = express();

dotenv.config('');
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8085;
const MONGO_URL = process.env.MONGO_URL;
const APP_VERSION = process.env.APP_VERSION;

database(MONGO_URL);
app.use(`/api/${APP_VERSION}`,routes());

app.listen(PORT,()=>{
  console.log(`Our app is listening on port:${PORT}`);
})