import Conversation from './Conversation';
import ContactsList from './ContactsList';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import ConversationSummaryList from './ConversationSummaryList';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import './HomeComponent.css';
import React, { useState, useEffect, useRef } from "react";
function HomeComponent(props) {
    const [conversationSummaryList, setConversationSummaryList] = useState([]);
    const [conversationId, setConversationId] = useState(0);
    const [conversation, setConversation] = useState({});
    const [conversationName, setConversationName] = useState('');
    const [lastSeenTime, setLastSeenTime] = useState('');
    const [user, setUser] = useState({});
    const [newNotification, setNewNotification] = useState({});
    const [newMessage, setNewMessage] = useState({});
    const [contactsListVisible, setContactsListVisible] = useState(false);
    let webSocketClient = useRef(null);
    //const wsURL = 'ws://localhost:9000';
    const wsURL = 'wss://websocket-server-3.azurewebsites.net';
    useEffect(()=>{
        webSocketClient.current = new WebSocket(wsURL);
        webSocketClient.current.onopen =  (event) => {
            console.log('Connection open with Websocket server');
          };
        webSocketClient.current.onmessage = (event) => {
            //console.log('message received at React client: %s', event.data);
            let newNotificationObject = tryParseJSONObject(event.data);
            //console.log(newNotificationObject);
            if(newNotificationObject && newNotificationObject?.notificationType === "newMessage"){
                setNewNotification(newNotificationObject);
                //console.log(newNotification);
            }
        };
    },[]);
    //Get User by userName
    useEffect(() => {
        if(props.loggedInUser !== null && props.loggedInUser !== undefined && props.loggedInUser !== ''){
            fetch(`https://messaging-app-server.azurewebsites.net/users/name/${props.loggedInUser}`)
                .then((response) => response.json())
                .then((response) => {
                    setUser(response);
                    //TODO: send only JSON data, handle it separately in the Server code
                    let objectToSend = {
                        type: "newClient",
                        clientId: response._id
                    };
                    console.log(objectToSend);
                    if(webSocketClient.current.readyState === 1)
                        webSocketClient.current.send(JSON.stringify(objectToSend));
                    else{
                        webSocketClient.current.onopen = (event) => {
                            webSocketClient.current.send(JSON.stringify(objectToSend));
                        };
                    }
                });
        }
    }, [props]);
    //Get all ConversationSummaries for a given user
    useEffect(() => {
        if(!contactsListVisible && user !== null && (typeof user !== "undefined") && Object.entries(user).length !== 0 ){
            //console.log(user);
            //console.log(user._id);
            fetch(`https://messaging-app-server.azurewebsites.net/summaries/${user._id}`)
                .then((response) => response.json())
                .then(setConversationSummaryList);
        }
    }, [user,newNotification,contactsListVisible]);
    // Load a particular conversation when it's respective conversationSummary is clicked
    useEffect(() => {
        if(conversationId !== 0){
            fetch(`https://messaging-app-server.azurewebsites.net/conversations/${conversationId}`)
                .then((response) => response.json())
                .then(setConversation);
        }
    }, [conversationId]);

    const loadConversation = (conversationId, conversationName, lastSeenTime) => {
        setConversationId(conversationId);
        setConversationName(conversationName);
        setLastSeenTime(lastSeenTime);
    }
    const updateConversationSummary = (newMessage) => {
        setNewMessage(newMessage);
    }
    function tryParseJSONObject (jsonString){
        try {
            var o = JSON.parse(jsonString);
            if (o && typeof o === "object") {
                return o;
            }
        }
        catch (e) { }
    
        return false;
    };

    const showContactsList = () => {
        //console.log("show contact list clicked");
        setContactsListVisible(true);
    };
    const back = () => {
        //console.log("back button clicked");
        setContactsListVisible(false);
    };
    
    return (<>
        
    <Container className="border border-2">
        <Row>
        <Navbar bg="dark" variant="dark">
        <Container>
            <Navbar.Brand>Whaddup Messenger</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
            <Nav.Item>
            <Navbar.Text>
                Signed in as: {user.userName}
            </Navbar.Text>
            </Nav.Item>
            <Nav.Item className="px-5">
                <Button variant="danger" onClick={props.logoutCallback}>Logout</Button>
            </Nav.Item>
            </Navbar.Collapse>
        </Container>
        </Navbar>
        </Row>
    <Row>
    <Col className="col-md-2">
        {contactsListVisible ? (<>
        <Row><Button variant="secondary" onClick={back}>Back</Button></Row>
        <Row><ContactsList user={user}
        convoList={conversationSummaryList}
        callbackOnClickConversation={loadConversation}
        reloadConversationSummary={back}/></Row>
        </>) : 
        (<>
        <Row><Button variant="success" onClick={showContactsList}>New Chat</Button></Row>
        <Row><ConversationSummaryList user={user} 
        list={conversationSummaryList} 
        callbackOnClickConversation={loadConversation} 
        newNotification={newNotification}
        newMessage={newMessage}/></Row>
        </>)}
    </Col>
    <Col className="col-md-10">
        <Conversation user={user} 
        conversation={conversation} 
        conversationName={conversationName} 
        lastSeenTime={lastSeenTime} 
        wsClient={webSocketClient} 
        newNotification={newNotification}
        onAddMessage={updateConversationSummary}/>
    </Col>
    </Row>
    </Container>
    </>
    );
  }
export default HomeComponent;