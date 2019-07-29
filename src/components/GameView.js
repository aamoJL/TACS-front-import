import React from "react";
import UserMap from "./UserMap";
import TaskListButton from "./TaskListButton";
import { Link } from "react-router-dom";
import JoinGameForm from "./JoinGameForm";
import GameStateButtons from "./GameStateButtons";
import ClientSocket from "./Socket";
import NotificationPopup from "./NotificationPopup";
import ScoreCounter from "./ScoreCounter";
import NotificationButton from "./NotificationButton";
import AddScoreButton from "./AddScoreButton";
import PlayerListButton from "./PlayerListButton";

export default class GameView extends React.Component {
  state = {
    gameInfo: null,
    role: "", //empty, soldier, factionleader, admin
    userFaction: undefined,
    form: "",
    lat: 62.2416479,
    lng: 25.7597186,
    zoom: 13,
    mapUrl: "https://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.jpg",
    socketSignal: null,
    socket: null,
    showNavbar: true,
    showNavbarText: "Hide"
  };

  componentDidMount() {
    let gameId = new URL(window.location.href).searchParams.get("id");

    this.getGameInfo(gameId);
    this.getPlayerRole(gameId);
  }

  getPlayerRole(gameId) {
    let token = sessionStorage.getItem("token");

    fetch(`${process.env.REACT_APP_API_URL}/faction/check-faction/${gameId}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        this.setState({ role: res.role, userFaction: res.factionId });
      })
      .catch(error => console.log(error));
  }

  getGameInfo(gameId) {
    fetch(`${process.env.REACT_APP_API_URL}/game/${gameId}`)
      .then(res => {
        if (!res.ok) {
          throw Error();
        } else {
          return res.json();
        }
      })
      .then(res => {
        this.setState({
          gameInfo: res
        });
      })
      .catch(error => {
        alert("Game not found");
        window.document.location.href = "/";
      });
  }

  handleLeaveFaction = e => {
    let token = sessionStorage.getItem("token");
    fetch(
      `${process.env.REACT_APP_API_URL}/faction/leave/${
        this.state.gameInfo.id
      }`,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token
        }
      }
    )
      .then(res => {
        if (!res.ok) {
          throw Error();
        } else {
          return res.json();
        }
      })
      .then(res => {
        alert(res.message);
        this.getPlayerRole(this.state.gameInfo.id);
      })
      .catch(error => {
        alert("Game not found");
        window.document.location.href = "/";
      });
  };

  // setting the socket signal automatically fires shouldComponentUpdate function where socketSignal prop is present
  // setting socketSignal to null immediately after to avoid multiple database fetches
  getSocketSignal = data => {
    this.setState(
      {
        socketSignal: data
      },
      () => {
        this.setState({
          socketSignal: null
        });
      }
    );
  };

  onSocketChange = newSocket => {
    this.setState({
      socket: newSocket
    });
  };

  handleShowNavbar = e => {
    if (this.state.showNavbar) {
      this.setState({
        showNavbar: false,
        showNavbarText: "Show"
      });
    } else {
      this.setState({
        showNavbar: true,
        showNavbarText: "Hide"
      });
    }
  };

  render() {
    const initialPosition = this.state.gameInfo
      ? [this.state.gameInfo.center.lat, this.state.gameInfo.center.lng]
      : null;
    return (
      <div className="game-view-container">
        {this.state.gameInfo !== null && (
          <div>
            <ScoreCounter
              gameId={this.state.gameInfo.id}
              socketSignal={
                this.state.socketSignal === null
                  ? null
                  : this.state.socketSignal.type
              }
            />
            <button
              id="showNavbarButton"
              className="show-navbar-button"
              onClick={this.handleShowNavbar}
            >
              {this.state.showNavbarText}
            </button>
            <div className={this.state.showNavbar ? "header" : "hidden"}>
              {this.state.gameInfo !== null && (
                <div>
                  {this.state.gameInfo.id && (
                    <ClientSocket
                      gameId={this.state.gameInfo.id}
                      getSocketSignal={this.getSocketSignal}
                      onSocketChange={this.onSocketChange}
                    />
                  )}
                </div>
              )}

              <div className="game-view-info-text">
                Logged in as: {this.state.role === "" ? " -" : this.state.role}
              </div>
              <Link to="/">
                <button id="gameViewGameSelectionButton">Game selection</button>
              </Link>
              {this.state.role === "admin" &&
                this.state.gameInfo.state === "CREATED" && (
                  <Link
                    to={{
                      pathname: "/edit/game",
                      search: "?id=" + this.state.gameInfo.id
                    }}
                  >
                    <button id="editGameButton">Edit</button>
                  </Link>
                )}
              <Link
                to={{
                  pathname: "/info/game",
                  search: "?id=" + this.state.gameInfo.id
                }}
              >
                <button id="gameInfoButton">Game Info</button>
              </Link>
              {this.state.role === "" && (
                <button
                  id="joinGameButton"
                  onClick={() => this.setState({ form: "join" })}
                >
                  Join
                </button>
              )}
              {this.state.role !== "" && (
                <NotificationButton
                  gameId={this.state.gameInfo.id}
                  socket={this.state.socket}
                  role={this.state.role}
                  gameState={
                    this.state.gameInfo !== undefined
                      ? this.state.gameInfo.state
                      : ""
                  }
                />
              )}
              {this.state.role !== "" && (
                <PlayerListButton
                  gameId={this.state.gameInfo.id}
                  role={this.state.role}
                  gameState={
                    this.state.gameInfo !== undefined
                      ? this.state.gameInfo.state
                      : ""
                  }
                />
              )}
              {this.state.role !== "" && (
                <TaskListButton
                  gameId={this.state.gameInfo.id}
                  role={this.state.role}
                  factions={this.state.gameInfo.factions}
                  socketSignal={this.state.socketSignal}
                  userFaction={this.state.userFaction}
                />
              )}
              {this.state.role === "admin" && (
                <AddScoreButton
                  gameId={this.state.gameInfo.id}
                  factions={this.state.gameInfo.factions}
                  role={this.state.role}
                  gameState={
                    this.state.gameInfo !== undefined
                      ? this.state.gameInfo.state
                      : ""
                  }
                />
              )}
              {this.state.role !== "admin" && this.state.role !== "" && (
                <button
                  id="leaveFactionButton"
                  onClick={this.handleLeaveFaction}
                >
                  Leave Faction
                </button>
              )}
              {this.state.role === "admin" && (
                <GameStateButtons
                  gameState={this.state.gameInfo.state}
                  gameId={this.state.gameInfo.id}
                />
              )}
              {this.state.form === "join" && (
                <JoinGameForm
                  gameId={this.state.gameInfo.id}
                  toggleView={() => this.setState({ form: "" })}
                  onJoin={() => this.getPlayerRole(this.state.gameInfo.id)}
                />
              )}
            </div>
            {initialPosition && (
              <UserMap
                position={initialPosition}
                zoom={this.state.zoom}
                mapUrl={this.state.mapUrl}
                currentGameId={this.state.gameInfo.id}
                socketSignal={
                  this.state.socketSignal === null
                    ? null
                    : this.state.socketSignal.type
                }
                role={this.state.role}
                gameState={this.state.gameInfo.state}
              >
                <NotificationPopup socketSignal={this.state.socketSignal} />
              </UserMap>
            )}
          </div>
        )}
      </div>
    );
  }
}
