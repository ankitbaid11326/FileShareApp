import {ObjectID} from 'mongodb';
import _ from 'lodash';

class Auth{

    constructor(app){
        
        this.app = app;
        
        this.model = {
            userId: null,
            expire: null,
        }

        this.createToken = this.createToken.bind(this); 
    }
    
    createToken(user, expire = null, cb = () => {}){
        
        let model = this.model; 
        const db = this.app.db;

        model.userId = user._id;
        model.expire = expire;

        db.collection('tokens').insertOne(model, (err, token) => {

            return cb(err, model);

        });
    }

    checkAuth(req, callback = () => {}){

        const token = req.get('authorization');

        if(!token){
            return callback(false);
        }

        const db = this.app.db;

        const query = {
            _id: new ObjectID(token)
        }

        db.collection('tokens').find(query).limit(1).toArray((err, tokenObjects) => {
            const tokenObj = _.get(tokenObjects, '[]', null);
            if(err === null && tokenObj){
                return callback(true);
            }
        });
    }



}

export default Auth;