import React from "react";
import GameList from "./GameList";
import NewGameForm from "./NewGameForm";

export default class GameSelection extends React.Component {
  state = {
    newGameForm: false,
    games: []
  };

  componentDidMount() {
    this.getGames();
  }

  getGames() {
    fetch(`${process.env.REACT_APP_API_URL}/game/listgames`)
      .then(response => response.json())
      .then(games => {
        this.setState({
          games: games
        });
        // taking the initialized gameID to UserMap.js (GameList.js -> Header.js -> App.js -> UserMap.js)
        //this.props.handleGameChange(games[0].id);
      })
      .catch(error => {
        console.log(error);
      });
  }

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
            toggleView={() =>
              this.setState({ newGameForm: false }, () => {
                this.getGames();
              })
            }
          />
        )}
        <GameList
          games={this.state.games}
          onEditSave={() => {
            this.getGames();
          }}
        />
      </div>
    );
  }
}
