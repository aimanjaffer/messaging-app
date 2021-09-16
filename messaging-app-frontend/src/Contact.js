import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";

const Contact = (props) => {
    let ongoingConvoExists = false;
    props.convoList.some((conversation) => {
        if(conversation.participants.includes(props.id)){
            ongoingConvoExists = true;
            return true;
        }
        return false;  
    });
    const [contactName, setContactName] = useState('');
    const [lastSeenTime, setLastSeenTime] = useState('');
    useEffect(()=>{
        fetch(`https://messaging-app-server.azurewebsites.net/users/${props.id}`)
                .then((response) => response.json())
                .then(response => {
                    setContactName(response.FullName);
                    setLastSeenTime(response.lastSeenTime);
                });
    },[props.id]);
    const createConversation = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                participant: [props.id, props.user._id]
              })
          };
          fetch(`https://messaging-app-server.azurewebsites.net/conversation`, requestOptions)
                .then((response) => response.json())
                .then(response => response.insertedId)
                .then(response => {
                    props.callbackOnClickConversation(response, contactName, lastSeenTime);
                    props.reloadConversationSummary();
                });
    }
    return ( !ongoingConvoExists &&
    <Card style={{cursor: 'pointer'}} bg="light" text="dark" onClick={createConversation}>
        <Card.Title>{contactName}</Card.Title>
    </Card>
    );
}


export default Contact;