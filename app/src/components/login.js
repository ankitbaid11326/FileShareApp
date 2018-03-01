import React,{Component} from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import {isEmail} from '../helpers/email';
import {createUser} from '../helpers/user';

class LoginForm extends Component{
    
    constructor(props){
        super(props);

        this.state = {
            isLogin: true,
            user: {
                name: '',
                email: '',
                password: '',
                confirmPassword: ''
            },
            error: {
                name: null,
                email: null,
                password: null,
                confirmPassword: null,
            }
        }
        this._onSubmit = this._onSubmit.bind(this);
        this._onTextFieldChange = this._onTextFieldChange.bind(this);
        this._formValidation = this._formValidation.bind(this);

    }

    _formValidation(fieldsToValidate = [] ,callback = () => {}){
        const {isLogin, user, error} = this.state;

        const allFields = {
            name : {
                message: 'Your name is required',
                doValidate: () => {
                    const value = _.trim(_.get(user, 'name', ""));
                    if(value){
                        return true;
                    }
                    return false;
                }
            },
            email: {
                message: 'Email is required',
                doValidate: () => {
                    const value = _.get(user, 'email', '');
                    if(value.length > 0 && isEmail(value)){
                        return true;
                    }
                    return false;
                }
            },
            password: {
                message: 'Password should have more than 3 characters',
                doValidate: () => {
                    const value = _.get(user, 'password', '');
                    if(value && value.length > 3){
                        return true;
                    }
                    return false;
                }
            },
            confirmPassword: {
                message: 'Password does not match',
                doValidate: () => {
                    const passwordValue = _.get(user, 'password', '');
                    const value = _.get(user, 'confirmPassword', '');
                    if(passwordValue === value){
                        return true;
                    }
                    return false;
                }
            }
        }

        let errors = this.state.error;
        _.each(fieldsToValidate, (field) => {
            const fieldValidate = _.get(allFields, field);
            if(fieldValidate){
                
                errors[field] = null;
                const isFieldValid = fieldValidate.doValidate();
                if(isFieldValid === false){
                    errors[field] = _.get(fieldValidate, 'message');
                }
            }
        });

        this.setState({
            error: errors,
        }, () => {
            console.log('after process validation the form errors', errors);
            let isValid = true;
            _.each(errors, (err) => {
                if(err){
                    isValid = false;
                }
            });

            callback(isValid);

        });

    }

    _onSubmit(event){
        const {isLogin, user} = this.state;
        event.preventDefault();

        let fieldNeedToValidate = ['email', 'password'];

        if(!isLogin){
            fieldNeedToValidate = ['name', 'email', 'password', 'confirmPassword'];
        }


        this._formValidation(fieldNeedToValidate, (isValid) => {
            
            if(isValid){

                if(isLogin){
                    // login data to request
                }else{
                    createUser(this.state.user).then((response) => {
                        console.log('hey i got data after send post', response);
                    });
                }

            }

        });

    }

    _onTextFieldChange(e){
        let {user} = this.state;

        const fieldName = e.target.name;
        const fieldValue = e.target.value;

        user[fieldName] = fieldValue;
        this.setState({ user: user });
    }

    render(){

        const {isLogin, user, error} = this.state;
        const title = isLogin ? 'Sign In' : 'Sign Up';

        return(
            <div className={'app-login-form'}>
                <div className={'app-login-form-inner'}>
                    <button  onClick={ () => {
                            if(this.props.onClose){
                                this.props.onClose(true);
                            }
                    }} className={'app-dismiss-button'}> Close </button>
                    <h2 className={'form-title'}> {title} </h2>
                    <form onSubmit={this._onSubmit}>
                        {
                            !isLogin ? <div> 
                                <div className={classNames('app-form-item', {'error': _.get(error, 'name')})}>
                                    <label htmlFor={'name-id'}>Enter Name </label>
                                    <input value={user.name} onChange={this._onTextFieldChange} placeholder={'Enter name'} type={'text'} id={'name-id'} name={'name'} />
                                </div>
                            </div> : null
                        }
                        <div className={classNames('app-form-item', {'error': _.get(error, 'email')})}>
                            <label htmlFor={'email-id'}> Email </label>
                            <input value={user.email} onChange={this._onTextFieldChange} placeholder={'Enter Email'} type={'email'} id={'email-id'} name={'email'} />
                        </div>
                        
                        <div className={classNames('app-form-item', {'error': _.get(error, 'password')})}>
                            <label htmlFor={'password-id'}> Password </label>
                            <input value={user.password} onChange={this._onTextFieldChange} placeholder={'Enter Password'} type={'password'} id={'password-id'} name={'password'} />
                        </div>

                        {
                            !isLogin ? <div> 
                                <div className={classNames('app-form-item', {'error': _.get(error, 'confirmPassword')})}>
                                    <label htmlFor={'confirm-password-id'}>Confirm Password </label>
                                    <input value={user.confirmPassword} onChange={this._onTextFieldChange} placeholder={'Confirm Password'} type={'password'} id={'confirm-password-id'} name={'confirmPassword'} />
                                </div>
                            </div> : null
                        }

                        {
                            isLogin ?
                            <div className={'app-form-actions'}>
                                <button className={'app-button primary'}> Sign In </button>
                                <div className={'app-form-description'}>
                                    <div> Don't have an account ? 
                                    <button onClick={ () => {
                                        this.setState({
                                            isLogin: false
                                        });
                                    }} className={'app-button app-button-link'} type={'button'} > Sign Up </button> </div>
                                </div>
                            </div>
                            :<div className={'app-form-actions'}>
                                <button className={'app-button primary'}> Sign Up </button>
                                <div className={'app-form-description'}>
                                    <div> Don't have an account ? 
                                    <button onClick={ () => {
                                        this.setState({
                                            isLogin: true
                                        });
                                    }} className={'app-button app-button-link'} type={'button'} > Sign In </button> </div>
                                </div>
                            </div>
                        }

                    </form>

                </div>
            </div>

        )

    }

}

export default LoginForm;