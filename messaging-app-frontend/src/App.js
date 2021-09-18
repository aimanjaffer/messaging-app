import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import HomeComponent from './HomeComponent';
import LoginComponent from './LoginComponent';
import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SignUpComponent from './SignUpComponent';
function App() {
  const [isUserLoggedIn, setUserLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [signUpFormVisible, setsignUpFormVisible] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  function callbackOnLoginSubmission(usernameFromLoginComponent, isLoginSuccessful){
    setUserLoggedIn(isLoginSuccessful);
    setUsername(usernameFromLoginComponent);
    
  }
  function callbackOnSignUpFormSubmission(signUpSuccessful){
    //console.log("sign up successful? ", signUpSuccessful);
    if(signUpSuccessful){
      setsignUpFormVisible(false);
      setSignUpSuccess(true);
    }
  }
  function logout(){
    setUserLoggedIn(false);
    setUsername('');
  }
  return (
    <>
    {isUserLoggedIn? <HomeComponent logoutCallback ={logout} loggedInUser={username}/> : 
    <Container className="align-items-center border">
    <LoginComponent callback={callbackOnLoginSubmission}/>
    <Row className="my-5">
      <Col md={4}><p>New User? Create an account now: </p></Col>
      <Col md={2}><Button variant="dark" onClick={()=> setsignUpFormVisible((val)=> !val)}>Toggle Sign Up Form</Button></Col>
      </Row>
    {signUpFormVisible && <SignUpComponent callback={callbackOnSignUpFormSubmission}/>}
    {signUpSuccess && <p>Your Account was successfully created! Please Login using your username.</p>}
    </Container>
    }
    
    </>
    );
}

export default App;
