import React, { Fragment } from "react";
import NotificationView from "./NotificationView";

/*
Component that displays notification window and a button for the window's visibility
*/

export default class NotificationButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };

    this.handleClick = this.handleClick.bind(this);
  }

  // Changes notification windows visiblity
  handleClick = e => {
    this.setState({
      open: !this.state.open
    });
  };

  render() {
    return (
      <Fragment>
        <button id="notificationsButton" onClick={this.handleClick}>
          Notifications
        </button>
        {this.state.open && (
          <NotificationView
            toggleView={() => this.setState({ open: false })}
            gameId={this.props.gameId}
            socket={this.props.socket}
            role={this.props.role}
            gameState={this.props.gameState}
          />
        )}
      </Fragment>
    );
  }
}
