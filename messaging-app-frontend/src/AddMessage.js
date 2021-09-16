import "./AddMessage.css";
import React from "react";
import Button from 'react-bootstrap/Button';
import { useForm } from "react-hook-form";
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
function AddMessage(props) {
  const { register, handleSubmit, getValues } = useForm();
  const formSubmissionHandler = (data, e) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
          senderId:  props.senderId,
          conversationId: props.conversationId,
          messageContent: getValues('newMessageField'),
          messageTime: new Date()
        })
    };
      fetch('https://messaging-app-server.azurewebsites.net/message', requestOptions)
      .then(response => response.json())
      .then((response) => {
        //console.log("response of insert message: "+JSON.stringify(response));
        if(response?.acknowledged === true){
          e.target.reset();
          props.onAddMessage(response.insertedId);
        }
      });
  }
    return (
            <>
              <form onSubmit={handleSubmit(formSubmissionHandler)}>
                <Row className="mt-auto">
                <Col><Form.Control type="text" {...register("newMessageField", { required: true })} /></Col>
                <Col md={1}><Button variant="success" type="submit">Send</Button></Col>
                </Row>
                </form>
            </>
    );
  }

export default AddMessage;