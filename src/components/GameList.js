import React, { Fragment } from "react";
import GameCard from "./GameCard";

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
        // taking the initialized gameID to App.js (GameList.js -> GameSidebar.js -> Header.js -> App.js)
        this.props.handleGameChange(games[0].id);
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleChange = e => {
    this.setState({
      selectedGame: e.target.value
    });
    // taking the changed gameID to App.js (GameList.js -> GameSidebar.js -> Header.js -> App.js)
    this.props.handleGameChange(e.target.value);
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
    let gamelistItems = this.props.games.map(game => (
      <GameCard
        key={game.id}
        gameId={game.id}
        onEditSave={this.props.onEditSave}
      />
    ));

    return (
      <div className="gamelist">
        <div className="gamelist-item">{gamelistItems}</div>
      </div>
    );
  }
}

export default GameList;
