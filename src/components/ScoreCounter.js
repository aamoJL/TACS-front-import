import React, { Component, Fragment } from "react";

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

  // Render scores and colors of the factions
  render() {
    return (
      <div className="scoreContainer">
        {this.state.scores ? (
          this.state.scores.map((score, i) => {
            if (i !== this.state.scores.length - 1) {
              return (
                <Fragment>
                  <span
                    className="score-circle"
                    style={{ backgroundColor: score.colour }}
                  />
                  <div className="score-block">{score.score}</div>
                  <div className="score-divider" />
                </Fragment>
              );
            } else {
              return (
                <Fragment>
                  <span
                    className="score-circle"
                    style={{ backgroundColor: score.colour }}
                  />
                  <div className="score-block">{score.score}</div>
                </Fragment>
              );
            }
          })
        ) : (
          <div />
        )}
      </div>
    );
  }
}
