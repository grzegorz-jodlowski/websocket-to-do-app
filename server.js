
const express = require('express');
const app = express();
const port = 8000;
const socket = require('socket.io');

const tasks = ['Shopping', 'Cleaning'];

app.get('/', (req, res) => res.send('Hello World!'));

const server = app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

const io = socket(server);

io.on('connection', (socket) => {
  console.log('a user connected');
  io.to(socket.id).emit('updateData', tasks);

  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
    console.log(tasks);
  });

  socket.on('removeTask', (index) => {
    tasks.splice(index, 1);
    socket.broadcast.emit('removeTask', index);
    console.log(tasks);
  });


});