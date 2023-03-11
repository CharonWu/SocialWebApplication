import React from 'react';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import {useNavigate} from "react-router-dom";
import Toast from "./Toast";

import url from "./URLUtility";

class Signin extends React.Component{

    constructor(props) {
        super(props);
        this.signinWithGoogle = this.signinWithGoogle.bind(this);
    }

    async signinWithGoogle () {

        const requestOptions = {
            method: 'get',
            credentials: 'include'};
        let response = await fetch(url + '/auth/google', requestOptions).then(response => {
            if (!response.ok) {
                return 'failed';
            } else {
                return response.json();
            }
        });
    }

    render(){
        return (
            <div >
                <form onSubmit={this.props.login} method={'post'}>
                    <div className={'container'}>
                        <div className={'row'}>
                            <div className={'col'}>User Name:</div>
                            <div className={'col'}>
                                <input name={'username'} onChange={this.props.updateState} value={this.props.userName} required={true}/>
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className={'col'}>Password:</div>
                            <div className={'col'}>
                                <input name={'password'} onChange={this.props.updateState} value={this.props.password} type={'password'} required={true}/>
                            </div>
                        </div>
                        <div className={'row'}>
                            <button className={'btn btn-primary'} id="liveToastBtn">Login</button>
                        </div>
                        <div className={'row'}>
                        </div>
                    </div>
                </form>
                {/*<button  className={'btn'}onClick={this.signinWithGoogle} >Sign In  with Google</button>*/}
<a href={url+'/auth/google'}>sign in with Google</a>
            </div>
        );
    }
}

class Registration extends React.Component {

    render(){
        return (
            <div>
                <form onSubmit={this.props.submit} method={'post'}>
                    <div className={'container'}>
                        <div className={'row'}>
                            <div className={'col'}>
                                <label>User Name:</label>
                            </div>
                            <div className={'col'}><input required={true} name={'registerUsername'} onChange={this.props.updateState} value={this.props.registerUsername}/></div>
                        </div>
                        <div className={'row'}>
                            <div className={'col'}>
                                <label>Email:</label>
                            </div>
                            <div className={'col'}><input required={true} name={'email'} onChange={this.props.updateState} value={this.props.email}/></div>
                        </div>
                        <div className={'row'}>
                            <div className={'col'}>
                                <label>Zipcode:</label>
                            </div>
                            <div className={'col'}><input required={true} name={'zipcode'} onChange={this.props.updateState} value={this.props.zipcode}/></div>
                        </div>
                        <div className={'row'}>
                            <div className={'col'}>
                                <label>Birthday:</label>
                            </div>
                            <div className={'col'}><input required={true} name={'birthday'} onChange={this.props.updateState} value={this.props.birthday} type={"date"}/></div>
                        </div>
                        <div className={'row'}>
                            <div className={'col'}>
                                <label>Password:</label>
                            </div>
                            <div className={'col'}><input required={true} name={'registerPassword'} onChange={this.props.updateState} value={this.props.registerPassword} type={'password'}/></div>
                        </div>
                        <div className={'row'}>
                            <div className={'col'}>
                                <label>Confirm Password:</label>
                            </div>
                            <div className={'col'}><input required={true} name={'confirmPassword'} onChange={this.props.updateState} value={this.props.confirmPassword} type={'password'}/></div>
                        </div>
                        <div className={'row'}>
                            <button className={'btn btn-primary'}>Sign Up</button>
                        </div>
                    </div>
                </form>

            </div>


        );
    }
}

