import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

class UserMap extends Component {
  constructor(props){
    super(props);
    this.state = {
      ownLat: null,
      ownLng: null,
    }
  }

  componentDidMount(){
    this.getCurrentPosition((position) => {
      if(position != null){
        this.setState({
          ownLat: position.lat,
          ownLng: position.lng,
        });
      }
    });
  }

  getCurrentPosition(callback){
    if(!navigator.geolocation){
      console.log("Can't get geolocation :/");
      callback(null);
    }
    else{
      navigator.geolocation.getCurrentPosition((position)=> {
        callback({
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
        {this.state.ownLat !== null && <Marker position={[this.state.ownLat, this.state.ownLng]}></Marker>}
      </Map>
    );
  }
}

export default UserMap;
