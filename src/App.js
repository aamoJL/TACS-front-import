import React, { Component } from 'react';

import styles from './App.css';
import UserMap from './components/UserMap';
import Header from './components/Header';

class App extends Component {
  constructor() {
    super();
    // set initial state
    this.state = {
      lat: 62.2416479,
      lng: 25.7597186,
      zoom: 13
    };
  }

  render() {
    const initialPosition = [this.state.lat, this.state.lng];
    return (
      <div>
        <UserMap position={initialPosition} zoom={this.state.zoom} />,
        <Header />
      </div>
    );
  }
}

export default App;
