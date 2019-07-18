import React from "react";
import GrouplistFaction from "./GrouplistFaction";

export default class GrouplistView extends React.Component {
  state = {
    factions: null,
    factionGroups: null
  };

  // get faction groups
  componentDidMount() {
    // Add event to close the playerlist if "esc" is pressed
    document.addEventListener("keyup", this.handleEsc);

    let token = sessionStorage.getItem("token");

    if (this.props.role !== "soldier" && this.props.role !== "factionleader") {
      // get all factions in the game
      fetch(`${process.env.REACT_APP_API_URL}/game/${this.props.gameId}`)
        .then(res => res.json())
        .then(res => {
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

  // remove view with "ESC"
  handleEsc = e => {
    if (e.keyCode === 27) {
      this.props.toggleView();
    }
  };

  componentWillUnmount() {
    document.removeEventListener("keyup", this.handleEsc);
  }

  render() {
    if (this.state.factions === null) {
      return false;
    }

    let grouplistItems = this.state.factions.map(faction => {
      return (
        <div>
          <GrouplistFaction faction={faction} />
        </div>
      );
    });

    return (
      <div className="fade-main">
        <div className="sticky">
          <span
            id="closeEditGameFormX"
            className="close"
            onClick={() => this.props.toggleView()}
          >
            ×
          </span>
        </div>
        {grouplistItems}
      </div>
    );
  }
}
