
const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const port = 8000;

const tasks = [
  { name: 'Shopping', id: 'dfsadf324s' },
  { name: 'Go out with a dog', id: 'dfs2ad6724s' }
];

app.use(express.static(path.join(__dirname, '/client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

app.use(function (req, res, next) {
  res.status(404).send('Not found...');
});

const server = app.listen(process.env.PORT || port, () => console.log(`Example app listening at http://localhost:${port}`));

const io = socket(server);

io.on('connection', (socket) => {
  console.log('a user connected');
  io.to(socket.id).emit('updateData', tasks);

  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });

  socket.on('removeTask', (taskId) => {
    const task = tasks.find(task => task.id === taskId);
    tasks.splice(tasks.indexOf(task), 1);
    socket.broadcast.emit('removeTask', taskId);
  });
});