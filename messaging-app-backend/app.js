const express = require('express');
var cors = require('cors')
const { MongoClient, ObjectId } = require('mongodb');
//const CONNECTION_URL = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
const CONNECTION_URL = "mongodb+srv://db-root:RJVulMJGQc3n0DXK@cluster0.hudpg.mongodb.net/test";
const DATABASE_NAME = "messenger-db";

var app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cors())
var database, usersCollection, messagesCollection, conversationCollection, conversationSummaryCollection;
const port = process.env.PORT || 3001;
//Initialize database connection
app.listen(port, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error)
            throw error;
        database = client.db(DATABASE_NAME);
        usersCollection = database.collection("users");
        messagesCollection = database.collection("messages");
		conversationCollection = database.collection("conversations");
		conversationSummaryCollection = database.collection("conversationSummary");
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});
//POST Check if User with username exists in the database 
app.post("/login", (request, response) => {
	//console.log("login request received for: "+request.body.userName);
	usersCollection.findOne({userName:request.body.userName}, function(error, result) {
		if (error)
			return response.status(500).send(error);      
        if(result != null)
            return response.send({"loginSuccessful":true});
		else
            return response.send({"loginSuccessful":false});
	});
});

//TODO: Add an API handler to GET all of the user's Contacts by their ID
//TODO: Make all these APIs require a valid access token before they can perform the requested action

//GET All Users in the database
app.get("/users", (request, response) => {
    usersCollection.find({}).toArray((error, result) => {
        if(error)
            return response.status(500).send(error);
        //console.log("result: "+ JSON.stringify(result));
        response.send(result);
    });
});
//Get Unique User by their ID
app.get("/users/:id", (request, response) => {
	
	usersCollection.findOne({_id : new ObjectId(request.params.id)}, function(error, result) {
		if (error)
			return response.status(500).send(error);
        //console.log("result: "+ JSON.stringify(result));
		response.send(result);
	});
});
//Get Unique User by their userName
app.get("/users/name/:username", (request, response) => {
	
	usersCollection.findOne({userName:request.params.username}, function(error, result) {
		if (error)
			return response.status(500).send(error);
        //console.log("result: "+ JSON.stringify(result));
		response.send(result);
	});
});
//GET All Messages in the database
app.get("/messages", (request, response) => {
    messagesCollection.find({}).toArray((error, result) => {
        if(error)
            return response.status(500).send(error);
        //console.log("result: "+ JSON.stringify(result));
        response.send(result);
    }); 
});
//GET Unique Message by ID
app.get("/messages/id/:id", (request, response) => {
    messagesCollection.findOne({_id : new ObjectId(request.params.id)}, function(error, result) {
		if (error)
			return response.status(500).send(error);
        //console.log("result: "+ JSON.stringify(result));
		response.send(result);
	});
});
//GET All Messages by ConversationID
app.get("/messages/:id", (request, response) => {
    messagesCollection.find({conversationId : new ObjectId(request.params.id)}).toArray((error, result) => {
        if(error)
            return response.status(500).send(error);
		//console.log("result: "+ JSON.stringify(result));
        response.send(result);
    }); 
});
//POST Insert new Message
app.post("/message", (request, response) => {
	//console.log("insert message request received with body: "+JSON.stringify(request.body));
    let objectToInsert = {
        ...request.body,
        senderId: new ObjectId(request.body.senderId),
        conversationId: new ObjectId(request.body.conversationId),
    }
	messagesCollection.insertOne(objectToInsert, (error, result) => {
        if (error)
            throw error;
        //console.log("result of insert Operation: "+JSON.stringify(result));
        //On successful insertion of new message, Update the correct conversationSummary's lastMessageId with newMessageId
        getConversationSummaryID(request.body.conversationId, (error,conversationSummaryId) =>{
            if(error)
                throw error;
            updateConversationSummary(conversationSummaryId, result.insertedId);
        });
        response.send(result);
      });
});
//POST Create new Conversation
app.post("/conversation", (request, response) => {
	//console.log("create conversation request received with body: "+JSON.stringify(request.body));
    let participant = request.body.participant.map((item) => new ObjectId(item));
    let objectToInsert = {
        ...request.body,
        participant
    }
	conversationCollection.insertOne(objectToInsert, (error, result) => {
        if (error)
            throw error;
        //console.log("result of create conversation Operation: "+JSON.stringify(result));
        //On successful conversation creation, create a new conversationSummary
        createConversationSummary(result.insertedId, participant);
        response.send(result);
      });
});
//GET All Conversations in the database
app.get("/conversations", (request, response) => {
    conversationCollection.find({}).toArray((error, result) => {
        if(error)
            return response.status(500).send(error);
        //console.log("result: "+ JSON.stringify(result));
        response.send(result);
    });
});
//GET A Unique Conversation by it's ID
app.get("/conversations/:id", (request, response) => {
	conversationCollection.findOne({_id : new ObjectId(request.params.id)}, function(error, result) {
		if (error)
			return response.status(500).send(error);
        //console.log("result: "+ JSON.stringify(result));
		response.send(result);
	});
});
//GET All ConversationSummaries in the database
app.get("/summaries", (request, response) => {
    conversationSummaryCollection.find({}).toArray((error, result) => {
        if(error)
            return response.status(500).send(error);
        //console.log("result: "+ JSON.stringify(result));
        response.send(result);
    }); 
});
//Get the ConversationSummary that is common to two users
app.post("/summaries", (request, response) => {
    console.log("POST request received @/summaries with body: "+JSON.stringify(request.body));
    conversationSummaryCollection.findOne({ participants: { $in: [new ObjectId(request.body.participants[0]), new ObjectId(request.body.participants[1])] } }, (error, result) => {
        if(error)
            return response.status(500).send(error);
        console.log("result: "+ JSON.stringify(result));
        response.send(result);
    }); 
});
//GET ConversationSummaries for a particular user
app.get("/summaries/:userid", (request, response) => {
    conversationSummaryCollection.find({ participants: { $in: [new ObjectId(request.params.userid)] } }).sort({lastMessageId: -1, _id: -1}).toArray((error, result) => {
        if(error)
            return response.status(500).send(error);
        //console.log("result: "+ JSON.stringify(result));
        response.send(result);
    }); 
});

//Update LastMessageId in a ConversationSummary
function updateConversationSummary(conversationSummaryId, lastMessageId){
    let query = {_id : new ObjectId(conversationSummaryId)};
    let updatedValues = { $set: { lastMessageId: new ObjectId(lastMessageId) } };
    conversationSummaryCollection.updateOne(query, updatedValues, function(error, result) {
        if (error)
            throw error;
        //console.log("update conversationSummary result: "+ JSON.stringify(result));
      });
}
//Create ConversationSummary
function createConversationSummary(conversationId, participants){
    let newConversationSummary = { 
        conversationId: conversationId,
        participants: participants 
    };
    conversationSummaryCollection.insertOne(newConversationSummary, function(error, result) {
        if (error)
            throw error;
        console.log("create new conversationSummary result: "+ JSON.stringify(result));
      });
}

//Get ConversationSummaryID by ConversationID
function getConversationSummaryID(conversationId, callback){
    conversationSummaryCollection.findOne({conversationId : new ObjectId(conversationId)}, function(error, result) {
		if (error)
			callback(error);
		return callback(null,result._id);
	});    
}