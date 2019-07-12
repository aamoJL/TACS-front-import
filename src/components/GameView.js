import React from "react";
import UserMap from "./UserMap";
import { BrowserRouter as Router, Link } from "react-router-dom";

export default class GameView extends React.Component {
  state = {
    gameId: null,
    lat: 62.2416479,
    lng: 25.7597186,
    zoom: 13,
    mapUrl: "https://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.jpg"
  };

  componentDidMount() {
    let id = new URL(window.location.href).searchParams.get("id");
    this.setState({
      gameId: id
    });
  }

  render() {
    if (this.state.gameId === null) {
      return false;
    }

    const initialPosition = [this.state.lat, this.state.lng];

    return (
      <div>
        <div>{this.state.gameId}</div>
        <Link to="/">
          <button>Game selection</button>
        </Link>
        <UserMap
          position={initialPosition}
          zoom={this.state.zoom}
          mapUrl={this.state.mapUrl}
          currentGameId={this.state.currentGameId}
        />
      </div>
    );
  }
}
