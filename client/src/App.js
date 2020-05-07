import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {
  state = {
    tasks: [],
    taskName: '',
  }

  componentDidMount() {
    this.socket = io('http://localhost:8000');
    this.socket.on('updateData', (tasks) => this.setState({ tasks }));
    this.socket.on('addTask', (task) => this.addTask(task));
    this.socket.on('removeTask', (taskId) => this.removeTask(taskId));
  }

  removeTask(taskId, e) {
    const { state } = this;

    this.setState({ tasks: state.tasks.filter(task => task.id !== taskId) });

    // emit removeTask request if removeTask comes from us
    if (e) { this.socket.emit('removeTask', taskId) };
  }

  addTask(task) {
    const { state } = this;

    this.setState({ tasks: [...state.tasks, task,] });
  }

  submitForm(e) {
    const { state } = this;

    e.preventDefault();
    const task = { name: state.taskName, id: uuidv4() }
    this.addTask(task);
    this.setState({ taskName: '' });
    this.socket.emit('addTask', task);
  }

  render() {
    const { state } = this;

    return (
      <div className="App">

        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {state.tasks.map((task) =>
              <li key={task.id} className="task">{task.name}<button className="btn btn--red" onClick={(e) => this.removeTask(task.id, e)}>Remove</button></li>
            )}
          </ul>

          <form id="add-task-form" onSubmit={(e) => this.submitForm(e)}>
            <input
              className="text-input"
              autoComplete="off"
              type="text"
              placeholder="Type your description"
              id="task-name"
              value={state.taskName}
              onChange={(e) => this.setState({ taskName: e.target.value })} />
            <button className="btn" type="submit">Add</button>
          </form>

        </section>
      </div>
    );
  }
}

export default App;
