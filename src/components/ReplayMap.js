// https://github.com/linghuam/Leaflet.TrackPlayBack

import React from "react";
import L from "leaflet";
import { Map, TileLayer, ZoomControl, Marker, Popup } from "react-leaflet";
import "../track-playback/src/leaflet.trackplayback/clock";
import "../track-playback/src/leaflet.trackplayback/index";
import "../track-playback/src/control.trackplayback/control.playback";
import "../track-playback/src/control.trackplayback/index";
import DrawGeoJSON from "./DrawGeoJSON";

export default class ReplayMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // stores the playback object
      playback: null,
      // stores player locations from backend
      data: null,
      // stores all drawings from backend
      allGeoJSON: [],
      // stores all active drawings on the map
      activeGeoJSON: []
    };
    this.map = React.createRef();
  }

  async componentDidMount() {
    await this.fetchPlayerData();
    //await this.fetchDrawingData();
    //this.tickDrawings();
    this.replay();
  }

  componentWillReceiveProps(nextProps) {}

  // cloud game a1231e2b-aa29-494d-b687-ea2d48cc23df
  // local game wimma 314338f9-b0bb-4bf7-9554-769c7b409bce
  // local game vbox 16977b13-c419-48b4-b7d6-e7620f27bf39
  // fetch player locations from the game
  fetchPlayerData = async () => {
    await fetch(
      `${
        process.env.REACT_APP_API_URL
      }/replay/players/314338f9-b0bb-4bf7-9554-769c7b409bce`,
      {
        method: "GET"
      }
    )
      .then(async res => await res.json())
      .then(
        async res => {
          await this.setState({ data: res });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          console.log(error);
        }
      );
  };

  fetchDrawingData = async () => {
    await fetch(
      `${process.env.REACT_APP_API_URL}/replay/{
		"lng": 25.72588,
		"lat": 62.23147
}`,
      {
        method: "GET"
      }
    )
      .then(async res => await res.json())
      .then(
        async res => {
          await this.setState({ allGeoJSON: res });
        },
        error => {
          console.log(error);
        }
      );
  };

  tickDrawings = () => {
    let activeDrawings = [];
    this.state.allGeoJSON.map(drawing => {
      activeDrawings.push(drawing[0]);
      this.setState({
        activeGeoJSON: {
          type: "FeatureCollection",
          features: [...activeDrawings]
        }
      });
    });
  };

  replay = () => {
    this.map = L.map(this.refs.map).setView([62.3, 25.7], 15);
    L.tileLayer("https://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.jpg", {
      attribution:
        '&copy; <a href="https://www.maanmittauslaitos.fi/">Maanmittauslaitos</a>'
    }).addTo(this.map);
    this.trackplayback = new L.TrackPlayBack(this.state.data, this.map, {
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
        <div className="map" ref="map" />
      </React.Fragment>
    );
  }
}
