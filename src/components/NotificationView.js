import ReactDOM from "react-dom";
import React from "react";
import NotificationCard from "./NotificationCard";
import Draggable from "react-draggable";

export default class NotificationView extends React.Component {
  state = {
    notifications: [],
    notificationInput: "",
    notificationTypeInput: "note"
  };

  componentDidMount() {
    this.getNotifications(this.props.gameId);
  }

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
            x
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

          {notifications}
        </div>
      </Draggable>,
      document.getElementById("tasklist")
    );
  }
}
