import React from "react";
import { useForm } from "react-hook-form";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
function LoginComponent(props) {
    const { register, handleSubmit, formState: { errors }, getValues } = useForm();  
        
    const formSubmissionHandler = (e) => {
      let userName = getValues('usernameField');
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: userName})
      };
      fetch('https://messaging-app-server.azurewebsites.net/login', requestOptions)
          .then(response => response.json())
          .then((response) => {
            if(response != null && response.loginSuccessful){
                props.callback(userName, response.loginSuccessful);
            }  
          });    
    }
    
    return (
      <Container className="align-items-center border">
        
      <form onSubmit={handleSubmit(formSubmissionHandler)}>
      <Row>
        <Col><label htmlFor="usernameField">Sign-in with your username:</label></Col>
        <Col><Form.Control type="text" {...register("usernameField", { required: true, pattern: /^[A-Za-z0-9_.]+$/i })} /></Col>
        <Col><Button variant="primary" type="submit" >Sign-in</Button></Col>
      </Row>
      <Row>
        {errors.usernameField?.type ==='required' && <span>This field is required</span>}
        {errors.usernameField?.type ==='pattern' && <span>No special characters allowed in username</span>}
      </Row>
      </form>
      
      </Container>
    );
  }
  export default LoginComponent;