import _ from 'lodash';
import bcrypt from 'bcrypt';

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