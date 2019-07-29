import React from "react";

/*
Component for displaying notification's information
*/

export default class NotificationCard extends React.Component {
  render() {
    return (
      <div>
        {this.props.notification.type} : {this.props.notification.message}
      </div>
    );
  }
}
