const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const users = {};

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  socket.on('new-user', name => {
    users[socket.id] = name;
    io.emit('user-connected', name);
    console.log(`${name} has joined the chat.`);
  })

  socket.on('chat message', (data) => {
    console.log(`Received message from ${data.name}: ${data.message}`);
    io.emit('chat message', data);
  });

  socket.on('disconnect', () => {
    const disconnectedUserName = users[socket.id];
    delete users[socket.id];
    io.emit('user-disconnected', disconnectedUserName);
    console.log(`${disconnectedUserName} has left the chat.`);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
