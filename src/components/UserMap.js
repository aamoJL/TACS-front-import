import React, {Component} from 'react';
import {
	Map,
	TileLayer,
  ZoomControl,
  Marker,
  Popup
} from 'react-leaflet'
import L from 'leaflet'
import DrawTools from './DrawTools.js'

class UserMap extends Component {
  constructor(props){
    super(props);
    this.state = {
      ownLat: null,
      ownLng: null,
      mapUrl: 'https://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.jpg',
      bounds: L.latLngBounds(18.786621, 59.337183)
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

  testers = (asd) => {
    console.log(asd.target.getZoom());
  }

  render() {
    return (
      <Map 
        className='map'
        center={this.props.position}
        zoom={this.props.zoom}
        minZoom='7'
        maxZoom='17'
        // onzoomend={this.testers} // getting the zoom level
        maxBounds={this.props.bounds}
        maxBoundsViscosity='1'
        zoomControl={false} /* remove the default zoom control button at the top left corner */>
        <TileLayer
          attribution='&copy; <a href="https://www.maanmittauslaitos.fi/">Maanmittauslaitos</a>'
          url={this.props.mapUrl}
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