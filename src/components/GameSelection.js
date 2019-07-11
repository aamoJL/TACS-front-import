import React from "react";
import GameList from "./GameList";
import NewGameForm from "./NewGameForm";

export default class GameSelection extends React.Component {
  state = {
    newGameForm: false
  };

  render() {
    return (
      <div>
        <label>Games</label>
        <br />
        <button
          id="newGameButton"
          onClick={() => this.setState({ newGameForm: true })}
        >
          New Game
        </button>
        {this.state.newGameForm && (
          <NewGameForm
            view=""
            handleState={this.handleState}
            toggleView={() => this.setState({ newGameForm: false })}
          />
        )}
        <GameList />
      </div>
    );
  }
}
