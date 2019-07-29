import React, { Fragment } from "react";
import ScoreForm from "./ScoreForm";

/*
Component that displays Add Score button and Add score form popup
*/

export default class AddScoreButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };

    this.handleClick = this.handleClick.bind(this);
  }

  // Changes add score form's visibility state
  handleClick = e => {
    this.setState({
      open: !this.state.open
    });
  };

  render() {
    return (
      <Fragment>
        <button id="addScoreButton" onClick={this.handleClick}>
          Add Score
        </button>
        {this.state.open && (
          <ScoreForm
            gameId={this.props.gameId}
            factions={this.props.factions}
            toggleView={() => this.setState({ open: false })}
            role={this.props.role}
            gameState={this.props.gameState}
          />
        )}
      </Fragment>
    );
  }
}
