import React from "react";
import PlayerlistPlayerCard from "./PlayerlistPlayerCard";

export default class PlayerlistFaction extends React.Component {
  state = {
    factionMembers: null
  };

  // get faction members
  componentDidMount() {
    fetch(
      `${process.env.REACT_APP_API_URL}/faction/get-faction-members/${
        this.props.faction.factionId
      }`
    )
      .then(res => res.json())
      .then(res => {
        this.setState({ factionMembers: res });
      })
      .catch(error => console.log(error));
  }

  render() {
    if (this.state.factionMembers === null) {
      return false;
    }

    let members = this.state.factionMembers.map(member => {
      return (
        <PlayerlistPlayerCard
          key={member.gamepersonId}
          player={member}
          role={this.props.role}
          gameId={this.props.gameId}
        />
      );
    });

    return (
      <div>
        <br />
        <div>{this.props.faction.factionName}</div>
        <br />
        <div>{members}</div>
      </div>
    );
  }
}
