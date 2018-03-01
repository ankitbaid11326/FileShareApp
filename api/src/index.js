import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import nodemailer from 'nodemailer';
import AWS from 'aws-sdk';

// Importing Database
import {connect} from "./database";
import {dbName} from "./config";
import {smtp, s3Config, s3Region, s3Bucket} from './mailconfig';

// Importing Router
import AppRouter from "./router";

// Amazon S3 setup
AWS.config.update(s3Config);
AWS.config.region = s3Region;

const s3 = new AWS.S3();

// Setup Emailer
let email = nodemailer.createTransport(smtp);

// File Storage CONFIG
const storageDir = path.join(__dirname, '..', 'storage');

// const upload = multer({ storage: storageConfig });
const upload = multer({
	storage: multerS3({
		s3: s3,
		bucket: s3Bucket,
		metadata: function (req, file, cb) {
			cb(null, {fieldName: file.fieldname});
		},
		key: function (req, file, cb) {
			const filename = `${Date.now().toString()}-${file.originalname}`;
			cb(null, filename)
		}
	})
})
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
app.upload = upload;
app.email = email;
app.s3 = s3;

connect( (err, client) => {
	if(err){
		console.log("Error connecting to database");
		throw (err);
	}
	app.db = client.db(dbName);
	app.set('db', client.db(dbName));

	// init routers.
	new AppRouter(app);

	app.server.listen(process.env.PORT || PORT, () => {
	        console.log(`App is running on port ${app.server.address().port}`);
	});

});



export default app;
