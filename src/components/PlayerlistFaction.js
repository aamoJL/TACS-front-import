import React from "react";
import PlayerlistPlayerCard from "./PlayerlistPlayerCard";

export default class PlayerlistFaction extends React.Component {
  state = {
    factionGroups: null
  };

  // get faction members
  componentDidMount() {
    this.getFactionGroups();
  }

  getFactionGroups() {
    fetch(
      `${process.env.REACT_APP_API_URL}/faction/get-groups/${
        this.props.faction.factionId
      }`
    )
      .then(res => res.json())
      .then(res => {
        this.setState({ factionGroups: res });
      })
      .catch(error => console.log(error));
  }

  render() {
    if (this.state.factionGroups === null) {
      return false;
    }

    // map faction groups
    let groups = this.state.factionGroups.map(group => {
      return (
        <div>
          <h2>
            {group.name} - {group.class}
          </h2>

          {group.players.map(player => {
            return (
              <PlayerlistPlayerCard
                key={player.gamepersonId}
                player={player}
                role={this.props.role}
                gameId={this.props.gameId}
                onChange={() => this.getFactionGroups()}
              />
            );
          })}
        </div>
      );
    });

    return (
      <div>
        <br />
        <div>
          <h1>{this.props.faction.factionName}</h1>
        </div>
        <br />
        <div>{groups}</div>
      </div>
    );
  }
}
