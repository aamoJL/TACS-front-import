import React from "react";
import UserMap from "./UserMap";
import TaskListButton from "./TaskListButton";
import { Link } from "react-router-dom";
import JoinGameForm from "./JoinGameForm";
import PlayerlistView from "./PlayerlistView";
import NotificationView from "./NotificationView";
import GameStateButtons from "./GameStateButtons";
import ClientSocket from "./Socket";
import NotificationPopup from "./NotificationPopup";
import ScoreCounter from "./ScoreCounter";
import ScoreForm from "./ScoreForm";

export default class GameView extends React.Component {
  state = {
    gameInfo: null,
    role: "", //empty, soldier, factionleader, admin
    form: "",
    lat: 62.2416479,
    lng: 25.7597186,
    zoom: 13,
    mapUrl: "https://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.jpg",
    socketSignal: null,
    socket: null
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
        this.setState({ role: res.role });
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

  render() {
    const initialPosition = this.state.gameInfo
      ? [this.state.gameInfo.center.lat, this.state.gameInfo.center.lng]
      : null;
    return (
      <div>
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
            <div className="header">
              <Link to="/">
                <button id="gameViewGameSelectionButton">Game selection</button>
              </Link>
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
              <div>Game Name: {this.state.gameInfo.name}</div>
              {this.state.role === "" && (
                <div>You don't have a role in this game</div>
              )}
              {this.state.role !== "" && (
                <div>Your role in this game: {this.state.role}</div>
              )}
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
                <button
                  id="notificationsButton"
                  onClick={() => this.setState({ form: "notifications" })}
                >
                  Notifications
                </button>
              )}
              {this.state.role !== "" && (
                <button
                  id="showPlayersButton"
                  onClick={() => this.setState({ form: "players" })}
                >
                  Players
                </button>
              )}
              {this.state.role !== "" && (
                <TaskListButton
                  gameId={this.state.gameInfo.id}
                  role={this.state.role}
                  factions={this.state.gameInfo.factions}
                  socketSignal={this.state.socketSignal}
                />
              )}
              {this.state.role === "admin" && (
                <button
                  id="scoreFormButton"
                  onClick={() => this.setState({ form: "score" })}
                >
                  Add score
                </button>
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
              {this.state.form === "players" && (
                <PlayerlistView
                  gameId={this.state.gameInfo.id}
                  gameState={this.state.gameInfo.state}
                  role={this.state.role}
                  toggleView={() => this.setState({ form: "" })}
                />
              )}
              {this.state.form === "notifications" && (
                <NotificationView
                  gameId={this.state.gameInfo.id}
                  toggleView={() => this.setState({ form: "" })}
                  socket={this.state.socket}
                  role={this.state.role}
                  gameState={
                    this.state.gameInfo !== undefined
                      ? this.state.gameInfo.state
                      : ""
                  }
                />
              )}
              {this.state.form === "score" && (
                <ScoreForm
                  gameId={this.state.gameInfo.id}
                  factions={this.state.gameInfo.factions}
                  toggleView={() => this.setState({ form: "" })}
                  role={this.state.role}
                  gameState={
                    this.state.gameInfo !== undefined
                      ? this.state.gameInfo.state
                      : ""
                  }
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
