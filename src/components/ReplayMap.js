// https://github.com/linghuam/Leaflet.TrackPlayBack

import React from "react";
import { Link } from "react-router-dom";
import L from "leaflet";
import "../track-playback/src/leaflet.trackplayback/clock";
import "../track-playback/src/leaflet.trackplayback/index";
import "../track-playback/src/control.trackplayback/control.playback";
import "../track-playback/src/control.trackplayback/index";

export default class ReplayMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // stores the playback object
      playback: null,
      // stores player locations from backend
      players: [],
      // stores all factions from the game
      factions: [],
      // stores all scores from the game
      scores: [],
      // stores all drawings from backend
      allGeoJSON: [],
      // stores all active drawings on the map
      activeGeoJSON: []
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
      players: replaydata.players,
      factions: replaydata.factions,
      scores: replaydata.scores
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
    this.map = L.map(this.refs.map).setView([62.3, 25.7], 15);
    L.tileLayer("https://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.jpg", {
      attribution:
        '&copy; <a href="https://www.maanmittauslaitos.fi/">Maanmittauslaitos</a>'
    }).addTo(this.map);
    this.trackplayback = new L.TrackPlayBack(this.state.players, this.map, {
      trackPointOptions: {
        // whether to draw track point
        isDraw: true,
        // whether to use canvas to draw it, if false, use leaflet api `L.circleMarker`
        useCanvas: false,
        stroke: true,
        color: "#000000",
        fill: true,
        fillColor: "rgba(0,0,0,0)",
        opacity: 0,
        radius: 12
      },
      targetOptions: {
        // whether to use an image to display target, if false, the program provides a default
        useImg: true,
        // if useImg is true, provide the imgUrl
        imgUrl: "../light-infantry.svg",
        // the width of target, unit: px
        width: 60,
        // the height of target, unit: px
        height: 40,
        // the stroke color of target, effective when useImg set false
        color: "#00f",
        // the fill color of target, effective when useImg set false
        fillColor: "#9FD12D"
      },
      clockOptions: {
        // the default speed
        // caculate method: fpstime * Math.pow(2, speed - 1)
        // fpstime is the two frame time difference
        speed: 10,
        // the max speed
        maxSpeed: 100
      },
      toolTipOptions: {
        offset: [0, 0],
        direction: "top",
        permanent: false
      },
      filterOptions: {
        factions: this.state.factions
      },
      scoreOptions: {
        scores: this.state.scores
      }
    });
    this.setState({
      playback: this.trackplayback
    });
    this.trackplaybackControl = L.trackplaybackcontrol(this.trackplayback);
    this.trackplaybackControl.addTo(this.map);
  };

  render() {
    return (
      /*       <Map
        className="map"
        ref={this.map}
        center={[62.3, 25.7]}
        zoom={15}
        minZoom="7"
        maxZoom="17"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.maanmittauslaitos.fi/">Maanmittauslaitos</a>'
          url={"https://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.jpg"}
        />
        <ZoomControl position="topright" />
        {this.state.activeGeoJSON.features && (
          <DrawGeoJSON geoJSONLayer={this.state.activeGeoJSON} />
        )}
      </Map> */
      <React.Fragment>
        <Link to="/">
          <button>Game selection</button>
        </Link>
        <div className="map" ref="map" />
      </React.Fragment>
    );
  }
}
