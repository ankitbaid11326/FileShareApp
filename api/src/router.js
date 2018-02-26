import path from 'path';
import _ from 'lodash';
import {ObjectID} from 'mongodb';

import {version} from '../package.json';
import File from './models/file';
import Post from './models/post';
import FileArchiver from './archiver';
import Email from './email';

class AppRouter{

	constructor(app){
		this.app = app;
		this.setupRouters();
	}

	setupRouters(){

		const app = this.app;
		const db = app.get('db');
		const uploadDir = app.get("storageDir");
		const upload = app.upload;

		app.get('/', (req, res, next) => {
			return res.status(200).json({
				version
			});
		});

		// UPLOAD ROUTING
		app.post('/api/upload', upload.array('files'), (req, res, next) => {
			const files = _.get(req, 'files', []);

			let fileModels = [];

			_.each(files, (fileObject) => {
				const newFile = new File(app).initWithObject(fileObject).toJSON();
				fileModels.push(newFile);
			});

			if(fileModels.length){

				db.collection('files').insertMany(fileModels, (err, result) => {
					if(err){
						return res.status(503).json({
							error: {
								message: "Unable to save file"
							}
						});
					}

					let post = new Post(app).initWithObject({

						from: _.get(req, 'body.from'),
						to: _.get(req, 'body.to'),
						message: _.get(req, 'body.message'),
						files: result.insertedIds,

					}).toJSON();

					// let save post object to posts collections.
					db.collection('posts').insertOne(post, (err, result) => {
						if(err){
							return res.status(503).json({error: {message: 'Your Upload could not be saved'}});
						}
						//implement email sending to user with download link
						
						//send email
						const sendEmail = new Email(app).sendDownloadLink(post, (err, info) => {

						});
						// sendEmail.sendDownloadLink(post, (err, info) => {
						// 	if(err){
						// 		console.log("An error sending email notify download link", err);
						// 	}
						// });

						// callback to react app with post details.
						return res.json(post);
					});

					console.log("user request via api/upload with data", req.body, result);

	
				})

			}else{
				return res.status(503).json({
					error: { message: "Files upload is required" }
				})
			}
		});

		// DOWNLOAD ROUTES
		app.get('/api/download/:id', (req, res, next) => {
			const fileId = req.params.id;

			db.collection('files').find({_id: ObjectID(fileId)}).toArray((err, result) => {

				const fileName = _.get(result, '[0].name');

				if(err || !fileName){
					return res.status(404).json({
						error: {
							message: "File Not found"
						}
					})
				}

				const filePath = path.join(uploadDir, fileName);
				// return res.download(filePath, fileName, (err) => {
				return res.download(filePath, _.get(result, '[0].originalName'), (err) => {
					if(err){
						return res.status(404).json({
							error: {
								message: "File not found"
							}
						});
					}else{
						console.log("File not found");
					}
				})
			})
		});

		// Routing download zip files
		app.get('/api/posts/:id/download', (req, res, next) => {
			const id = _.get(req, 'params.id', null);
			console.log(id);
			this.getPostById(id, (err, result) => {
				if(err){
					return res.status(404).json({error: {message: 'File not found'}});
				}
				
				const files = _.get(result, 'files', []);
				const archiver = new FileArchiver(app, files, res).download();

				return archiver;

			})
		});

		// POST DETAILS ROUTER -> /api/post/:id
		app.get('/api/posts/:id', (req, res, next) => {
			
			const postId = _.get(req, 'params.id');
			this.getPostById(postId, (err, result) =>{
				if(err){
					return res.status(404).json({error: {message: 'File not found'}});
				}
					return res.json({result});
			});
		});


	}

	getPostById(id, callback = () => {}){
		
		const app = this.app;
		const db = app.get('db');

		let postObjectId = null;
		try{
			postObjectId = new ObjectID(id);
		}catch (err){
			return callback(err, null);
		}

		db.collection('posts').find({_id: postObjectId}).limit(1).toArray((err, results) => {
			let result = _.get(results, '[0]');
			
				if(err || !results){
					return callback(err ? err : new Error('File not found'));
				}

				const fileIds = _.get(result, 'files', []);
				console.log(fileIds);
				db.collection('files').find({_id: {$in: Object.values(fileIds)}}).toArray((err, files) => {

					if(err || !files || !files.length){
						return callback(err ? err : new Error('File not found'));
					}

					result.files = files;
					console.log(result);

					return callback(null, result);

				});
		});
	}


}

export default AppRouter;