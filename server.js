
const express = require('express');
const app = express();
const port = 8000;
const socket = require('socket.io');


const tasks = [];

app.get('/', (req, res) => res.send('Hello World!'));

const server = app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

const io = socket(server);

io.on('connection', (socket) => {
  console.log('a user connected');
  io.to(socket.id).emit('updateData', 'For your eyes only!');
});