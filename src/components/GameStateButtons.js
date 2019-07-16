import React, { Fragment } from "react";

export default class GameStateButtons extends React.Component {
  state = {
    gameState: this.props.gameState // valid values: CREATED,STARTED,PAUSED,ENDED
  };

  setGameState(state) {
    console.log(state);
    let token = sessionStorage.getItem("token");
    let error = false;
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
          state: state
        })
      }
    )
      .then(res => {
        if (!res.ok) {
          error = true;
        }
        return res.json();
      })
      .then(res => {
        if (error) {
          console.log(res);
        } else {
          alert(`Game state changed to ${state}`);
          this.setState({ gameState: state });
        }
      })
      .catch(error => console.log(error));
  }

  render() {
    if (this.state.gameState === "CREATED") {
      return (
        <button onClick={() => this.setGameState("STARTED")}>Start</button>
      );
    }

    if (this.state.gameState === "STARTED") {
      return (
        <Fragment>
          <button onClick={() => this.setGameState("PAUSED")}>Pause</button>
          <button onClick={() => this.setGameState("ENDED")}>Stop</button>
        </Fragment>
      );
    }

    if (this.state.gameState === "PAUSED") {
      return (
        <Fragment>
          <button onClick={() => this.setGameState("STARTED")}>Continue</button>
          <button onClick={() => this.setGameState("ENDED")}>Stop</button>
        </Fragment>
      );
    }

    if (this.state.gameState === "ENDED") {
      return "The game has ended";
    }

    return false;
  }
}
