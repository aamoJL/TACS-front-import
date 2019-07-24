import React from "react";

export default class ScoreForm extends React.Component {
  state = {
    scoreInput: "", // less than 100
    selectedFaction:
      this.props.factions[0] !== undefined
        ? this.props.factions[0].factionId
        : null
  };

  handleSend = e => {
    e.preventDefault();

    let score = parseInt(this.state.scoreInput);
    let factionId = this.state.selectedFaction;
    console.log(factionId);
    console.log(score);

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
    console.log(this.props.factions);
    let factionOptions = this.props.factions.map(faction => (
      <option key={faction.factionId} value={faction.factionId}>
        {faction.factionName}
      </option>
    ));

    return (
      <div className="fade-main">
        <button
          id="notificationViewCloseButton"
          onClick={() => this.props.toggleView()}
        >
          Close
        </button>
        <div>
          <label>Add Score</label>
          <select
            value={this.state.selectedFaction}
            onChange={e => this.setState({ selectedFaction: e.target.value })}
          >
            {factionOptions}
          </select>
          <input
            type="number"
            value={this.state.scoreInput}
            onChange={this.handleInputChange}
            placeholder="Add score to faction..."
            max="99"
          />
          <button onClick={this.handleSend}>Add</button>
        </div>
      </div>
    );
  }
}
