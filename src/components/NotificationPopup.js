import React from "react";

export default class NotificationPopup extends React.Component {
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.socketSignal === "alert") {
      console.log("alert");
    }
    if (prevProps.socketSignal === "note") {
      console.log("note");
    }
  }

  render() {
    return false;
  }
}
