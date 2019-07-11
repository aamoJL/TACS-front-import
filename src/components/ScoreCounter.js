import React, { Component } from "react";

export default class ScoreCounter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scores: null,
      testGameid: "a1231e2b-aa29-494d-b687-ea2d48cc23df"
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
      .then(scores => {
        console.log(scores);
        this.setState({
          scores
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  componentWillMount() {
    this.getScoresAndFactions();
  }

  render() {
    return (
      <div className="scoreContainer">
        <span
          className="scoreCircle"
          style={{
            backgroundColor: this.state.scores
              ? this.state.scores[0].faction.colour
              : "red"
          }}
        />
        <div className="scoreBlock">
          {this.state.scores ? this.state.scores[0].score : 0}
        </div>
        <div className="scoreDivider" />
        <div className="scoreBlock">
          {this.state.scores ? this.state.scores[1].score : 0}
        </div>
        <span
          className="scoreCircle"
          style={{
            backgroundColor: this.state.scores
              ? this.state.scores[1].faction.colour
              : "blue"
          }}
        />
      </div>
    );
  }
}
