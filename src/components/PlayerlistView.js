import React from "react";
import PropTypes from "prop-types";
import PlayerlistFaction from "./PlayerlistFaction";

export default class PlayerlistView extends React.Component {
  state = {
    factions: null
  };

  componentDidMount() {
    let token = sessionStorage.getItem("token");

    if (this.props.role !== "soldier" && this.props.role !== "factionleader") {
      // get all factions in the game
      fetch(`${process.env.REACT_APP_API_URL}/game/${this.props.gameId}`)
        .then(res => res.json())
        .then(res => {
          console.log(res);
          this.setState({ factions: res.factions });
        })
        .catch(error => console.log(error));
    } else {
      // get player's faction
      fetch(
        `${process.env.REACT_APP_API_URL}/faction/check-faction/${
          this.props.gameId
        }`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token
          }
        }
      )
        .then(res => res.json())
        .then(res => {
          this.setState({ factions: [res] });
        })
        .catch(error => console.log(error));
    }
  }

  render() {
    if (this.state.factions === null) {
      return false;
    }

    let factionlistItems = this.state.factions.map(faction => {
      return (
        <PlayerlistFaction
          key={faction.factionId}
          faction={faction}
          role={this.props.role}
        />
      );
    });

    return <div className="fade-main">{factionlistItems}</div>;
  }
}

PlayerlistView.propTypes = {
  gameId: PropTypes.string
};
