import React, { Component } from "react";
import "../node_modules/leaflet-draw/dist/leaflet.draw.css";
import "./App.css";
import UserMap from "./components/UserMap";
import Header from "./components/Header";

class App extends Component {
  constructor() {
    super();

    // set initial state
    this.state = {
      lat: 62.2416479,
      lng: 25.7597186,
      zoom: 13,
      mapUrl: "https://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.jpg",
      currentGameId: null
    };

    this.handleLayerChange = this.handleLayerChange.bind(this);
    this.handleGameChange = this.handleGameChange.bind(this);
  }
  // Toggles through the list and changes the mapUrl state
  handleLayerChange = () => {
    const maps = [
      "https://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.jpg",
      "https://tiles.kartat.kapsi.fi/peruskartta/{z}/{x}/{y}.jpg",
      "https://tiles.kartat.kapsi.fi/ortokuva/{z}/{x}/{y}.jpg"
    ];
    this.setState({
      mapUrl:
        maps.indexOf(this.state.mapUrl) < maps.length - 1
          ? maps[maps.indexOf(this.state.mapUrl) + 1]
          : maps[0]
    });
  };

  // function to be sent to Header -> GameList to get changed game ID
  handleGameChange = gameId => {
    this.setState({
      currentGameId: gameId
    });
  };

  render() {
    const initialPosition = [this.state.lat, this.state.lng];
    return (
      <div>
        <UserMap
          position={initialPosition}
          zoom={this.state.zoom}
          mapUrl={this.state.mapUrl}
          currentGameId={this.state.currentGameId}
        />
        ,
        <Header
          handleLayerChange={this.handleLayerChange}
          handleGameChange={this.handleGameChange}
        />
      </div>
    );
  }
}

export default App;
