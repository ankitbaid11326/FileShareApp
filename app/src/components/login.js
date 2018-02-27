import React,{Component} from 'react';

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
            }
        }
        this._onSubmit = this._onSubmit.bind(this);
        this._onTextFieldChange = this._onTextFieldChange.bind(this);

    }

    _onSubmit(event){
        const {isLogin} = this.state;
        event.preventDefault();

    }

    _onTextFieldChange(e){
        let {user} = this.state;

        const fieldName = e.target.name;
        const fieldValue = e.target.value;

        user[fieldName] = fieldValue;
        this.setState({ user: user });
    }

    render(){

        const {isLogin, user} = this.state;

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
                                <div className={'app-form-item'}>
                                    <label htmlFor={'name-id'}>Enter Name </label>
                                    <input value={user.name} onChange={this._onTextFieldChange} placeholder={'Enter name'} type={'text'} id={'name-id'} name={'name'} />
                                </div>
                            </div> : null
                        }
                        <div className={'app-form-item'}>
                            <label htmlFor={'email-id'}> Email </label>
                            <input value={user.email} onChange={this._onTextFieldChange} placeholder={'Enter Email'} type={'email'} id={'email-id'} name={'email'} />
                        </div>
                        
                        <div className={'app-form-item'}>
                            <label htmlFor={'password-id'}> Password </label>
                            <input value={user.password} onChange={this._onTextFieldChange} placeholder={'Enter Password'} type={'password'} id={'password-id'} name={'password'} />
                        </div>

                        {
                            !isLogin ? <div> 
                                <div className={'app-form-item'}>
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