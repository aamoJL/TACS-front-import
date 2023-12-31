import React from "react";
import ReactDOM from "react-dom";
import Draggable from "react-draggable";
import PlayerlistFaction from "./PlayerlistFaction";
import CreateGroupForm from "./CreateGroupForm";
import { isUndefined } from "util";

/*
Component for displaying factions' information
*/

export default class PlayerlistView extends React.Component {
  state = {
    factions: undefined,
    isJoinedGroup: false
  };

  handleGroupFetch = _ => {
    let token = sessionStorage.getItem("token");

    if (this.props.role !== "soldier" && this.props.role !== "factionleader") {
      // ADMIN: get all factions in the game
      fetch(`${process.env.REACT_APP_API_URL}/game/${this.props.gameId}`)
        .then(res => res.json())
        .then(res => {
          this.setState({ factions: res.factions });
        })
        .catch(error => console.log(error));
    } else {
      // NOT ADMIN: get player's faction
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
          this.setState({ factions: [res], isJoinedGroup: res.group });
        })
        .catch(error => console.log(error));
    }
  };

  // Gets factions from the server when the component loads
  componentDidMount() {
    this.handleGroupFetch();
  }

  render() {
    if (isUndefined(this.state.factions)) {
      return false;
    }

    let factionlistItems = this.state.factions.map(faction => (
      <PlayerlistFaction
        key={faction.factionId}
        faction={faction}
        role={this.props.role}
        gameId={this.props.gameId}
        gameState={this.props.gameState}
        isJoinedGroup={this.state.isJoinedGroup}
        onJoinGame={this.handleGroupFetch}
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
          <div>
            {this.props.role === "soldier" && !this.state.isJoinedGroup && (
              <CreateGroupForm
                factionId={this.state.factions[0].factionId}
                gameId={this.props.gameId}
                onGroupCreated={this.handleGroupFetch}
              />
            )}
          </div>
        </div>
      </Draggable>,
      document.getElementById("tasklist")
    );
  }
}
