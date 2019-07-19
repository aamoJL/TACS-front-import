// https://github.com/linghuam/Leaflet.TrackPlayBack

import React from "react";
import { Link } from "react-router-dom";
import L from "leaflet";
import "../track-playback/src/leaflet.trackplayback/clock";
import "../track-playback/src/leaflet.trackplayback/index";
import "../track-playback/src/control.trackplayback/control.playback";
import "../track-playback/src/control.trackplayback/index";
import options from "./ReplayConfig";

export default class ReplayMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // stores game's initial location
      location: [62.3, 25.7],
      // stores player locations from backend
      players: [],
      // stores all factions from the game
      factions: [],
      // stores all scores from the game
      scores: [],
      // stores all drawings from backend
      drawings: []
    };
  }

  async componentDidMount() {
    // set gameId to state from URL
    await this.setState({
      gameId: await new URL(window.location.href).searchParams.get("id")
    });
    // fetch all data and set it to state
    let replaydata = await this.fetchReplayData();
    await this.setState({
      location: replaydata.location,
      players: replaydata.players,
      factions: replaydata.factions,
      scores: replaydata.scores,
      drawings: replaydata.drawings
    });
    replaydata ? this.replay() : alert("No replay data was found");
  }

  fetchReplayData = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_API_URL}/replay/${this.state.gameId}`
    );
    if (await res.ok) {
      return await res.json();
    } else {
      alert("Game not found");
      window.document.location.href = "/";
    }
  };

  tickDrawings = () => {
    return this.state.allGeoJSON.map(drawing => {
      return drawing[0];
    });
  };

  replay = () => {
    // create a map for the replay, setView to game's center cords
    this.map = L.map(this.refs.map).setView(
      this.state.location || [62.3, 25.7],
      14
    );
    L.tileLayer("https://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.jpg", {
      attribution:
        '&copy; <a href="https://www.maanmittauslaitos.fi/">Maanmittauslaitos</a>'
    }).addTo(this.map);
    // import options from ReplayConfig.js
    this.trackplayback = new L.TrackPlayBack(this.state, this.map, options);
    this.trackplaybackControl = L.trackplaybackcontrol(this.trackplayback);
    this.trackplaybackControl.addTo(this.map);
  };

  render() {
    return (
      <React.Fragment>
        <Link to="/">
          <button>Game selection</button>
        </Link>
        <div className="map" ref="map" />
      </React.Fragment>
    );
  }
}
