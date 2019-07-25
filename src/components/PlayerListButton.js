import React, { Fragment } from "react";
import PlayerlistView from "./PlayerlistView";

export default class PlayerListButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = e => {
    this.setState({
      open: !this.state.open
    });
  };

  render() {
    return (
      <Fragment>
        <button id="showPlayersButton" onClick={this.handleClick}>
          Players
        </button>
        {this.state.open && (
          <PlayerlistView
            toggleView={() => this.setState({ open: false })}
            gameId={this.props.gameId}
            gameState={this.props.gameState}
            role={this.props.role}
          />
        )}
      </Fragment>
    );
  }
}
