import React from "react";
import GameList from "./GameList";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from "react-router-dom";

export default class GameSelection extends React.Component {
  state = {
    currentGameId: ""
  };

  handleGameChange = gameId => {
    this.setState({
      currentGameId: gameId
    });
  };

  handleGameSelection = () => {
    console.log(this.state.currentGameId);
  };

  render() {
    return (
      <div>
        <GameList handleGameChange={this.handleGameChange} />
        <Link
          to={{ pathname: "/game", search: "?id=" + this.state.currentGameId }}
        >
          <button type="button">Select</button>
        </Link>
      </div>
    );
  }
}
