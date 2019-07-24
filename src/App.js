import React, { Component } from "react";
import "../node_modules/leaflet-draw/dist/leaflet.draw.css";
import "./css/App.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import GameSelection from "./components/GameSelection";
import GameView from "./components/GameView";
import ReplayMap from "./components/ReplayMap";
import EditGameForm from "./components/EditGameForm";

export default class App extends Component {
  constructor() {
    super();

    // set initial state
    this.state = {
      socketSignal: null,
      logged: false,
      authenticateComplete: false
    };
  }
  // Toggles through the list and changes the mapUrl state
  handleLayerChange = () => {
    const maps = [
      "https://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.jpg",
      "https://tiles.kartat.kapsi.fi/peruskartta/{z}/{x}/{y}.jpg",
      "https://tiles.kartat.kapsi.fi/ortokuva/{z}/{x}/{y}.jpg"
    ];
    this.setState({
      mapUrl:
        maps.indexOf(this.state.mapUrl) < maps.length - 1
          ? maps[maps.indexOf(this.state.mapUrl) + 1]
          : maps[0]
    });
  };

  // function to be sent to Header -> GameList to get changed game ID
  handleGameChange = gameId => {
    this.setState({
      currentGameId: gameId
    });
  };

  handleState = data => {
    sessionStorage.setItem("name", data.name);
    sessionStorage.setItem("token", data.token);
    this.setState({ logged: true });
  };

  // verifies the token (if it exists) on element mount with backend server
  componentDidMount() {
    let token = sessionStorage.getItem("token");
    if (token) {
      fetch(`${process.env.REACT_APP_API_URL}/user/verify`, {
        headers: {
          Authorization: "Bearer " + token
        }
      })
        .then(res => res.json())
        .then(
          result => {
            // if token is still valid, login user
            if (result === true) {
              this.setState({
                logged: true
              });
              // logout user if token has expired / is invalid
            } else {
              this.handleLogout();
            }
          },
          error => {
            console.log(error);
          }
        )
        .then(() => {
          this.setState({
            authenticateComplete: true
          });
        });
    } else {
      this.setState({
        authenticateComplete: true
      });
    }
  }

  loginForm = () => {
    return <LoginForm view="" handleState={this.handleState} />;
  };

  registerForm = () => {
    return <RegisterForm view="" handleState={this.handleState} />;
  };

  replay = () => {
    return <ReplayMap />;
  };

  handleLogout = () => {
    sessionStorage.setItem("token", "");
    sessionStorage.setItem("name", "");
    this.setState({ logged: false, authenticateComplete: true });
  };

  render() {
    // TODO: think better solution to wait for authenticator
    if (!this.state.authenticateComplete) {
      return <div>Authenticating...</div>;
    }

    return (
      <div>
        <Router>
          <div>
            {!this.state.logged && (
              <Switch>
                <Route exact path="/replay" component={this.replay} />
                <Route exact path="/register" component={this.registerForm} />
                <Route exact path="/" component={this.loginForm} />
                {/* Redirect from any other path to root */}
                <Redirect from="*" to="/" />
              </Switch>
            )}
            {this.state.logged && (
              <Switch>
                <Route path="/edit/game" component={() => <EditGameForm />} />
                <Route exact path="/replay" component={this.replay} />
                <Route path="/game" component={() => <GameView />} />
                <Route
                  exact
                  path="/"
                  component={() => {
                    return <GameSelection onLogout={this.handleLogout} />;
                  }}
                />
                {/* Redirect from any other path to root */}
                <Redirect from="*" to="/" />
              </Switch>
            )}
          </div>
        </Router>
      </div>
    );
  }
}
