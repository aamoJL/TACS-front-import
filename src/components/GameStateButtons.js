import React, { Fragment } from "react";

export default class GameStateButtons extends React.Component {
  state = {
    gameState: this.props.gameState // CREATED,STARTED,PAUSED,ENDED,ONGOING
  };

  handleStart = e => {
    let token = sessionStorage.getItem("token");
    fetch(
      `${process.env.REACT_APP_API_URL}/game/edit-state/${this.props.gameId}`,
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: this.props.gameId,
          state: "STARTED"
        })
      }
    )
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw Error(res.statusText);
        }
      })
      .then(res => {
        alert(`Game state changed to "STARTED"`);
        this.setState({ gameState: "STARTED" });
      })
      .catch(error => console.log(error));
  };

  handlePause = e => {
    this.setState({ gameState: "PAUSED" });
  };

  handleStop = e => {
    this.setState({ gameState: "STOPPED" });
  };

  render() {
    if (this.state.gameState === "CREATED") {
      return <button onClick={this.handleStart}>Start</button>;
    }

    if (this.state.gameState === "STARTED") {
      return (
        <Fragment>
          <button onClick={this.handlePause}>Pause</button>
          <button onClick={this.handleStop}>Stop</button>
        </Fragment>
      );
    }

    if (this.state.gameState === "PAUSED") {
      return (
        <Fragment>
          <button onClick={this.handleStart}>Continue</button>
          <button onClick={this.handleStop}>Stop</button>
        </Fragment>
      );
    }

    if (this.state.gameState === "STOPPED") {
      return "The game has ended";
    }

    return false;
  }
}
