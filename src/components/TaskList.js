import ReactDOM from "react-dom";
import React from "react";
import TaskItem from "./TaskItem";

class TaskList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskNameInput: "", // >= 3
      taskDescriptionInput: "", // no limits
      tasks: [],
      selectedFactionId: ""
    };
  }

  componentDidMount() {
    this.getTasks(this.props.gameId);
  }

  getTasks(gameId) {
    let token = sessionStorage.getItem("token");
    fetch(`${process.env.REACT_APP_API_URL}/task/get-tasks/${gameId}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(result => {
        if (!result.ok) {
          throw Error(result.responseText);
        } else {
          return result.json();
        }
      })
      .then(result => {
        this.setState({
          tasks: result
        });
      })
      .catch(error => console.log(error));
  }

  handleTaskCreation = e => {
    e.preventDefault();
    if (this.state.taskNameInput === "") {
      return alert("Task needs a name");
    }

    let token = sessionStorage.getItem("token");
    fetch(
      `${process.env.REACT_APP_API_URL}/task/new-task/${this.props.gameId}`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          taskName: this.state.taskNameInput,
          taskDescription: this.state.taskDescriptionInput,
          taskIsActive: true,
          faction:
            this.state.selectedFactionId === ""
              ? null
              : this.state.selectedFactionId,
          taskWinner: null,
          taskGame: this.props.gameId
        })
      }
    )
      .then(result => {
        if (!result.ok) {
          throw Error(Response.statusText);
        } else {
          return result.json();
        }
      })
      .then(result => {
        alert(result.message);
        this.setState({
          taskDescriptionInput: "",
          taskNameInput: ""
        });
        this.getTasks(this.props.gameId);
      })
      .catch(error => console.log(error));
  };

  handleFactionChange = e => {
    this.setState({
      selectedFactionId: e.target.value
    });
  };

  onTaskEditSave = (task, winnerFactionId) => {
    let token = sessionStorage.getItem("token");
    fetch(
      `${process.env.REACT_APP_API_URL}/task/edit-task/${this.props.gameId}`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          taskId: task.taskId,
          taskWinner: winnerFactionId,
          taskGame: this.props.gameId
        })
      }
    )
      .then(result => {
        if (!result.ok) {
          throw Error(result.responseText);
        } else {
          return result.json();
        }
      })
      .then(result => {
        alert(result.message);
        this.getTasks(this.props.gameId);
      })
      .catch(error => console.log(error));
  };

  onTaskDeletion = taskId => {
    if (taskId === (undefined || null)) {
      return;
    }
    let token = sessionStorage.getItem("token");
    fetch(
      `${process.env.REACT_APP_API_URL}/task/delete-task/${this.props.gameId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          taskId: taskId
        })
      }
    )
      .then(result => {
        if (!result.ok) {
          throw Error(result.responseText);
        } else {
          return result.json();
        }
      })
      .then(result => {
        alert(result.message);
        this.getTasks(this.props.gameId);
      })
      .catch(error => console.log(error));
  };

  render() {
    let incompleteTasks = [];
    let completedTasks = [];
    for (let i = 0; i < this.state.tasks.length; i++) {
      const task = this.state.tasks[i];
      if (task.taskWinner !== null) {
        completedTasks.push(
          <TaskItem
            key={task.taskId}
            task={task}
            role={this.props.role}
            gameId={this.props.gameId}
            onSave={this.onTaskEditSave}
            onDelete={this.onTaskDeletion}
          />
        );
      } else {
        incompleteTasks.push(
          <TaskItem
            key={task.taskId}
            task={task}
            role={this.props.role}
            gameId={this.props.gameId}
            onSave={this.onTaskEditSave}
            onDelete={this.onTaskDeletion}
          />
        );
      }
    }

    let factionlistItems = this.props.factions.map(faction => {
      return (
        <option key={faction.factionId} value={faction.factionId}>
          {faction.factionName}
        </option>
      );
    });

    // add all factions option to the faction list
    factionlistItems.unshift(
      <option key="all" value="">
        Every faction
      </option>
    );

    return ReactDOM.createPortal(
      <div className="tasklist">
        <h1>Tasklist</h1>
        {this.props.role === "admin" && (
          <form className="task-form" onSubmit={this.handleTaskCreation}>
            <label>New task</label>
            <input
              id="taskNameInput"
              type="text"
              placeholder="Task name"
              minLength="3"
              value={this.state.taskNameInput}
              onChange={e => this.setState({ taskNameInput: e.target.value })}
            />
            <textarea
              id="taskDescriptionInput"
              placeholder="Task description"
              value={this.state.taskDescriptionInput}
              onChange={e =>
                this.setState({ taskDescriptionInput: e.target.value })
              }
            />
            <select id="taskFactionSelect" onChange={this.handleFactionChange}>
              {factionlistItems}
            </select>
            <button id="newTaskSubmitButton" type="submit">
              Add new task
            </button>
          </form>
        )}
        {incompleteTasks}
        <br />
        <label>Completed tasks</label>
        {completedTasks}
        <br />
      </div>,
      document.getElementById("tasklist")
    );
  }
}

export default TaskList;
