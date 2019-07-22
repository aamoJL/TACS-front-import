import React, { Component } from "react";
import { Map, TileLayer, ZoomControl, Marker, Popup } from "react-leaflet";
import DrawTools from "./DrawTools.js";
import Player from "./Player.js";

class UserMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ownLat: null,
      ownLng: null,
      mapUrl: "https://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.jpg",
      drawings: [],
      flagboxes: [],
      currentGameId: null
    };

    this.watchPositionId = null;
  }

  componentDidMount() {
    this.getCurrentPosition(position => {
      this.setCurrentPosition(position);
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.currentGameId === null) {
      return false;
    }
    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.socketSignal === "drawing-update") {
      this.fetchGeoJSON();
    } else if (prevProps.socketSignal === "flagbox-event") {
      this.fetchFlagboxData();
    }
  }

  // fetch all flagbox data
  fetchFlagboxData = _ => {
    fetch(
      `${process.env.REACT_APP_API_URL}/game/flag-events/${
        this.props.currentGameId
      }`
    )
      .then(res => {
        if (res.ok) return res.json();
        else throw Error(res.statusText);
      })
      .then(data => {
        this.setState({
          flagboxes: data
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  // Sends the players drawings to the backend (and database)
  sendGeoJSON = data => {
    fetch(
      `${process.env.REACT_APP_API_URL}/draw/mapdrawing/${
        this.props.currentGameId
      }`,
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }
    );
  };

  // Get the drawings from the backend and add them to the state, so they can be drawn
  fetchGeoJSON = _ => {
    fetch(
      `${process.env.REACT_APP_API_URL}/draw/map/${this.props.currentGameId}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json"
        }
      }
    )
      .then(res => {
        if (res.ok) return res.json();
        else throw Error(res.statusText);
      })
      .then(data => {
        this.setState({
          drawings: data
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  changeDragState = status => {
    // for some reason React's onMouseOver event fires gazillion times in a second
    // evading by checking if the isDraggable state is the same as what's coming. still fires two or three times, though
    if (status === this.state.isDraggable) {
      return;
    } else {
      this.setState({
        isDraggable: status
      });
    }
  };

  componentWillUnmount() {
    if (this.watchPositionId != null) {
      navigator.geolocation.clearWatch(this.watchPositionId);
    }
  }

  setCurrentPosition(position) {
    this.setState({
      ownLat: position.coords.latitude,
      ownLng: position.coords.longitude
    });
  }

  getCurrentPosition(callback) {
    if (!navigator.geolocation) {
      console.log("Can't get geolocation :/");
    } else {
      // Position tracking options
      const options = {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0
      };

      if (this.watchPositionId != null) {
        navigator.geolocation.clearWatch(this.watchPositionId);
      }

      this.watchPositionId = navigator.geolocation.watchPosition(
        position => {
          //success
          if (position != null) {
            callback(position);
          }
        },
        error => {
          console.log(error);
          // disable tracking
          if (this.watchPositionId != null) {
            navigator.geolocation.clearWatch(this.watchPositionId);
          }
        },
        options
      );
    }
  }

  // permit fetching tracking data if user has admin or factionleader role
  // and the game is in STARTED or PAUSED state
  permitTrackingFetch = _ => {
    return (
      (this.props.role === "admin" || this.props.role === "factionleader") &&
      ["STARTED", "PAUSED"].includes(this.props.gameState)
    );
  };

  render() {
    return (
      <Map
        className="map"
        center={this.props.position}
        zoom={this.props.zoom}
        minZoom="7"
        maxZoom="18"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.maanmittauslaitos.fi/">Maanmittauslaitos</a>'
          url={this.props.mapUrl}
        />
        <ZoomControl position="topleft" />
        <DrawTools
          position={this.props.position}
          drawings={this.state.drawings}
          flagboxes={this.state.flagboxes}
          sendGeoJSON={this.sendGeoJSON}
          currentGameId={this.props.currentGameId}
          changeDragState={this.changeDragState}
          role={this.props.role}
        />
        {this.state.ownLat !== null && (
          <Marker position={[this.state.ownLat, this.state.ownLng]}>
            <Popup>
              User's real position.
              <br />
            </Popup>
          </Marker>
        )}
        {this.permitTrackingFetch() && (
          <Player
            currentGameId={this.props.currentGameId}
            socketSignal={this.props.socketSignal}
          />
        )}
        {this.props.children}
      </Map>
    );
  }
}
export default UserMap;