class Landing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loginType: "signin", username: "", password: "", registerUsername: "", email: "", zipcode: "", birthday: "",confirmPassword: "", registerPassword: "", toast: "",toastMessage:""};
        this.changeSignPage = this.changeSignPage.bind(this);
        this.login = this.login.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.signUp = this.signUp.bind(this);
        this.closeToast = this.closeToast.bind(this);
        this.checkNameAndPassword = this.checkNameAndPassword.bind(this);
        this.checkName = this.checkName.bind(this);
    }

    closeToast(){
        this.setState({toast:"", toastMessage:""});
    }


    async signUp(e) {

        e.preventDefault();


        let validate = true;
        let toastMessage = "";

        if (this.state.registerUsername !== "") {
            const regex = new RegExp("^[a-zA-Z][a-zA-Z0-9]*");
            if (regex.test(this.state.registerUsername)) {
            } else {
                validate = false;
                toastMessage += "Username can only contain digits and alphabets. The first character must be an alphabet.\n"
            }
            if (await this.checkName(this.state.registerUsername)) {
                validate = false;
                toastMessage += "Username had been registered.\n";
            }

            if (validate)
                this.setState({username: this.state.updateUsername});

        }
        if (this.state.email !== "") {
            const regex = new RegExp("^[0-9a-zA-Z_]+@[0-9a-zA-Z_]+\.[a-zA-Z]+");
            if (regex.test(this.state.email)) {

            } else {
                validate = false;
                toastMessage += "Please use a valid email.";
            }

        }
        if (this.state.zipcode !== "") {
            const regex = new RegExp("^[0-9]{5}$");
            if (regex.test(this.state.zipcode)) {

            } else {
                validate = false;
                toastMessage += "Please use a 5-digit zipcode.\n";
            }


        }
        if (this.state.birthday !== "") {
            // const regex = new RegExp("^[0-9]{3}-[0-9]{3}-[0-9]{4}$");
            // if (regex.test(this.state.phone)) {
            //
            // }

        }else {
            validate = false;
            toastMessage += "Please use a valid birthday.\n";
        }

        if (this.state.registerPassword !== "" && this.state.confirmPassword === this.state.registerPassword) {
            this.setState({password: this.state.registerPassword});

        } else {
            validate = false;
            toastMessage += "Passwords do not match!.\n";
        }


        if (validate){
            const requestOptions = {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({username: this.state.registerUsername, password: this.state.registerPassword, email:this.state.email, zipcode:this.state.zipcode, dob: this.state.birthday})
            };
            let response = await fetch(url+'/register', requestOptions).then(response => {
                if( !response.ok ){
                    return 'failed';
                } else {
                    return response.json();
                }
            });

            if (response.result==='registered') {
                this.setState({toast: "show", toastMessage: "Username has been registered."});
            }else{
                this.setState({toast: "show", toastMessage: "Registration success."});
            }

            // this.props.navigate("/main", {state: this.state});

        }
        else {
            this.setState({toast: "show", toastMessage: toastMessage});
        }
    }

    async checkName(username) {
        let response = await fetch('https://jsonplaceholder.typicode.com/users').then(response => response.json())

        let index = response.findIndex(value => value.username === username);
        if (index > -1 ) {
            return true;
        }

        return false;
    }

    async checkNameAndPassword(username, password) {

        const requestOptions = {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({username: this.state.username, password: this.state.password})
        };
        let response = await fetch(url+'/login', requestOptions).then(response => {
            if( !response.ok ){
                return 'failed';
            } else {
                return response.json();
            }
        });


        if (response === 'failed') {
            return false;
        }

        return true;


    }

    async login(e) {
        e.preventDefault();
        let result = await this.checkNameAndPassword(this.state.username, this.state.password);
        if (result) {
            this.props.navigate("/main", {state: this.state});
        } else {
            this.setState({toastMessage: "Username and password do not match!"})
            this.setState({toast: "show"});
        }
    }

    changeSignPage(e) {
        if(e.target.name==="signin")
            this.setState({loginType: "signin"});
        else
            this.setState({loginType: "signup"});

    }

    handleInputChange(e){
        this.setState({[e.target.name]: e.target.value})
    }

    render(){

        const formPage = this.state.loginType==="signin"?
            <Signin updateState={this.handleInputChange} password={this.state.password} userName={this.state.userName} login={this.login}/>:
            <Registration updateState={this.handleInputChange} registerUsername={this.state.registerUserName} email={this.state.email} zipcode={this.state.zipcode} birthday={this.state.birthday} registerPassword={this.state.registerPassword} confirmPassword={this.state.confirmPassword} submit={this.signUp}/>;

        return (
            <div className={'landing'}  >
                <div className={'container-fluid'}>
                    <div className={'row'}>
                        <div className={'btn-group'}>
                            <button className={'btn btn-outline-primary'} name={"signin"} onClick={this.changeSignPage} >Sign In</button>
                            <button className={'btn btn-outline-secondary'} name={"signup"} onClick={this.changeSignPage}>Sign Up</button>
                        </div>
                    </div>
                    <div className={'row'}>
                        <h1>{this.state.loginType}</h1>
                    </div>
                    <div>
                        {formPage}
                    </div>
                    <Toast closeToast={this.closeToast} toastMessage={this.state.toastMessage} toast={this.state.toast}/>
                </div>
            </div>

        );
    }
}


export function LandingView() {
    return (
        <Landing navigate={useNavigate()} />
    ) ;
};