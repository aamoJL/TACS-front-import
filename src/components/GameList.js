import React, { Fragment } from "react";
import GameCard from "./GameCard";

class GameList extends React.Component {
  render() {
    let gamelistItems = this.props.games.map(game => {
      return (
        <GameCard
          key={game.id}
          gameId={game.id}
          onEditSave={this.props.onEditSave}
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
