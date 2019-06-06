import React, {Component} from 'react';
import {
	Map,
	TileLayer,
	ZoomControl
} from 'react-leaflet'
import DrawTools from './DrawTools.js'


class UserMap extends Component {
  constructor(props){
    super(props);
    this.state = {
      ownLat: null,
      ownLng: null,
    }

    this.DeviceLocationUpdater = null;
    this.updateDeviceLocation = this.updateDeviceLocation.bind(this);
  }

  componentDidMount(){
    this.startDeviceLocationUpdater();
  }

  componentWillUnmount(){
    if(this.DeviceLocationUpdater != null){
      clearInterval(this.DeviceLocationUpdater);
    }
  }

  startDeviceLocationUpdater(){
    this.DeviceLocationUpdater = setInterval(this.updateDeviceLocation, 1000);
  }

  updateDeviceLocation(){
    this.getCurrentPosition((position) => {
      this.setCurrentPosition(position);
    });
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

      navigator.geolocation.getCurrentPosition((position) =>{
        //success
        if(position != null){
          callback(position);
        }
      }, (error) =>{
        console.log(error);
      }, options);
    }
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