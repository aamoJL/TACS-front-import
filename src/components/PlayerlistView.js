import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Draggable from "react-draggable";
import PlayerlistFaction from "./PlayerlistFaction";

/*
Component for displaying factions' information
*/

export default class PlayerlistView extends React.Component {
  state = {
    factions: null
  };

  // Gets factions from the server when the component loads
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

  // Removes keyup event from the component when the component is removed
  componentWillUnmount() {
    document.removeEventListener("keyup", this.handleEsc);
  }

  render() {
    if (this.state.factions === null) {
      return false;
    }

    let factionlistItems = this.state.factions.map(faction => (
      <PlayerlistFaction
        key={faction.factionId}
        faction={faction}
        role={this.props.role}
        gameId={this.props.gameId}
        gameState={this.props.gameState}
      />
    ));

    return ReactDOM.createPortal(
      <Draggable
        bounds="body"
        className="draggableContainer"
        enableUserSelectHack={false}
        cancel=".input-cancel-drag"
      >
        <div className="tasklist">
          <h1>Playerlist</h1>
          <button
            id="closePlayerlistX"
            className="close"
            onClick={() => this.props.toggleView()}
          >
            x
          </button>

          <div className="task-items-container input-cancel-drag">
            {factionlistItems}
          </div>
        </div>
      </Draggable>,
      document.getElementById("tasklist")
    );
  }
}
