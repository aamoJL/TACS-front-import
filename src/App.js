import React, { Component } from 'react';
import styles from './App.css';

import UserMap from './components/UserMap.js'
import {LoginForm} from './LoginForm';


class App extends Component {
  constructor() {
    super();
    // set initial state
    this.state = {
      lat: 62.2416479,
      lng: 25.7597186,
      zoom: 13,
      logged: false,
      name: ''
    }

    this.login = this.login.bind(this);
  }

  componentDidMount(){
    // log in if cookie with username is found
    let name = getCookie('username');
    if(name !== ''){
      this.login({
        logged: true,
        name: name
      });
    }
  }

  login(loginInfo){
    if(loginInfo.logged !== this.state.logged){
      this.setState({
        logged: loginInfo.logged,
        name: loginInfo.name
      });
      document.cookie = 'username='+loginInfo.name+';path=/;';
    }
    else{
      console.log('Wrong info');
    }
  }

  render(){
  const initialPosition = [this.state.lat, this.state.lng];
    return (
      <div>
        <p>{this.state.logged ? 'Logged in: ' + this.state.name : ''}</p>
        {!this.state.logged && <LoginForm onSubmit={this.login}/>}
        {this.state.logged && <button onClick={() => this.login({
          logged: false,
          name: ''
        })}>Logout</button>}
        <UserMap position={initialPosition} zoom={this.state.zoom}/>
      </div>
    );
  }
}

function getCookie(cname){
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if(c.indexOf(name) === 0){
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export default App;
