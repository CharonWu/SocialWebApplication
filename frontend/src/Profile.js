import React from 'react';

import "bootstrap/dist/css/bootstrap.min.css";

import "bootstrap/dist/js/bootstrap.bundle.min";
import {useLocation, useNavigate} from "react-router-dom";
import Toast from "./Toast";
import url from "./URLUtility";


class UpdateView extends React.Component{

    render() {
        return (
            <div>
                <form method={'post'}>
                    <div className={'container'}>
                        <div className={'row'}>
                            <h2>Update Info</h2>
                        </div>
                        {/*<div className={'row'}>*/}
                        {/*    <div className={'col'}>Username:</div>*/}
                        {/*    <div className={'col'}><input placeholder={"Sam"}  name={'updateUsername'} value={this.props.updateData.updateUsername} onChange={this.props.updateState}/></div>*/}
                        {/*</div>*/}
                        <div className={'row'}>
                            <div className={'col'}>Email:</div>
                            <div className={'col'}><input placeholder={"abc@example.com"} name={'updateEmail'}
                                                          value={this.props.updateData.updateEmail}
                                                          onChange={this.props.updateState}/></div>
                        </div>
                        <div className={'row'}>
                            <div className={'col'}>Zipcode:</div>
                            <div className={'col'}><input placeholder={"00000"} name={'updateZipcode'}
                                                          value={this.props.updateData.updateZipcode}
                                                          onChange={this.props.updateState}/></div>
                        </div>
                        {/*<div className={'row'}>*/}
                        {/*    <div className={'col'}>Phone:</div>*/}
                        {/*    <div className={'col'}><input placeholder={"000-000-0000"} name={'updatePhone'} value={this.props.updateData.updatePhone} onChange={this.props.updateState}/></div>*/}
                        {/*</div>*/}
                        <div className={'row'}>
                            <div className={'col'}>New Password:</div>
                            <div className={'col'}><input name={'updateNewPassword'}
                                                          value={this.props.updateData.updateNewPassword}
                                                          onChange={this.props.updateState} type={'password'}/></div>
                        </div>
                        <div className={'row'}>
                            <div className={'col'}>Confirm Password:</div>
                            <div className={'col'}><input name={'updateConfirmPassword'}
                                                          value={this.props.updateData.updateConfirmPassword}
                                                          onChange={this.props.updateState} type={'password'}/></div>
                        </div>
                        <div className={'row'}>
                            <button onClick={this.props.updateProfile} className={'btn btn-primary'}>Update</button>
                        </div>
                    </div>

                </form>
                {this.props.userType==="local"?<div/>:<div className={'vstack'}>
                    <input name={'linkUsername'} value={this.props.linkUsername} onChange={this.props.updateState}/>
                    <input type={'password'} name={'linkPassword'} value={this.props.linkPassword} onChange={this.props.updateState}/>
                    <button className={'btn btn-primary'} onClick={this.props.link}>link</button>
                </div>}

            </div>
        );
    }

}

class InfoView extends React.Component{

    render() {
        return (
            <div>
                <div className={'container'}>
                    <div className={'row'}>
                        <h2>User Info</h2>
                    </div>
                    <div className={'row'}>
                        <div className={'col-4'}>Username:</div>
                        <div className={'col-8'}><label className={'text-center '}>{this.props.updateData.username}</label></div>
                    </div>
                    <div className={'row'}>
                        <div className={'col-4'}>Email:</div>
                        <div className={'col-8'}><label>{this.props.updateData.email}</label></div>
                    </div>
                    <div className={'row'}>
                        <div className={'col-4'}>Zipcode:</div>
                        <div className={'col-8'}><label>{this.props.updateData.zipcode}</label></div>
                    </div>
                    {/*<div className={'row'}>*/}
                    {/*    <div className={'col-4'}>Phone:</div>*/}
                    {/*    <div className={'col-8'}><label>{this.props.updateData.phone}</label></div>*/}
                    {/*</div>*/}
                    <div className={'row'}>
                        <div className={'col-4'}>Birthday:</div>
                        <div className={'col-8'}><label>{new Date(this.props.updateData.birthday).toLocaleDateString()}</label></div>
                    </div>
                    <div className={'row'}>
                        <div className={'col-4'}>Password:</div>
                        <div className={'col-8'}><label>{this.props.updateData.password}</label></div>
                    </div>
                </div>
            </div>
        );
    }

}

