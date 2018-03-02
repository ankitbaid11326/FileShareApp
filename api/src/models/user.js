import _ from 'lodash';
import bcrypt from 'bcrypt';
import Auth from './auth';
import {ObjectID} from 'mongodb';

const saltRounds = 10;

class User{

    constructor(app){
        this.app = app;
        
        this.model = {
            name: null,
            email: null,
            password: null,
            created: new Date(),
            updated: null,
        }

        this.findUserByEmail = this.findUserByEmail.bind(this);
        this.login = this.login.bind(this);
        this.findById = this.findById.bind(this);
    }

    findById(id, callback = () => {}){
        const db = this.app.db;
        const query = {
            _id: new ObjectID(id)
        }
        db.collection('users').find(query).limit(1).toArray((err, result) => {
            const user = _.get(result, '[0]');
            if(err === null && user){
                
                delete user.password;

                return callback(null, user);
            }
            const error = {message: 'User not found'};
            return callback(error, null);
        });
    }

    login(email, password, callback = () => {}){
        const app = this.app;
        let error = null;
        let user = {name: 'A', email: 'test@gmail.com'};

        if(!email || !password){
            console.log('working in line 30');
            error = {message: 'Email or Password is required'};
            return callback(error, null);
        }

        this.findUserByEmail(email, (err, user) => {
            console.log('working in line 36');
            if(err === null && user){
                const passwordCheck = bcrypt.compareSync(password, user.password);
                
                if(passwordCheck){
                    // create a new JSON web token and return it to user, so user can use it for later requests.
                    const auth = new Auth(app);
                    auth.createToken(user, null, (err, token) => {

                        if(err){
                            error = {message: 'An error login to your account'};
                            return callback(err, null);
                        }
                        
                        delete user.password;
                        token.user = user;
                        return callback(null, token);
                    })

                }else{
                    error = {message: 'Password does not match'};
                    return callback(error, null);
                }
            }

            if(err || !user){
                error = {message: 'An error login to your account'};
                return callback(error, null);
            }

        })
    }

    initWithObject(obj){
        this.model.name = _.trim(_.get(obj, 'name', null));
        this.model.email =  _.toLower(_.trim(_.get(obj, 'email', null)));
        this.model.password = _.get(obj, 'password', null);
        return this;
    }

    validate(callback = () => {}){
        let errors = [];
        const model = this.model;
        if(model.password.length < 3){
            errors.push({
                message: 'password should more then 3 characters long.'
            })
        }


        this.findUserByEmail(model.email, (err, user) => {
            console.log('query done');
            console.log(user);
            if(err || user){
                errors.push({message: 'Email is alreay in use.'})
            }
            return callback(errors);
        }); 
    }

    findUserByEmail(email =  null, callback = () => {}){
        const db = this.app.db;
        const query = {
            email: email
        };
        console.log(query);

        db.collection('users').find(query).limit(1).toArray((err, result) => {
            return callback(err, _.get(result, '[0]', null));
        });
    }

    create(callback){

        let model = this.model;
        const db = this.app.db;

        const hashPassword = bcrypt.hashSync(model.password, saltRounds);
        model.password = hashPassword;

        this.validate((errors) => {
            
            let messages = [];
            if(errors.length > 0){
                
                _.each(errors, (err) => {
                    messages.push(err.message);
                });

                return callback(_.join(messages, ','), null);
            }
            db.collection('users').insertOne(model, (err, result) => {
                return callback(err, model);
            });

        });

        
    }

}

export default User;