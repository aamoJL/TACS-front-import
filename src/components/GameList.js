import React, { Fragment } from "react";
import GameCard from "./GameCard";

class GameList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      games: []
    };
  }

  componentDidMount() {
    this.getGames();
  }

  getGames() {
    fetch(`${process.env.REACT_APP_API_URL}/game/listgames`)
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

  render() {
    let gamelistItems = this.state.games.map(game => {
      return (
        <GameCard
          key={game.id}
          gameId={game.id}
          onEditSave={() => this.getGames()}
        />
      );
    });

    return (
      <Fragment>
        <div className="gamelist">{gamelistItems}</div>
      </Fragment>
    );
  }
}

export default GameList;
