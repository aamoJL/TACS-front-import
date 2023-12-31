import ReactDOM from "react-dom";
import React from "react";
import NotificationCard from "./NotificationCard";
import Draggable from "react-draggable";

/*
Component that displays form for new notifications and list for the sent notifications
*/

export default class NotificationView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
      notificationInput: "",
      notificationTypeInput: "note"
    };
  }

  // Gets notifications when the components loads
  componentDidMount() {
    this.getNotifications(this.props.gameId);
  }

  // Gets notification form the server and sets them in state
  getNotifications(gameId) {
    let token = sessionStorage.getItem("token");
    fetch(`${process.env.REACT_APP_API_URL}/notifications/${gameId}`, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(res => res.json())
      .then(res => {
        this.setState({ notifications: res.reverse() });
      });
  }

  // Sends new notification to the server
  handleSend = e => {
    e.preventDefault();

    if (this.state.notificationInput === "") {
      alert("notification message can't be empty");
    } else if (
      window.confirm("Are you sure you want to send the notification")
    ) {
      this.props.socket.emit("game-info", {
        type: this.state.notificationTypeInput,
        message: this.state.notificationInput,
        game: this.props.gameId
      });
      alert("Notification sent");
      this.getNotifications(this.props.gameId);
      this.setState({ notificationInput: "" });
    }
  };

  render() {
    // NotificationCard element list
    let notifications = this.state.notifications.map(notification => (
      <NotificationCard key={notification.id} notification={notification} />
    ));

    return ReactDOM.createPortal(
      <Draggable
        bounds="body"
        className="draggableContainer"
        enableUserSelectHack={false}
        cancel=".input-cancel-drag"
      >
        <div className="notification">
          <button
            className="close"
            id="notificationViewCloseButton"
            onClick={() => this.props.toggleView()}
          >
            ×
          </button>
          <h1>Notifications</h1>
          {this.props.role === "admin" &&
            this.props.gameState !== "ENDED" &&
            this.props.gameState !== "CREATED" && (
              <form className="notification-input" onSubmit={this.handleSend}>
                <select
                  className="input-cancel-drag"
                  id="notificationViewTypeSelect"
                  value={this.state.notificationTypeInput}
                  onChange={e =>
                    this.setState({ notificationTypeInput: e.target.value })
                  }
                >
                  <option value="note">Note</option>
                  <option value="alert">Alert</option>
                </select>
                <input
                  className="input-cancel-drag"
                  id="notificationViewMessageInput"
                  type="text"
                  maxLength="63"
                  value={this.state.notificationInput}
                  onChange={e =>
                    this.setState({ notificationInput: e.target.value })
                  }
                  placeholder="Notification message..."
                  required
                />
                <button
                  className="input-cancel-drag"
                  id="notificationSubmitButton"
                  type="submit"
                >
                  Send Notification
                </button>
              </form>
            )}
          {this.props.role === "admin" &&
            (this.props.gameState === "ENDED" ||
              this.props.gameState === "CREATED") && (
              <p>Notifications can only be sent if the game is ongoing</p>
            )}

          <label>Notification history</label>
          <div className="task-items-container input-cancel-drag">
            {notifications}
          </div>
        </div>
      </Draggable>,
      document.getElementById("tasklist")
    );
  }
}