class MainPageNavigator extends React.Component{


    render() {

        return (
          <div>
              <button className={'btn btn-secondary'} onClick={this.props.goToMain}>Main Page</button>
          </div>
        );
    }
}

class AvatarView extends React.Component{

    constructor(props) {
        super(props);
        this.state={avatar:"", avatarFile:null};
        this.uploadAvatar = this.uploadAvatar.bind(this);
        this.changeAvatar = this.changeAvatar.bind(this);
    }

    changeAvatar(e){
        this.setState({avatarFile: e.target.files[0]});
    }

    uploadAvatar(){
        const fd = new FormData();

        fd.append('avatar', this.props.username+'-avatar');
        fd.append('image', this.state.avatarFile);

        const requestOptions = {
            method: 'put',
            credentials: 'include',
            body: fd
        };
        fetch(url+'/avatar', requestOptions).then(response=>response.json()).then(response=>{

            this.setState({avatar: response.avatar});
        });

    }

    componentDidMount() {
        const requestOptions = {
            method: 'get',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        };
        fetch(url+'/avatar', requestOptions).then(response=>response.json()).then(response=>{
            this.setState({avatar: response.avatar});
        })
    }


    render() {
        return (
            <div className={'container'}>
                <div className={'row'}>
                    <div className={'col-4'}/>
                    <div className={'col-4'}>
                        <img src={this.state.avatar} className={"img-thumbnail"} alt="..." style={{width: "140px", hieght: "140px"}}/>
                    </div>
                    <div className={'col-4'}/>
                </div>
                <div className={'row'}>
                    <div className="input-group mb-3">
                        <input className={' form-control'} name={"avatarFile"} type="file" accept="image/*" onChange={this.changeAvatar}/>
                    </div>
                    <button className="btn btn-primary" onClick={this.uploadAvatar}>Upload new image</button>

                </div>
            </div>
        );
    }
    
}

class ProfileView extends React.Component{

    constructor(props) {
        super(props);
        this.state={username:"", email:"", zipcode:"", birthday:"", password:"******", userType:"local", linkUsername:"", linkPassword:"",
            updateUsername: "", updateEmail:"",updateZipcode:"",updatePhone:"", updateNewPassword:"", updateConfirmPassword:"", toast:"", toastMessage:""};
        this.toMainPage = this.toMainPage.bind(this);
        this.onSubmit=this.onSubmit.bind(this);
        this.handleUpdateDataChange = this.handleUpdateDataChange.bind(this);
        this.closeToast = this.closeToast.bind(this);
        this.link = this.link.bind(this);
    }

    closeToast(){
        this.setState({toast:"", toastMessage:""});
    }

    async link() {


        let toastMessage = "";
        const requestOptions = {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({linkUsername: this.state.linkUsername, linkPassword: this.state.linkPassword})

        };
        await fetch(url + '/link', requestOptions).then(response => {
            if (response.ok) {
                const reop = {method: 'get',credentials: 'include'};
                fetch(url+'/email', reop).then(response => response.json()).then(response=>this.setState({username: response.username, email:response.email}));
                fetch(url+'/zipcode', reop).then(response => response.json()).then(response=>this.setState({zipcode:response.zipcode}));
                fetch(url+'/dob', reop).then(response => response.json()).then(response=>this.setState({birthday:response.dob}));
                toastMessage = "Link success!"
                this.setState({userType: "local"});
            } else {
                toastMessage = "Link failed!"
            }
        });

        this.setState({toast: "show", toastMessage: toastMessage});

    }

    componentDidMount() {
        // this.setState(this.props.location.state);
        const requestOptions = {method: 'get',credentials: 'include'};
        fetch(url+'/email', requestOptions).then(response => response.json()).then(response=>this.setState({username: response.username, email:response.email}));
        fetch(url+'/zipcode', requestOptions).then(response => response.json()).then(response=>this.setState({zipcode:response.zipcode}));
        fetch(url+'/dob', requestOptions).then(response => response.json()).then(response=>this.setState({birthday:response.dob}));
        fetch(url+'/userType', requestOptions).then(response => response.json()).then(response=>this.setState({userType:response.type}));
    }

    toMainPage() {
        this.props.navigate("/main", {state: this.state});
    }

    handleUpdateDataChange(e){
        this.setState({[e.target.name]: e.target.value});
    }

