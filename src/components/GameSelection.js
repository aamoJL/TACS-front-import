import React from "react";
import GameList from "./GameList";
import NewGameForm from "./NewGameForm";

/*
Component for a game selection page.
Displays GameList and NewGameForm.
*/

import logo from "../icons/tacs-icon-neg.png";
export default class GameSelection extends React.Component {
  state = {
    newGameForm: false,
    games: []
  };

  // Gets games when the page loads
  componentDidMount() {
    this.getGames();
  }

  // Gets games from the server and sets them to state
  getGames() {
    fetch(`${process.env.REACT_APP_API_URL}/game/listgames`)
      .then(response => response.json())
      .then(games => {
        this.setState({
          games: games
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  // Sends the logout callback from props
  handleLogout = e => {
    this.props.onLogout();
  };

  render() {
    return (
      <div>
        <div className="navbar navbar-dark shadow-sm">
          <div className="container d-flex justify-content-between">
            <img
              className="tacs-icon-neg m-2"
              src={logo}
              height="35"
              alt="tacs icon"
            />
            <button
              className="btn btn-secondary"
              id="logoutButton"
              onClick={this.handleLogout}
            >
              Log out
            </button>
          </div>
        </div>

        <div className="d-flex flexbox-container flex-fill justify-content-center">
          <h1 className="gamesheader">Games</h1>
        </div>

        <div className="d-flex flexbox-container flex-fill justify-content-center">
          <button
            id="newGameButton"
            onClick={() => this.setState({ newGameForm: true })}
          >
            + Add New Game
          </button>
        </div>

        <div className="d-flex flexbox-container flex-fill justify-content-center games">
          {this.state.newGameForm && (
            <NewGameForm
              view=""
              handleState={this.handleState}
              toggleView={() =>
                this.setState({ newGameForm: false }, () => {
                  this.getGames();
                })
              }
            />
          )}
          <GameList
            games={this.state.games}
            onEditSave={() => {
              this.getGames();
            }}
          />
        </div>

        <div className="row">
          <div className=" justify-content-center text-center footer text-muted">
            &copy; 2019 TACS
          </div>
        </div>
      </div>
    );
  }
}
