import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

class UserMap extends Component {

  getCurrentPosition(){
    if(!navigator.geolocation){
      console.log("Can't get geolocation :/");
      return null;
    }
    else{
      navigator.geolocation.getCurrentPosition((position)=>{
        return ({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }
  }

  render() {
    return (
      <Map className='map' center={this.props.position} zoom={this.props.zoom}>
        <TileLayer
          attribution='Maanmittauslaitoksen kartta'
          url=' https://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.jpg'
        />
        <Marker position={this.props.position}>
          <Popup>
            Se on perjantai, my dudes <br />
          </Popup>
        </Marker>
      </Map>
    );
  }
}

export default UserMap;
