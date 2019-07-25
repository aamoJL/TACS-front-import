import React, { Fragment } from "react";
import TaskList from "./TaskList";

export default class TaskListButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      newTasksCount: 0
    };

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.socketSignal !== null) {
      if (prevProps.socketSignal.type === "task-update") {
        console.log("task updated");
        this.setState({
          newTasksCount: this.state.open ? 0 : this.state.newTasksCount + 1
        });
      }
    }
  }

  handleClick = e => {
    this.setState(
      {
        open: !this.state.open
      },
      () => {
        // Set new task cout to zero when the tasklist opens
        if (this.state.open) {
          this.setState({ newTasksCount: 0 });
        }
      }
    );
  };

  render() {
    return (
      <Fragment>
        <button id="tasklistButton" onClick={this.handleClick}>
          Tasks
          {/* {this.state.newTasksCount === 0
            ? "Tasks"
            : `Tasks (${this.state.newTasksCount})`} */}
        </button>
        {this.state.open && (
          <TaskList
            toggleView={() => this.setState({ open: false })}
            gameId={this.props.gameId}
            role={this.props.role}
            factions={this.props.factions}
            socketSignal={this.props.socketSignal}
          />
        )}
      </Fragment>
    );
  }
}
