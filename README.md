# Real-time Messaging Application using WebSockets
## http://messaging-app-frontend.vercel.app/
### Developed by Aiman Jaffer
#### Tech Stack: MongoDB Atlas, Node.js, React, Express.js, WebSockets, Azure App Service
##### Frontend hosted on Vercel, API Server and WebSocket servers are hosted on Azure App Service, MongoDB Atlas used as database.
---
### Steps to run source code locally
1) Clone the repo.
2) Go into `messaging-app-backend`, `messaging-app-frontend`, `messaging-app-websocket-server` and run `npm install` individually. (NPM and Node.js is a prerequisite)
3) Change the DB url in the backend application to point to your local MongoDb instance.
4) Change the backend server url and websocket server url in React app to point to `localhost:3001` and `localhost:9000` respectively.
5) Run `node app.js` in the folders for backend server and websocket server on `localhost:3001` and `localhost:9000`.
5) Run `npm start` to run the React App on `localhost:3000`.
---
### User Stories Completed
1) User should be able to create an account.
2) User should be able to login using their username and password.
3) User should see a list of their conversations on the left pane, after successful login.
4) User should be able to start a new conversation with a contact using the "New" button.
5) On clicking a conversation summary, the entire conversation should load on the right pane.
6) User should be able to receive push notification for a new message.
7) User should be able to send a new message.
---
### Roadmap
1) JWT based Authorization, Social Media based Login
2) Users should be able to send and receive Media in conversation
3) User should be able to search for anyone and start a conversation based on username
4) User can upload a profile picture and a status
5) E2E Encryption of messages, API authorization stuff
6) Pagination for messages in a conversation (only recent messages show up first and the rest is loaded on demand when user scrolls.)
7) Responsive CSS for different screen sizes
8) Figure out how to make it a Distributed system
9) Caching
10) Add support for emojis
13) Support for Forward and share messages
14) Support for Group messaging
15) Link previews
---
### UI Components Tree
![UI Components Tree](/docs/UI_Components_Tree.png)
---
### WebSocket Integration Flow
![WebSocket Flow](/docs/Websockets%20Flow%20Diagram.png)
