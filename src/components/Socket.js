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

  // initiate the socket on component mount
  componentWillMount() {
    console.log("hi socket");
    if (this.props.gameId !== null) {
      this.props.getSocketSignal("drawing-update");
    }
    this.initSocket();
  }

  shouldComponentUpdate(nextProps, nextState) {
    // re-initialize socket when gameId has changed
    if (nextProps.gameId !== this.props.gameId) {
      this.initSocket();
      return true;
    } else {
      return false;
    }
  }

  // disconnect the socket on component dismount
  componentWillUnmount() {
    console.log("bye socket");
    this.state.sock.disconnect();
  }

  initSocket = () => {
    const socket = io(socketUrl);

    // set the socket to listen gameId-thread
    socket.on(this.props.gameId, data => {
      this.props.getSocketSignal(data.type);
      // check socket update type
      this.setState({ update: data.type });
    });

    this.setState({ sock: socket });
  };

  render() {
    return this.state.update;
  }
}
