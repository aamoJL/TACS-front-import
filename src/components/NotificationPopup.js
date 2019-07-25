import React from "react";
import ReactDOM from "react-dom";

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
      return ReactDOM.createPortal(
        <div className="notification-container">
          <div
            className={
              this.state.lastNotification.type === "alert"
                ? "notification-popup alert"
                : "notification-popup note"
            }
          >
            <button
              id="NotificationPopupCloseButton"
              className="notification-popup-close"
              onClick={() => {
                this.setState({ visible: false });
              }}
            >
              ×
            </button>
            <label>
              {this.state.lastNotification.type === "alert" ? "ALERT" : "Note"}
            </label>
            <p>{this.state.lastNotification.message}</p>
          </div>
        </div>,
        document.getElementById("popup")
      );
    }

    return false;
  }
}
