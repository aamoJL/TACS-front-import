import React from "react";
import PlayerlistPlayerCard from "./PlayerlistPlayerCard";

/*
Component for displaying faction groups and playerCards
*/

export default class PlayerlistFaction extends React.Component {
  state = {
    factionGroups: []
  };

  // get faction members when the component loads
  componentDidMount() {
    this.getFactionGroups(this.props.faction.factionId);
  }

  // Gets faction's groups from the server
  getFactionGroups(factionId) {
    fetch(`${process.env.REACT_APP_API_URL}/faction/get-groups/${factionId}`)
      .then(res => res.json())
      .then(res => {
        this.setState({ factionGroups: res });
      })
      .catch(error => console.log(error));
  }

  joinFactionGroup(groupid) {
    fetch(
      `${process.env.REACT_APP_API_URL}/faction/join-group/${
        this.props.gameId
      }`,
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          groupId: groupid
        })
      }
    )
      .then(res => {
        if (!res.ok) throw Error(res);
      })
      .then(_ => {
        this.props.onJoinGame();
        this.getFactionGroups(this.props.faction.factionId);
        alert("joined group!");
      })
      .catch(error => console.log(error));
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props) {
      this.getFactionGroups(this.props.faction.factionId);
    }
  }

  render() {
    if (this.state.factionGroups.length === 0) {
      return false;
    }

    // map faction groups
    let groups = this.state.factionGroups.map(group => {
      return (
        <div>
          <h2>
            {group.name} - {group.class}
          </h2>
          {group.name !== "No group" &&
            this.props.role === "soldier" &&
            !this.props.isJoinedGroup && (
              <button onClick={() => this.joinFactionGroup(group.id)}>
                Join this group
              </button>
            )}
          {group.players.map(player => {
            return (
              <PlayerlistPlayerCard
                key={player.gamepersonId}
                player={player}
                role={this.props.role}
                gameId={this.props.gameId}
                gameState={this.props.gameState}
                onChange={() =>
                  this.getFactionGroups(this.props.faction.factionId)
                }
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
