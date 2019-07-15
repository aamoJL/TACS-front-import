import React from "react";
import NewGameForm from "./NewGameForm";
import GameList from "./GameList";

export default class GameSidebar extends React.Component {
  state = {
    form: ""
  };

  toggleView = view => {
    this.setState({
      form: view
    });
  };

  render() {
    return (
      <div className="game-sidebar">
        <GameList handleGameChange={this.props.handleGameChange} />
        {this.props.loggedIn && (
          <button id="newGameButton" onClick={() => this.toggleView("newgame")}>
            New Game
          </button>
        )}
        {this.state.form === "newgame" && (
          <NewGameForm view="" toggleView={() => this.toggleView("")} />
        )}
      </div>
    );
  }
}
