import React, {Component} from 'react';
import {
	Map,
	TileLayer,
  Marker,
  Popup
} from 'react-leaflet'
import DrawTools from './DrawTools'

class UserMap extends Component {
  constructor(props){
    super(props);
    this.state = {
      ownLat: null,
      ownLng: null,
      mapUrl: 'https://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.jpg',
      marker: {
        type: "FeatureCollection",
        latitude: "",
        longitude: "",
        timestamp: "",
        features: [{
          type: "Feature",
          properties: {},
          geometry: {
            type: "Point",
            coordinates: [
              62.2416479,
              25.7597186
            ]
          }
        }]
      }
    }

    this.watchPositionId = null;
  }

  componentDidMount(){
    console.log(JSON.stringify(this.state.marker))
    this.getCurrentPosition((position) => {
      this.setCurrentPosition(position);
    });
    console.log(JSON.stringify(this.state.marker))
    //sendGeoJSON()
  }
  // Sends the players marker to the backend
  sendGeoJSON(){
    fetch('http://localhost:5000/mapmarkers/insertLocation', {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.marker)
    })
      .then(res => res.json())
      .then(result => console.log(result))
  }


  componentWillUnmount(){
    if(this.watchPositionId != null){
      navigator.geolocation.clearWatch(this.watchPositionId);
    }
  }

  setCurrentPosition(position){
    this.setState({
      ownLat: position.coords.latitude,
      ownLng: position.coords.longitude,
      marker: {
        features: [
            {
              geometry: {
                type: "Point",
                coordinates: [
                  position.coords.latitude,
                  position.coords.longitude
                ]
              }
            }
          ]
      }
    });
    console.log(this.state.marker)
  }

  getCurrentPosition(callback){
    if(!navigator.geolocation){
      console.log("Can't get geolocation :/");
    }
    else{
      // Position tracking options
      const options = {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0
      }

      if(this.watchPositionId != null){navigator.geolocation.clearWatch(this.watchPositionId);}
      
      this.watchPositionId = navigator.geolocation.watchPosition((position) =>{
        //success
        if(position != null){
          callback(position);
        }
      }, (error) =>{
        console.log(error);
      }, options);
    }
  }

  positionToGeoJSON(position){
    let geoJSON = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Point",
        coordinates: [position.coords.longitude, position.coords.latitude]
      }
    }

    return JSON.stringify(geoJSON);
  }

  mockGeoJSON(){
    return (JSON.stringify({
      type: "FeatureCollection",
      latitude: "",
      longitude: "",
      timestamp: "",
      features: [{
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: [
            62.2416479,
            25.7597186
          ]
        }
      }]
    }))
  }

  render() {
    return (
      <Map className='map' center={this.props.position} zoom={this.props.zoom}>
        <TileLayer
          attribution='&copy; <a href="https://www.maanmittauslaitos.fi/">Maanmittauslaitos</a>'
          url={this.props.mapUrl}
        />
		    <DrawTools position={this.props.position} />
        <Marker position={this.props.position}>
          <Popup maxWidth="600px">
           <img src="wimma.png" alt="Wimma Lab" width="600px"/>
          </Popup>
        </Marker>
        {this.state.ownLat !== null && <Marker position={[this.state.ownLat, this.state.ownLng]}>
        <Popup>
            User's real position.<br />
          </Popup>
        </Marker>}
      </Map>
    );
  }
}

export default UserMap;