import React from "react";

export default class NotificationView extends React.Component {
  state = {
    notifications: [],
    notificationInput: ""
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
        console.log(res);
        //this.setState({ notifications: res });
      });
  }

  handleSend = e => {
    e.preventDefault();

    console.log(this.props.socket);

    this.props.socket.emit(this.props.gameId, {
      type: "alert",
      message: "asd"
    });
  };

  render() {
    return (
      <div className="fade-main">
        <button onClick={() => this.props.toggleView()}>Close</button>
        <div>
          <form onSubmit={this.handleSend}>
            <input
              type="text"
              value={this.state.notificationInput}
              onChange={e =>
                this.setState({ notificationInput: e.target.value })
              }
              placeholder="Notification text..."
            />
            <button type="submit">Send Notification</button>
          </form>
        </div>
      </div>
    );
  }
}
