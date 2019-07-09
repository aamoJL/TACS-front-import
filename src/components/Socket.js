import React from "react";
import io from "socket.io-client";

const socketUrl = process.env.REACT_APP_API_URL;
export default class ClientSocket extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // stores the socket object for notifications
      sock: null,
      // stores updates sent by socket
      update: null
    };
  }

  // iniate the socket on component mount
  componentWillMount() {
    console.log("iniated socket");
    this.initSocket();
  }

  // disconnect the socket on component dismount
  componentWillUnmount() {
    this.state.sock.disconnect();
  }

  initSocket = () => {
    const socket = io(socketUrl);
    // set the socket to listen gameId-thread
    socket.on(this.props.gameId, data => {
      // check socket update type
      this.setState({ update: data });
      console.log(this.state.update);
    });
    this.setState({ sock: socket });
  };

  render() {
    return null;
  }
}
