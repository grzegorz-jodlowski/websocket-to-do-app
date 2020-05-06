
const express = require('express');
const app = express();
const port = 8000;
const socket = require('socket.io');

const tasks = [
  { name: 'Shopping', id: 'dfsadf324s' },
  { name: 'Go out with a dog', id: 'dfs2ad6724s' }
];

app.get('/', (req, res) => res.send('Hello World!'));

const server = app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

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