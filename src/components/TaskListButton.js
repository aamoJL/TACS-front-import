import React, { Fragment } from "react";
import TaskList from "./TaskList";

/*
Component for displaying task button and tasklist
*/

export default class TaskListButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      unreadChanges: false
    };

    this.handleClick = this.handleClick.bind(this);
  }

  // Catches incoming sockets and updates unreadChanges state
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.socketSignal !== null) {
      if (prevProps.socketSignal.type === "task-update") {
        this.setState({
          unreadChanges: this.state.open ? false : true
        });
      }
    }
  }

  // Changes tasklist visibility
  handleClick = e => {
    this.setState(
      {
        open: !this.state.open
      },
      () => {
        // Set unread task changes to false
        if (this.state.open) {
          this.setState({ unreadChanges: false });
        }
      }
    );
  };

  render() {
    return (
      <Fragment>
        <button id="tasklistButton" onClick={this.handleClick}>
          {this.state.unreadChanges === false ? "Tasks" : "* Tasks"}
        </button>
        {this.state.open && (
          <TaskList
            toggleView={() => this.setState({ open: false })}
            gameId={this.props.gameId}
            userFaction={this.props.userFaction}
            role={this.props.role}
            factions={this.props.factions}
            socketSignal={this.props.socketSignal}
          />
        )}
      </Fragment>
    );
  }
}
