import React from "react";
import NotificationCard from "./NotificationCard";

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

    return (
      <div className="fade-main">
        <button onClick={() => this.props.toggleView()}>Close</button>
        <div>
          {this.props.role === "admin" && this.props.gameState !== "ENDED" && (
            <form onSubmit={this.handleSend}>
              <select
                value={this.state.notificationTypeInput}
                onChange={e =>
                  this.setState({ notificationTypeInput: e.target.value })
                }
              >
                <option value="note">Note</option>
                <option value="alert">Alert</option>
              </select>
              <input
                type="text"
                value={this.state.notificationInput}
                onChange={e =>
                  this.setState({ notificationInput: e.target.value })
                }
                placeholder="Notification message..."
              />
              <button type="submit">Send Notification</button>
            </form>
          )}
        </div>
        {notifications}
      </div>
    );
  }
}
