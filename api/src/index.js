import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import nodemailer from 'nodemailer';

// Importing Database
import {connect} from "./database";
import {dbName} from "./config";
import {smtp} from './mailconfig';

// Importing Router
import AppRouter from "./router";

// Setup Emailer
let email = nodemailer.createTransport(smtp);

// File Storage CONFIG
const storageDir = path.join(__dirname, '..', 'storage');
const storageConfig = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, storageDir);
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));
	}
})

const upload = multer({ storage: storageConfig });

// END File Storage CONFIG

const PORT = 3001;
const app = express();
app.server = http.createServer(app);


app.use(morgan('dev'));


app.use(cors({
    exposedHeaders: "*"
}));

app.use(bodyParser.json({
    limit: '300mb'
}));

app.set('root', __dirname);
app.set('storageDir', storageDir);
app.set('upload', upload);
app.email = email;

connect( (err, client) => {
	if(err){
		console.log("Error connecting to database");
		throw (err);
	}

	app.set('db', client.db(dbName));

	// init routers.
	new AppRouter(app);

	app.server.listen(process.env.PORT || PORT, () => {
	        console.log(`App is running on port ${app.server.address().port}`);
	});

});



export default app;
