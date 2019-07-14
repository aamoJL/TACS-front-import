import React from "react";
import NewGameForm from "./NewGameForm";
import GameList from "./GameList";

export default class GameSidebar extends React.Component {
  state = {
    form: ""
  };

  toggleView = view => {
    this.setState({
      form: view
    });
  };

  render() {
    return false;
  }
}
