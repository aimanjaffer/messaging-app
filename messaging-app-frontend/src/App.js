import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomeComponent from './HomeComponent';
import LoginComponent from './LoginComponent';
import React, { useState } from "react";
function App() {
  const [isUserLoggedIn, setUserLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  function callbackOnLoginSubmission(usernameFromLoginComponent, isLoginSuccessful){
    setUserLoggedIn(isLoginSuccessful);
    setUsername(usernameFromLoginComponent);
  }
  return (isUserLoggedIn? <HomeComponent loggedInUser={username}/> : <LoginComponent callback={callbackOnLoginSubmission}/>);
}

export default App;
