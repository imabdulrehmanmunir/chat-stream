const express = require('express');
const http = require('http');
const { Server } = require('socket.io'); // Import Server class
const cors = require('cors');

const app = express();
app.use(cors());

// 1. Create the HTTP server (Wrap Express)
const server = http.createServer(app);

// 2. Initialize Socket.io
// Hint: You need to pass { cors: { origin: "..." } } as the second argument
const io = new Server(server, {
  cors: {
    origin: "*", // Your Frontend URL
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // 1. Listen for a message from the client
  socket.on('send_message', (data) => {
    // data = { message: "Hello", author: "Abdul", time: "12:00" }
    
    // 2. Broadcast to everyone EXCEPT the sender
    // (The sender already sees what they typed, so we don't send it back)
    socket.broadcast.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});
const PORT = process.env.PORT || 3001; // Let's use 3001 to avoid conflict with other apps

// 4. Start the server
// IMPORTANT: Use server.listen, NOT app.listen
server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
