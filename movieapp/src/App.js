import React, { Component } from 'react';
import './App.css';
import Landing from './components/landing/landing';
import View from './components/View/View';
import { Route, Switch } from "react-router-dom"
import Container from 'react-bootstrap/Container';
import { Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import interceptors from "./interceptors";
import { Redirect } from "react-router-dom";
import login from "./login";
import { connect } from 'react-redux'

const mapStateToProps = (state) => {
  return {
     flag: state
  };
};

class App extends Component {

  constructor(props){
    super(props);
  }

  render() {
    
    return (

      <div>
        <Navbar bg="light" sticky="top">
          <Navbar.Brand className="Brand">
            MovieApp
           
          </Navbar.Brand>
          <LinkContainer to="/Entry">
            <NavItem>Entry</NavItem>
          </LinkContainer>
          <LinkContainer to="/View">
            <NavItem className="ml-2">View</NavItem>
          </LinkContainer>
          <LinkContainer to="/about">
            <NavItem className="ml-2">About</NavItem>
          </LinkContainer>
            <NavItem className="ml-auto">{this.props.flag? <span>Admin is logged in</span>:null}</NavItem>
        </Navbar>
        <Switch>
          <React.Fragment>
            <Container className="container">
              <Route exact path="/" component={login} />
              <Route path="/Entry" component={Landing} exact />
              <Route path="/View" component={View} />
            </Container>
          </React.Fragment>
        </Switch>
      </div>

    );


  }



}


export default connect(mapStateToProps)(App);
