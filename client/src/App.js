import React from 'react';
import io from 'socket.io-client';

class App extends React.Component {
  state = {
    tasks: [],
    taskName: '',
  }

  componentDidMount() {
    this.socket = io(`http://localhost:8000`);
    this.socket.on('updateData', (tasks) => this.setState({ ...this.state, tasks }));
  }

  removeTask(id) {
    this.state.tasks.splice(id, 1);
    this.setState({ ...this.state, tasks: this.state.tasks });

    this.socket.emit('removeTask', id);
  }

  addTask(task) {
    this.state.tasks.push(task);
    this.setState({ ...this.state, tasks: this.state.tasks });
  }

  submitForm(e) {
    e.preventDefault();
    this.addTask(this.state.taskName);
    this.socket.emit('addTask', this.state.taskName);
  }

  render() {
    return (
      <div className="App">

        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {this.state.tasks.map((task, i) =>
              <li key={task} className="task">{task}<button className="btn btn--red" onClick={() => this.removeTask(i)}>Remove</button></li>
            )}
          </ul>

          <form id="add-task-form" onSubmit={(e) => this.submitForm(e)}>
            <input
              className="text-input"
              autoComplete="off"
              type="text"
              placeholder="Type your description"
              id="task-name"
              value={this.state.taskName}
              onChange={(e) => this.setState({ ...this.state, taskName: e.target.value })} />
            <button className="btn" type="submit">Add</button>
          </form>

        </section>
      </div>
    );
  }
}

export default App;
