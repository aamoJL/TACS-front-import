import React, { Component } from 'react';
import '../node_modules/leaflet-draw/dist/leaflet.draw.css'
import './App.css';

import UserMap from './components/UserMap.js'


class App extends Component {
  constructor() {
    super();
    // set initial state
    this.state = {
      lat: 62.2416479,
      lng: 25.7597186,
      zoom: 13,
    }
  }
  render(){
  const initialPosition = [this.state.lat, this.state.lng];
    return (
		<div>
			<UserMap position={initialPosition} zoom={this.state.zoom}/>
		</div>
    );
  }
}

export default App;
