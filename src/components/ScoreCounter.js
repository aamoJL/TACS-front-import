import React, { Component } from "react";

/*
Component for displaying factions' scores
*/

export default class ScoreCounter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scores: null
    };
  }

  // Gets the current scores with factions (and their colors for display)
  getScoresAndFactions = () => {
    fetch(
      `${process.env.REACT_APP_API_URL}/score/get-score/${this.props.gameId}`,
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
        if (scores.length > 0) {
          this.setState({
            scores
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  // Gets factions and scores when the component loads
  componentWillMount() {
    this.getScoresAndFactions();
  }

  // Catches incoming socket signals
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.socketSignal === "score-update") this.getScoresAndFactions();
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
