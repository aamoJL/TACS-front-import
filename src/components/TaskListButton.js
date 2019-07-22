import React, { Fragment } from "react";
import TaskList from "./TaskList";

export default class TaskListButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
      // newTasks: 0
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
        // Websocket task notification template
        // Set new task cout to zero when the tasklist opens
        // if (this.state.open) {
        //   this.setState({ newTasks: 0 });
        // }
      }
    );
  };

  handleClearForm = () => {
    this.props.toggleView();
    console.log("JEP!");
  };

  render() {
    return (
      <Fragment>
        <button id="tasklistButton" onClick={this.handleClick}>
          {/* Tasks ({this.state.newTasks}) */}
          Tasks
        </button>
        {this.state.open && (
          <TaskList
            toggleView={() => this.setState({ open: false })}
            gameId={this.props.gameId}
            role={this.props.role}
            factions={this.props.factions}
          />
        )}
      </Fragment>
    );
  }
}
