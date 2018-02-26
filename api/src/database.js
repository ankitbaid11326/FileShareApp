import {MongoClient} from 'mongodb';
import {mongodbURL} from './config';

// export const connect = (callback) => {
//	// MONGODB VERSION 2.x
// 	MongoClient.connect(url, (err, client) => {
// 		const db = client.db()
// 		return callback(err, db);
// 	});
//
// }
exports.connect = (cb) => {

	// MONGODB VERSION 3.x
	MongoClient.connect(mongodbURL, (err, client) => {
		if(err)
			throw err;
		else{
			return cb(err, client);
		}
	});

}
