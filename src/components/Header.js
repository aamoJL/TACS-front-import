import React from "react";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import GameList from "./GameList";
import NewGameForm from "./NewGameForm";

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    form: "", // Popup form (login, register etc.)
    username: null,
    token: null
  };

  // toggles the login/register view
  toggleView = view => {
    this.setState({
      form: view
    });
  };

  handleState = data => {
    sessionStorage.setItem("name", data.name);
    sessionStorage.setItem("token", data.token);
    this.setState({ username: data.name, token: data.token });
  };

  handleLogout = () => {
    this.setState({ username: null, token: null });
    sessionStorage.removeItem("token");
  };

  // verifies the token (if it exists) on element mount with backend server
  componentDidMount() {
    let token = sessionStorage.getItem("token");
    if (token) {
      fetch(`${process.env.REACT_APP_URL}/user/verify`, {
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
                username: sessionStorage.getItem("name"),
                token: token
              });
              // logout user if token has expired / is invalid
            } else {
              this.handleLogout();
            }
          },
          error => {
            console.log(error);
          }
        );
    }
  }

  render() {
    return (
      <div>
        <div className="header">
          {!this.state.username && (
            <button
              id="registerButton"
              onClick={() => this.toggleView("register")}
            >
              register
            </button>
          )}
          {!this.state.username && (
            <button id="loginButton" onClick={() => this.toggleView("login")}>
              login
            </button>
          )}
          {this.state.username && (
            <button
              id="newGameButton"
              onClick={() => this.toggleView("newgame")}
            >
              New Game
            </button>
          )}
          {this.state.username && (
            <button id="logoutButton" onClick={this.handleLogout}>
              logout
            </button>
          )}
          {this.state.username && <button>{this.state.username}</button>}
          <button id="changeLayerButton" onClick={this.props.handleLayerChange}>
            change layer
          </button>
          <GameList handleGameChange={this.props.handleGameChange} />
        </div>
        {this.state.form === "register" && (
          <RegisterForm
            view=""
            handleState={this.handleState}
            toggleView={this.toggleView}
          />
        )}
        {this.state.form === "login" && (
          <LoginForm
            view=""
            handleState={this.handleState}
            toggleView={this.toggleView}
          />
        )}
        {this.state.form === "newgame" && (
          <NewGameForm
            view=""
            handleState={this.handleState}
            toggleView={this.toggleView}
          />
        )}
      </div>
    );
  }
}

export default Header;
