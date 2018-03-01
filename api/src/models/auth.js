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



}

export default Auth;