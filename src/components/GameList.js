import React, { Fragment } from "react";
import EditGameForm from "./EditGameForm";
import JoinGameForm from "./JoinGameForm";

class GameList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [],
      selectedGame: undefined,
      editForm: false,
      joinForm: false
    };

    this.toggleView = this.toggleView.bind(this);
  }

  componentDidMount() {
    this.getGames();
  }

  getGames() {
    fetch(`${process.env.REACT_APP_API_URL}/game/listgames`)
      .then(response => response.json())
      .then(games => {
        let selectedGame =
          this.state.selectedGame !== undefined
            ? this.state.selectedGame
            : undefined;
        this.setState({
          games: games,
          selectedGame:
            selectedGame !== undefined
              ? selectedGame
              : games !== undefined
              ? games[0].id
              : undefined
        });
        // taking the initialized gameID to UserMap.js (GameList.js -> Header.js -> App.js -> UserMap.js)
        this.props.handleGameChange(games[0].id);
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleChange = e => {
    this.setState(
      {
        selectedGame: e.target.value
      },
      () => {
        // taking the changed gameID to UserMap.js (GameList.js -> Header.js -> App.js -> UserMap.js)
        //this.props.handleGameChange(this.state.selectedGame);
      }
    );
  };

  handleEditClick = e => {
    if (this.state.selectedGame === undefined) {
      alert("No game selected");
    } else {
      this.setState({
        editForm: true
      });
    }
  };

  handleJoinClick = e => {
    if (this.state.selectedGame === undefined) {
      alert("No game selected");
    } else {
      this.setState({
        joinForm: true,
        editForm: false
      });
    }
  };

  toggleView = e => {
    this.setState({
      editForm: !this.state.editForm
    });
    this.getGames();
  };

  render() {
    let items = [];

    for (let i = 0; i < this.state.games.length; i++) {
      const element = this.state.games[i];
      items.push(
        <option key={element.id} value={element.id}>
          {element.name}
        </option>
      );
    }

    return (
      <Fragment>
        <label>Game: </label>
        <select id="changeActiveGameList" onChange={this.handleChange}>
          {items}
        </select>
        {sessionStorage.getItem("token") && (
          <Fragment>
            <button id="editGameButton" onClick={this.handleEditClick}>
              Edit game
            </button>
            <button id="editGameButton" onClick={this.handleJoinClick}>
              Join Game
            </button>
          </Fragment>
        )}
        {this.state.editForm && this.state.selectedGame !== undefined && (
          <EditGameForm
            gameId={this.state.selectedGame}
            toggleView={this.toggleView}
          />
        )}
        {this.state.joinForm && this.state.selectedGame !== undefined && (
          <JoinGameForm
            gameId={this.state.selectedGame}
            toggleView={this.toggleView}
          />
        )}
      </Fragment>
    );
  }
}

export default GameList;
