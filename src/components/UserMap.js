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
      mapUrl: 'https://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.jpg'
    }

    this.watchPositionId = null;
  }

  // componentDidMount(){
  //   this.getCurrentPosition((position) => {
  //     this.setCurrentPosition(position);
  //   });
  // }

  componentWillUnmount(){
    if(this.watchPositionId != null){
      navigator.geolocation.clearWatch(this.watchPositionId);
    }
  }

  setCurrentPosition(position){
    this.setState({
      ownLat: position.coords.latitude,
      ownLng: position.coords.longitude,
    });
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
          <iframe title="Esitys" src="http://avoin.wimmalab.org/" width="600px" height="400px" autoplay frameborder="0">Welcome to Wimma LAB<a href="https://office.com">Microsoft Office</a> presentation, powered by <a href="https://office.com/webapps">Office Online</a>.</iframe>
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