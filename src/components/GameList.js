import React from "react";
import GameCard from "./GameCard";

/*
Component for showing GameCards for games in a list
*/

class GameList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [],
      selectedGame: undefined,
      editForm: false,
      joinForm: false
    };
  }

  // Get games from the server when the component loads
  componentDidMount() {
    this.getGames();
  }

  // Get games from the server and set them to state
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
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    // GameCard elements for the games
    let gamelistItems = this.props.games.map(game => (
      <GameCard
        key={game.id}
        gameId={game.id}
        onEditSave={this.props.onEditSave}
      />
    ));

    return <div className="gamelist">{gamelistItems}</div>;
  }
}

export default GameList;
