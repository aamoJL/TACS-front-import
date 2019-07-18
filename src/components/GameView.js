import React from "react";
import UserMap from "./UserMap";
import TaskListButton from "./TaskListButton";
import { Link } from "react-router-dom";
import EditGameForm from "./EditGameForm";
import JoinGameForm from "./JoinGameForm";
import PlayerlistView from "./PlayerlistView";
import NotificationView from "./NotificationView";
import GameStateButtons from "./GameStateButtons";
import ClientSocket from "./Socket";
import NotificationPopup from "./NotificationPopup";
import GameInfoView from "./GameInfoView";

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
    if (window.confirm("Are you sure you want to leave your faction?")) {
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
          }
          return res.json();
        })
        .then(res => {
          alert(res.message);
          this.getPlayerRole(this.state.gameInfo.id);
        })
        .catch(error => console.log(error));
    }
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
    const initialPosition = [this.state.lat, this.state.lng];
    return (
      <div>
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
            <div>Game Name: {this.state.gameInfo.name}</div>
            {this.state.role === "" && (
              <div>You don't have a role in this game</div>
            )}
            {this.state.role !== "" && (
              <div>Your role in this game: {this.state.role}</div>
            )}
            {this.state.role === "admin" &&
              this.state.gameInfo.state === "CREATED" && (
                <button
                  id="editGameButton"
                  onClick={() => this.setState({ form: "edit" })}
                >
                  Edit
                </button>
              )}
            <button
              id="gameInfoButton"
              onClick={() => this.setState({ form: "info" })}
            >
              Game Info
            </button>
            {this.state.role === "" && (
              <button
                id="joinGameButton"
                onClick={() => this.setState({ form: "join" })}
              >
                Join
              </button>
            )}
            <button
              id="showPlayersButton"
              onClick={() => this.setState({ form: "players" })}
            >
              Players
            </button>
            {this.state.role !== "" && (
              <button
                id="notificationsButton"
                onClick={() => this.setState({ form: "notifications" })}
              >
                Notifications
              </button>
            )}
            {this.state.role !== "" && (
              <TaskListButton
                gameId={this.state.gameInfo.id}
                role={this.state.role}
                factions={this.state.gameInfo.factions}
              />
            )}
            {this.state.role !== "admin" && this.state.role !== "" && (
              <button id="leaveFactionButton" onClick={this.handleLeaveFaction}>
                Leave Faction
              </button>
            )}
            {this.state.role === "admin" && (
              <GameStateButtons
                gameState={this.state.gameInfo.state}
                gameId={this.state.gameInfo.id}
              />
            )}
            <UserMap
              position={initialPosition}
              zoom={this.state.zoom}
              mapUrl={this.state.mapUrl}
              currentGameId={this.state.gameInfo.id}
              socketSignal={this.state.socketSignal}
              role={this.state.role}
            >
              <NotificationPopup socketSignal={this.state.socketSignal} />
            </UserMap>
            {this.state.form === "edit" && (
              <EditGameForm
                gameId={this.state.gameInfo.id}
                toggleView={() => this.setState({ form: "" })}
                onEditSave={() => this.getGameInfo(this.state.gameInfo.id)}
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
            {this.state.form === "info" && (
              <GameInfoView
                gameInfo={this.state.gameInfo}
                toggleView={() => this.setState({ form: "" })}
              />
            )}
          </div>
        )}
      </div>
    );
  }
}
