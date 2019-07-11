import React, { Component } from "react";

export default class ScoreCounter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      factionsScores: [],
      testGameid: ""
    };
  }

  // Gets the current scores with factions (and their colors for display)
  getScoresAndFactions = () => {
    fetch(
      `https://tacs-testing.cf:8443/score/get-score/${this.state.testGameid}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )
      .then(res => res.json())
      .then(scores => console.log(scores))
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    return (
      <div className="scoreContainer">
        <span className="scoreCircle" />
        <div className="scoreBlock">482</div>
        <div className="scoreDivider" />
        <div className="scoreBlock">1278</div>
        <span className="scoreCircle" />
      </div>
    );
  }
}
