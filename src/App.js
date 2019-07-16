import React, { Component } from "react";
import "../node_modules/leaflet-draw/dist/leaflet.draw.css";
import "./App.css";
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
    return (
      <Route
        render={props =>
          !this.state.logged ? (
            <LoginForm view="" handleState={this.handleState} />
          ) : (
            <Redirect
              to={{
                pathname: "/"
              }}
            />
          )
        }
      />
    );
  };

  registerForm = () => {
    return (
      <Route
        render={props =>
          !this.state.logged ? (
            <RegisterForm view="" handleState={this.handleState} />
          ) : (
            <Redirect
              to={{
                pathname: "/"
              }}
            />
          )
        }
      />
    );
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
            {/* Debug Sign out button ------------------------ */}
            {this.state.logged && (
              <div>
                <label>Logged in: {sessionStorage.getItem("name")}</label>
                <button
                  onClick={() => {
                    sessionStorage.setItem("token", "");
                    this.setState({ logged: false });
                  }}
                >
                  Sign out
                </button>
              </div>
            )}
            {/* Debug End ----------------------- */}

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
                <Route
                  path="/game"
                  component={() => {
                    return <GameView />;
                  }}
                />
                <Route
                  exact
                  path="/"
                  component={() => {
                    return <GameSelection />;
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
