const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const webSocketServer = require('ws').WebSocketServer;
let connectedClients = new Map();
const port = process.env.PORT || 9000;
const wss = new webSocketServer({ port: port });
//TODO: add a method to handle user's who disconnect from the connection
wss.on('connection', function connection(ws) {
    //console.log("WebSocket Connection established with client");
  ws.on('message', function incoming(message) {
        //console.log('message received at WebSocket server:', message.toString());
        let messageObject = tryParseJSONObject(message.toString());
        if(messageObject && messageObject?.type === "newClient"){
            //console.log("messageObject type is newClient ");
            //console.log("messageObject clientId is :", messageObject.clientId);
            //console.log("typeof messageObject clientId is :", typeof messageObject.clientId);
            connectedClients.set(messageObject.clientId, ws);
            //console.log("connected clients: ", connectedClients);
        }
        if(!messageObject){
            //console.log("inside !messageObject");
            connectedClients.set(message.toString(), ws);
            //console.log("connected clients: ",connectedClients);
        }
        if(messageObject && messageObject?.senderId !== null 
            && (typeof messageObject?.senderId !== "undefined") 
            && messageObject?.conversationId !== null 
            && (typeof messageObject?.conversationId !== "undefined")){
            getConversation(messageObject.conversationId, (error, result) => {
                if(error)
                    throw error;
                //console.log("participants: "+result.participant);
                let recepients = result.participant.filter((item) => item.toString() !== messageObject?.senderId);
                //console.log("recepients: "+ recepients);
                recepients.forEach((item)=>{
                    if(connectedClients.has(item.toString())){
                        let client = connectedClients.get(item.toString());
                        //console.log("notifying client with ID: "+item.toString());
                        let newMessageNotification = {
                            notificationType: "newMessage",
                            senderId: messageObject.senderId,
                            messageId: messageObject._id,
                            conversationId: messageObject.conversationId
                        };
                        //console.log("sending: ",JSON.stringify(newMessageNotification));
                        client.send(JSON.stringify(newMessageNotification));
                    }
                });
            });
        }    
  });
});

//Get ConversationSummary by ID
async function getConversation(conversationId, callback){
    try{
        const serverUrl = `https://messaging-app-server.azurewebsites.net/conversations/${conversationId}`; // `http://localhost:3001/conversations/${conversationId}`
        const response = await fetch(serverUrl);
        const data = await response.json();
        callback(null, data);
    }catch(error){
        callback(error);
    }
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