    async onSubmit(e) {
        e.preventDefault();
        let toastMessage = "";
        if (this.state.updateUsername !== "") {
            const regex = new RegExp("^[a-zA-Z][a-zA-Z0-9]*");
            if (regex.test(this.state.updateUsername)) {
                this.setState({username: this.state.updateUsername});
                this.setState({updateUsername: ""});
            } else {
                toastMessage += "Username can only contain digits and alphabets. The first character must be an alphabet.\n"
            }

        }
        if (this.state.updateEmail !== "") {
            const regex = new RegExp("^[0-9a-zA-Z_]+@[0-9a-zA-Z_]+\.[a-zA-Z]+");
            if (regex.test(this.state.updateEmail)) {

                let requestOptions = {
                    method: 'put',
                    headers: {'Content-Type': 'application/json'},
                    credentials: 'include',
                    body: JSON.stringify({email: this.state.updateEmail})
                };
                await fetch(url + '/email', requestOptions).then(response => response.json()).then(res => {
                    this.setState({email: res.email});
                    this.setState({updateEmail: ""});
                    toastMessage += "Email has changed!\n";
                });


            } else {
                toastMessage += "Please use a valid email.";
            }

        }
        if (this.state.updateZipcode !== "") {
            const regex = new RegExp("^[0-9]{5}$");
            if (regex.test(this.state.updateZipcode)) {

                let requestOptions = {
                    method: 'put',
                    headers: {'Content-Type': 'application/json'},
                    credentials: 'include',
                    body: JSON.stringify({zipcode: this.state.updateZipcode})
                };
                await fetch(url + '/zipcode', requestOptions).then(response => response.json()).then(res => {
                    this.setState({zipcode: res.zipcode});
                    this.setState({updateZipcode: ""});
                    toastMessage += "Zipcode has changed!\n";
                });

            } else {
                toastMessage += "Please use a 5-digit zipcode.\n";
            }

        }
        if (this.state.updatePhone !== "") {
            const regex = new RegExp("^[0-9]{3}\-[0-9]{3}\-[0-9]{4}$");
            if (regex.test(this.state.updatePhone)) {
                this.setState({phone: this.state.updatePhone});
                this.setState({updatePhone: ""});
            } else {
                toastMessage += "Please use a valid phone number.\n";
            }

        }
        if (this.state.updateNewPassword !== "") {
            if (this.state.updateNewPassword === this.state.updateConfirmPassword) {
                let requestOptions = {
                    method: 'put',
                    headers: {'Content-Type': 'application/json'},
                    credentials: 'include',
                    body: JSON.stringify({password: this.state.updateNewPassword})
                };
                await fetch(url + '/password', requestOptions).then(response =>{
                    if (response.ok) {
                        return "Password has changed!\n"
                    } else if (response.status === 401) {
                        return "You cannot change password!\n";
                    } else {
                        return "Password change failed.\n"
                    }
                } ).then(res => {
                    toastMessage += res;
                });
            } else {
                toastMessage += "Passwords do not match!\n";
            }
            this.setState({updateNewPassword: ""});
            this.setState({updateConfirmPassword: ""});

        }
        this.setState({toast: "show", toastMessage: toastMessage});
    }


    render() {
        return(
          <div>
              <div className={'container'}  style={{marginTop: "2%"}}>
                  <div className={'row'}>
                      <div className={'col'}>
                          <div className={'container p-4  border-white bg-gradient rounded-4'}>
                              <div className={'row'}>
                                  <MainPageNavigator goToMain={this.toMainPage} />
                              </div>
                              <div className={'row'}>
                                  <AvatarView username={this.state.username}/>
                              </div>
                              <div className={'row'}>
                                  <InfoView updateData={this.state}/>
                              </div>
                          </div>
                      </div>
                      <div className={'col  p-4  border-white bg-gradient rounded-4'}>
                          <UpdateView link={this.link} linkUsername={this.state.linkUsername} linkPassword={this.state.linkPassword} userType={this.state.userType} updateData={this.state} updateState={this.handleUpdateDataChange}  updateProfile={this.onSubmit}/>
                      </div>
                  </div>
              </div>
              <Toast closeToast={this.closeToast} toastMessage={this.state.toastMessage} toast={this.state.toast}/>
          </div>
        );
    }
}

export function Profile(){
    return(
        <ProfileView navigate={useNavigate()} location={useLocation()}/>
    );
}