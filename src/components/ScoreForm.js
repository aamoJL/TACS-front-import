import ReactDOM from "react-dom";
import React from "react";
import Draggable from "react-draggable";

/*
Component for adding score to factions
*/

export default class ScoreForm extends React.Component {
  state = {
    scoreInput: "", // less than 100
    selectedFaction:
      this.props.factions[0] !== undefined
        ? this.props.factions[0].factionId
        : null
  };

  // Sends score addition to the server
  handleSend = e => {
    e.preventDefault();

    let score = parseInt(this.state.scoreInput);
    let factionId = this.state.selectedFaction;

    if (isNaN(score) || factionId === null) {
      return alert("score or factionId is invalid");
    }

    let token = sessionStorage.getItem("token");
    fetch(
      `${process.env.REACT_APP_API_URL}/score/add-score/${this.props.gameId}`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          score: score,
          faction: factionId
        })
      }
    )
      .then(res => res.json())
      .then(res => {
        this.setState({ scoreInput: "" });
      })
      .catch(error => console.log(error));
  };

  // Changes score input state
  handleInputChange = e => {
    let score = e.target.value;
    if (score > 99) {
      score = 99;
    }
    if (score < 0) {
      score = 0;
    }
    this.setState({ scoreInput: score });
  };

  render() {
    let factionOptions = this.props.factions.map(faction => (
      <option key={faction.factionId} value={faction.factionId}>
        {faction.factionName}
      </option>
    ));

    return ReactDOM.createPortal(
      <Draggable
        bounds="body"
        className="draggableContainer"
        enableUserSelectHack={false}
        cancel=".input-cancel-drag"
      >
        <div className="notification">
          <button
            className="close"
            id="scoreformCloseButton"
            onClick={() => this.props.toggleView()}
          >
            ×
          </button>

          <h1>Add score</h1>
          <form className="notification-input" onSubmit={this.handleSend}>
            <select
              className="input-cancel-drag"
              id="scoreformSelectFaction"
              value={this.state.selectedFaction}
              onChange={e => this.setState({ selectedFaction: e.target.value })}
            >
              {factionOptions}
            </select>
            <input
              className="input-cancel-drag"
              id="scoreformScoreInput"
              type="number"
              value={this.state.scoreInput}
              onChange={this.handleInputChange}
              placeholder="Add score to faction..."
              max="99"
              required
            />
            <button
              className="input-cancel-drag"
              id="scoreformAddScoreButton"
              type="submit"
            >
              Add
            </button>
          </form>
        </div>
      </Draggable>,
      document.getElementById("tasklist")
    );
  }
}
