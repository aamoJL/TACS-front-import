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
      geoJSONLayer: {
        type: "FeatureCollection",
        features: []
      },
      currentGameId: null,
      isDraggable: true
    };

    this.sendGeoJSON = this.sendGeoJSON.bind(this);
    this.fetchGeoJSON = this.fetchGeoJSON.bind(this);
    this.setCurrentPosition = this.setCurrentPosition.bind(this);
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
    }
  }

  // Sends the players drawings to the backend (and database)
  sendGeoJSON(layerToDatabase) {
    fetch(
      `${process.env.REACT_APP_API_URL}/draw/mapdrawing/${
        this.props.currentGameId
      }`,
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: "FeatureCollection",
          drawingIsActive: layerToDatabase.drawingIsActive,
          mapDrawingId: layerToDatabase.mapDrawingId,
          data: layerToDatabase.data
        })
      }
    );
  }

  // Get the drawings from the backend and add them to the state, so they can be drawn
  fetchGeoJSON() {
    fetch(
      `${process.env.REACT_APP_API_URL}/draw/map/${this.props.currentGameId}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )
      .then(res => res.json())
      .then(data => {
        let newFeatures = [];
        data.map(item => {
          newFeatures.push(item);
          return true;
        });

        this.setState({
          geoJSONLayer: {
            type: "FeatureCollection",
            features: [...newFeatures]
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

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

  render() {
    return (
      <Map
        className="map"
        center={this.props.position}
        zoom={this.props.zoom}
        minZoom="7"
        maxZoom="17"
        zoomControl={false}
        dragging={this.state.isDraggable}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.maanmittauslaitos.fi/">Maanmittauslaitos</a>'
          url={this.props.mapUrl}
        />
        <ZoomControl position="topright" />
        <DrawTools
          position={this.props.position}
          sendGeoJSON={this.sendGeoJSON}
          geoJSONLayer={this.state.geoJSONLayer}
          currentGameId={this.props.currentGameId}
          changeDragState={this.changeDragState}
        />
        {this.state.ownLat !== null && (
          <Marker position={[this.state.ownLat, this.state.ownLng]}>
            <Popup>
              User's real position.
              <br />
            </Popup>
          </Marker>
        )}
        <Player
          currentGameId={this.props.currentGameId}
          socketSignal={this.props.socketSignal}
        />
      </Map>
    );
  }
}
export default UserMap;
