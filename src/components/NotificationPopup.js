import React from "react";

export default class NotificationPopup extends React.Component {
  state = {
    lastNotification: null,
    visible: true
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.socketSignal !== null &&
      prevProps.socketSignal !== this.state.lastNotification
    ) {
      if (prevProps.socketSignal.type === "alert") {
        this.setState({
          lastNotification: prevProps.socketSignal,
          visible: true
        });
      }
      if (prevProps.socketSignal.type === "note") {
        this.setState({
          lastNotification: prevProps.socketSignal,
          visible: true
        });
      }
    }
  }

  render() {
    if (this.state.lastNotification !== null && this.state.visible) {
      return (
        <div
          className={
            this.state.lastNotification.type === "alert"
              ? "notification-popup alert"
              : "notification-popup warning"
          }
        >
          <button
            id="NotificationPopupCloseButton"
            onClick={() => {
              this.setState({ visible: false });
            }}
          >
            Close
          </button>
          <br />
          <label>
            {this.state.lastNotification.type === "alert" ? "ALERT" : "Note"}
          </label>
          <p>{this.state.lastNotification.message}</p>
        </div>
      );
    }

    return false;
  }
}
