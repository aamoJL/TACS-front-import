import React, { Fragment } from "react";
import EditGameForm from "./EditGameForm";

class GameList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [],
      selectedGame: null,
      editForm: false
    };

    this.toggleView = this.toggleView.bind(this);
  }

  componentDidMount() {
    this.getGames();
  }

  getGames() {
    fetch("http://172.20.2.143:5000/game/listgames")
      .then(response => response.json())
      .then(games => {
        this.setState({
          games: games,
          selectedGame: games !== undefined && games[0].id
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
        this.props.handleGameChange(this.state.selectedGame);
      }
    );
  };

  handleEditClick = e => {
    if (this.state.selectedGame === null) {
      alert("No game selected");
    } else {
      this.setState({
        editForm: true
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
          <button id="editGameButton" onClick={this.handleEditClick}>
            Edit game
          </button>
        )}
        {this.state.editForm && this.state.selectedGame !== null && (
          <EditGameForm
            gameId={this.state.selectedGame}
            toggleView={this.toggleView}
          />
        )}
      </Fragment>
    );
  }
}

export default GameList;
