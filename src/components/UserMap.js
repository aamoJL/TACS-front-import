import React, {Component} from 'react';
import {
	Map,
	TileLayer,
  ZoomControl,
  Marker,
  Popup
} from 'react-leaflet'
import DrawTools from './DrawTools.js'

class UserMap extends Component {
  constructor(props){
    super(props);
    this.state = {
      ownLat: null,
      ownLng: null,
    }

    this.watchPositionId = null;
  }

  componentDidMount(){
    this.getCurrentPosition((position) => {
      this.setCurrentPosition(position);
    });
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
          attribution='Maanmittauslaitoksen kartta'
          url=' https://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.jpg'
        />
        <ZoomControl position='topright' />
		<DrawTools position={this.props.position} />
        <Marker position={this.props.position}>
          <Popup>
            Se on perjantai, my dudes <br />
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