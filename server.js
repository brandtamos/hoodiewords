const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const WebSocket = require('ws');

// Serve static files from the public directory
app.use(express.static(__dirname + '/public'));

// Start the HTTP server on port 3000
httpServer.listen(3000, () => {
    console.log("HTTP Server running at http://localhost:3000/");
});

// WebSocket server setup
const wss = new WebSocket.Server({ server: httpServer });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        
        // Broadcast the received message to all connected clients except the sender
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', function close() {
        console.log("Client disconnected");
    });
});