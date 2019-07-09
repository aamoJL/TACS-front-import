import React from "react";

export default class GameView extends React.Component {
  state = {
    gameId: null
  };

  componentDidMount() {
    let id = new URL(window.location.href).searchParams.get("id");
    this.setState({
      gameId: id
    });
  }

  render() {
    return <div>{this.state.gameId}</div>;
  }
}
