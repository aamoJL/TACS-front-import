import React, {Component} from 'react';
import {
	Map,
	TileLayer,
  Marker,
  GeoJSON
} from 'react-leaflet'
import DrawTools from './DrawTools'

class UserMap extends Component {
  constructor(props){
    super(props);

    this.state = {
      ownLat: null,
      ownLng: null,
      mapUrl: 'https://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.jpg',
      geojsonLayer: {
        "type": "FeatureCollection",
        "features": []
      }
      
    }

    this.setCurrentPosition = this.setCurrentPosition.bind(this);
    this.watchPositionId = null;
  }

  componentDidMount(){
    this.getCurrentPosition((position) => {
      //this.setCurrentPosition(position);
    });
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
      body: this.state.geojsonLayer
    })
      .then(res => res.json())
      .then(result => console.log(result))
  }


  componentWillUnmount(){
    if(this.watchPositionId != null){
      navigator.geolocation.clearWatch(this.watchPositionId);
    }
  }
  // // Sets the state for the changed position
  // setCurrentPosition(position){
  //   this.setState({
  //     ownLat: position.coords.latitude,
  //     ownLng: position.coords.longitude,
  //     geojsonLayer: {
  //       "type": "FeatureCollection",
  //       "latitude": "",
  //       "longitude": "",
  //       "timestamp": "",
  //       "features": [{
  //         "type": "Feature",
  //         "properties": {},
  //         "geometry": {
  //           "type": "Point",
  //           "coordinates":  [ position.coords.latitude, position.coords.longitude ]
  //         }
  //       }]
  //     }
  //   });
  //   console.log(this.state.geojsonLayer.coordinates)
  // }

  setCurrentPosition(data){
    this.setState({
      ...this.state,
      geojsonLayer: data
    });
    console.log("User mapin statessa oleva geojson: " + JSON.stringify(this.state.geojsonLayer))
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

  render() {
    return (
      <Map className='map' center={this.props.position} zoom={this.props.zoom}>           
          <TileLayer
            attribution='&copy; <a href="https://www.maanmittauslaitos.fi/">Maanmittauslaitos</a>'
            url={this.props.mapUrl}
          />
          <DrawTools position={this.props.position} setCurrentPosition={this.setCurrentPosition}/>
          {this.state.ownLat !== null && <Marker position={[this.state.ownLat, this.state.ownLng]}>
          </Marker>}
          <GeoJSON key={JSON.stringify(this.state.geojsonLayer)} data={this.state.geojsonLayer} /> 
      </Map>
    ); // this.state.geojsonLayer
  }
}

export default UserMap;