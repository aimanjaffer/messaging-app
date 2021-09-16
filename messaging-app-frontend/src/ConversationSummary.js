import { useEffect, useState } from 'react';
import './ConversationSummary.css';
import { Card } from 'react-bootstrap';
function ConversationSummary(props) {
    const [conversationName, setConversationName] = useState('');
    const [lastMessage, setLastMessage] = useState('');
    const [lastSeenTime, setLastSeenTime] = useState('');
    let recepientsList =  props.participants.filter((id) => id !== props.currentUserId);
    
    useEffect(() => {
        if(recepientsList != null && recepientsList.length === 1){
            fetch(`https://messaging-app-server.azurewebsites.net/users/${recepientsList[0]}`)
                .then((response) => response.json())
                .then(response => {
                    setConversationName(response.FullName);
                    setLastSeenTime(response.lastSeenTime);
                });
        }
        else if(recepientsList != null && recepientsList.length > 1){
            //TODO: for each recepient append their name to the conversationName
            console.log(recepientsList);
        }
    }, [recepientsList]);
    useEffect(() => {
        if(typeof props.lastMessageId !== "undefined"){
            fetch(`https://messaging-app-server.azurewebsites.net/messages/id/${props.lastMessageId}`)
            .then((response) => response.json())
            .then(response => response.messageContent)
            .then(setLastMessage);
        }
    }, [props.lastMessageId]);

    useEffect(() => {
        if(props.newNotification.conversationId === props.conversationId 
            && props.newNotification.messageId !== props.lastMessageId){
            fetch(`https://messaging-app-server.azurewebsites.net/messages/id/${props.newNotification.messageId}`)
            .then((response) => response.json())
            .then(response => response.messageContent)
            .then(setLastMessage);
        }
    }, [props.newNotification, props.conversationId, props.lastMessageId]);

    useEffect(() => {
        if(props.newMessage.conversationId === props.conversationId 
            && props.newMessage._id !== props.lastMessageId){
            fetch(`https://messaging-app-server.azurewebsites.net/messages/id/${props.newMessage._id}`)
            .then((response) => response.json())
            .then(response => response.messageContent)
            .then(setLastMessage);
        }
    }, [props.newMessage, props.conversationId, props.lastMessageId]);
    return (
        <Card style={{cursor: 'pointer'}} bg="light" text="dark" onClick={() => props.callbackOnClickConversation(props.conversationId, conversationName, lastSeenTime)}>
            <Card.Title>{conversationName}</Card.Title>
            <Card.Text>{lastMessage}</Card.Text>
        </Card>
    );
  }

export default ConversationSummary;