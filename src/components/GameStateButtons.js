import React, { Fragment } from "react";

/*
Component that displays buttons for game state changes
*/

export default class GameStateButtons extends React.Component {
  state = {
    gameState: this.props.gameState // valid values: CREATED,STARTED,PAUSED,ENDED
  };

  // Sends request to server to change game's state
  setGameState(state) {
    if (
      window.confirm(`Are you sure you want to change game state to ${state}?`)
    ) {
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
  }

  // The component renders different buttons depending on what state the game has.
  render() {
    if (this.state.gameState === "CREATED") {
      return (
        <button
          id="gameStateStartButton"
          onClick={() => this.setGameState("STARTED")}
        >
          Start
        </button>
      );
    }

    if (this.state.gameState === "STARTED") {
      return (
        <Fragment>
          <button
            id="gameStatePauseButton"
            onClick={() => this.setGameState("PAUSED")}
          >
            Pause
          </button>
          <button
            id="gameStateStopButton"
            onClick={() => this.setGameState("ENDED")}
          >
            Stop
          </button>
        </Fragment>
      );
    }

    if (this.state.gameState === "PAUSED") {
      return (
        <Fragment>
          <button
            id="gameStateContinueButton"
            onClick={() => this.setGameState("STARTED")}
          >
            Continue
          </button>
          <button
            id="gameStateStopButton"
            onClick={() => this.setGameState("ENDED")}
          >
            Stop
          </button>
        </Fragment>
      );
    }

    if (this.state.gameState === "ENDED") {
      return "The game has ended";
    }

    return false;
  }
}
