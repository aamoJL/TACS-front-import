import ReactDOM from "react-dom";
import React from "react";
import TaskItem from "./TaskItem";
import Draggable from "react-draggable";

class TaskList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskNameInput: "", // 3-31 chars
      taskDescriptionInput: "", // 0-255
      tasks: [],
      selectedFactionId: ""
    };
  }

  componentDidMount() {
    this.getTasks(this.props.gameId);
  }

  // SocketSignal format: message:{factionId}, type:{string}
  // FactionId is empty if the task is for every faction
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.socketSignal !== null) {
      // Admin updates on every task creation
      if (
        this.props.role === "admin" &&
        prevProps.socketSignal.type === "task-update"
      ) {
        this.getTasks(this.props.gameId);
      }
      // Other roles updates when their faction gets a task
      else if (
        prevProps.socketSignal.type === "task-update" &&
        (prevProps.socketSignal.message === "" ||
          prevProps.socketSignal.message === this.props.userFaction)
      ) {
        this.getTasks(this.props.gameId);
      }
    }
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
      .then(result => {})
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
      .then(result => {})
      .catch(error => console.log(error));
  };
  handleOnClick() {
    this.props.toggleView();
  }
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
    console.log(this.props.toggleView);
    return ReactDOM.createPortal(
      <Draggable
        bounds="body"
        className="draggableContainer"
        enableUserSelectHack={false}
        cancel=".input-cancel-drag"
      >
        <div className="tasklist">
          <button
            className="close"
            id="tasklistCloseButton"
            onClick={this.props.toggleView}
          >
            ×
          </button>
          <h1>Tasklist</h1>
          {this.props.role === "admin" && (
            <form className="task-form" onSubmit={this.handleTaskCreation}>
              <label>New task</label>
              <input
                className="input-cancel-drag"
                id="taskNameInput"
                type="text"
                placeholder="Task name"
                minLength="3"
                maxLength="31"
                value={this.state.taskNameInput}
                onChange={e => this.setState({ taskNameInput: e.target.value })}
              />
              <textarea
                className="input-cancel-drag"
                id="taskDescriptionInput"
                placeholder="Task description"
                value={this.state.taskDescriptionInput}
                maxLength="255"
                onChange={e =>
                  this.setState({ taskDescriptionInput: e.target.value })
                }
              />
              <select
                className="input-cancel-drag"
                id="taskFactionSelect"
                onChange={this.handleFactionChange}
              >
                {factionlistItems}
              </select>
              <button
                id="newTaskSubmitButton"
                type="submit"
                className="input-cancel-drag"
              >
                Add new task
              </button>
            </form>
          )}
          <div className="task-items-container">
            <label>On-going tasks</label>
            {incompleteTasks}

            <br />
            <label>Completed tasks</label>
            {completedTasks}
            <br />
          </div>
        </div>
      </Draggable>,
      document.getElementById("tasklist")
    );
  }
}

export default TaskList;
