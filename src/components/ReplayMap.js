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
      // stores player locations from the game
      players: [],
      // stores all factions from the game
      factions: [],
      // stores all scores from the game
      scores: [],
      // stores all drawings from the game
      drawings: [],
      // stores all flagbox data from the game
      objectivepoints: []
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
      drawings: replaydata.drawings,
      objectivepoints: replaydata.objectivepoints
    });
    replaydata ? this.replay() : alert("No replay data was found");
    setInterval(this.animation, 2000);
  }

  sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  // animate some css when flagbox is being captured
  animation = async _ => {
    var boxes = await document.getElementsByClassName("capturing-flagbox");
    if (boxes) {
      for (let i in boxes) {
        if (boxes[i].style) {
          boxes[i].style.width = "100px";
          boxes[i].style.height = "100px";
          boxes[i].style.marginLeft = "-47px";
          boxes[i].style.marginTop = "-77px";
          boxes[i].style.borderRadius = "0%";
          boxes[i].style.backgroundColor = boxes[i].title;
          await this.sleep(400);
          boxes[i].style.backgroundColor = "#ebd7d5";
          boxes[i].style.width = "75px";
          boxes[i].style.height = "75px";
          boxes[i].style.marginLeft = "-47px";
          boxes[i].style.marginTop = "-77px";
          boxes[i].style.borderRadius = "50%";
          await this.sleep(400);
        }
      }
    }
  };

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
    this.trackplaybackControl = L.trackplaybackcontrol(
      this.trackplayback,
      this.map
    );
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
