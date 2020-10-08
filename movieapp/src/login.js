import React, { Component } from "react";
import axios from "axios";
import './login.css';
import Spinner from 'react-bootstrap/Spinner';
import {loggedIn} from './action'
import { connect } from 'react-redux'


function mapDispatchToProps(dispatch){
    return {
     loggedIn: () => dispatch(loggedIn())
    };
 }

class login extends Component {
    constructor() {
        super();

        this.state = {
            username: "",
            password: "",
            errorMsg: "",
            renderError: false,
            loading: false
        };
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }


    handleUserNameChange = event => {
        this.setState({ username: event.target.value });
    }

    handlePasswordChange = event => {
        this.setState({ password: event.target.value });
    }

    handleFormSubmit = event => {
        event.preventDefault();

        const endpoint = "http://localhost:8080/authenticate";

        const username = this.state.username;
        const password = this.state.password;

        const user_object = {
            username: username,
            password: password
        };
        this.setState({loading:true,renderError:false});
        axios.post(endpoint, user_object).then(res => {
            //console.log("Session token" + res.data.token);
            sessionStorage.setItem("authorization", res.data.token);
            return this.handleDashboard();
        }).catch(error => {
            this.setState({ errorMsg: error.response.data, renderError: true,loading:false });
        }
        ).finally(()=>{
            this.setState({loading:false});
        });
    };

    

    handleDashboard() {
      
        axios.get("http://localhost:8080/movie/dashboard").then(res => {
            if (res.data === "success") {
                this.props.loggedIn();
                this.props.history.push("/Entry");
            }
        });
    }

    render() {
        return (
            <div>
                <div class="wrapper">
                    <form class="form-signin" onSubmit={this.handleFormSubmit}>
                        <h2 class="form-signin-heading">Please Login</h2>
                        <div className="form-group">
                            <input type="text"
                                class="form-control"
                                placeholder="User Name"
                                value={this.state.username}
                                onChange={this.handleUserNameChange}
                            />
                        </div>
                        <div className="form-group">
                            <input type="password"
                                class="form-control"
                                placeholder="Password"
                                value={this.state.password}
                                onChange={this.handlePasswordChange}
                            />
                        </div>
                        <button class="btn btn-lg btn-primary btn-block" type="submit">
                            Login
                         </button>
                    </form>
                </div>
                {this.state.loading? <div className="loadSpinner"><Spinner animation="border" variant="secondary" /><span>Loading...</span></div>:null}
                {this.state.renderError ? <div className="loginError"><ul><li>{this.state.errorMsg}</li></ul></div> : null}
            </div>
        );
    }
}
export default connect(null,mapDispatchToProps)(login);