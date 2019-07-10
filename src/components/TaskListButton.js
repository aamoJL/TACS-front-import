import React, { Fragment } from "react";
import TaskList from "./TaskList";

class TaskListButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      newTasks: 0
    };

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.getNewTask();
  }

  getNewTask() {
    this.setState({
      newTasks: this.state.open ? 0 : this.state.newTasks + 1
    });
  }

  handleClick = e => {
    this.setState(
      {
        open: !this.state.open
      },
      () => {
        // Set new task cout to zero when the tasklist opens
        if (this.state.open) {
          this.setState({ newTasks: 0 });
        }
      }
    );
  };

  render() {
    return (
      <Fragment>
        <button id="tasklistButton" onClick={this.handleClick}>
          Tasks ({this.state.newTasks})
        </button>
        {this.state.open && (
          <TaskList gameId="2c097e6a-591c-4a27-b7cb-38eb44e1f31c" />
        )}
      </Fragment>
    );
  }
}

export default TaskListButton;
