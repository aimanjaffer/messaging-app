import AddMessage from "./AddMessage";
import "./Conversation.css";
import MessageList from "./MessageList";
import UserProfileInfo from "./UserProfileInfo";
import React, { useState, useEffect } from "react";
function Conversation(props) {
    const [conversationId, setConversationId] = useState(props.conversation._id);
    const [messageList, setMessageList] = useState([]);
    
    const onAddMessage =  (newMessageId) => {
      let newMessage = {};
      fetch(`https://messaging-app-server.azurewebsites.net/messages/id/${newMessageId}`)
          .then((response) => response.json())
          .then((response) => {
            newMessage = response;
            //console.log("message sent from Conversation component of react client: "+JSON.stringify(newMessage));
            if(props.wsClient.current.readyState === 1)
              props.wsClient.current.send(JSON.stringify(newMessage));
            setMessageList((prevMessageList) => [...prevMessageList, newMessage]);
            props.onAddMessage(newMessage);
          });
    }
    //If newNotification.conversationId === conversationId, fetch the last message by newNotification.messageId 
    useEffect(()=>{
      if((typeof conversationId !== "undefined") && props.newNotification.conversationId === conversationId){
        fetch(`https://messaging-app-server.azurewebsites.net/messages/id/${props.newNotification.messageId}`)
          .then((response) => response.json())
          .then((response) => {
            setMessageList((prevMessageList) => [...prevMessageList, response]);
          });
      }
    },[props.newNotification,conversationId]);

    useEffect(() => {
        setConversationId(props.conversation._id);
      }, [props.conversation]);

    //GET All messages that are a part of this conversation
    useEffect(() => {
      if(conversationId !== null && (typeof conversationId !== "undefined") && Object.entries(conversationId).length !== 0){
        fetch(`https://messaging-app-server.azurewebsites.net/messages/${conversationId}`)
          .then((response) => response.json())
          .then(setMessageList);
      }
    }, [conversationId]);

    return (
        <>
          <UserProfileInfo conversationName={props.conversationName} lastSeenTime={props.lastSeenTime}/>
          <MessageList messageList={messageList} userId={props.user._id}/>
          {conversationId && <AddMessage senderId={props.user._id} conversationId={conversationId} onAddMessage={onAddMessage}/>}
        </>
    );
  }

export default Conversation;