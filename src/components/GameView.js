import React from "react";
import UserMap from "./UserMap";
import TaskListButton from "./TaskListButton";
import { Link } from "react-router-dom";
import EditGameForm from "./EditGameForm";
import JoinGameForm from "./JoinGameForm";
import PlayerlistView from "./PlayerlistView";
import NotificationView from "./NotificationView";

export default class GameView extends React.Component {
  state = {
    gameInfo: null,
    role: "", //empty, soldier, factionleader, admin
    form: "",
    lat: 62.2416479,
    lng: 25.7597186,
    zoom: 13,
    mapUrl: "https://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.jpg"
  };

  componentDidMount() {
    let gameId = new URL(window.location.href).searchParams.get("id");
    let token = sessionStorage.getItem("token");
    let error = false;
    // TODO: redirect to root if the game is not found

    // Get game info
    fetch(`${process.env.REACT_APP_API_URL}/game/${gameId}`)
      .then(res => res.json())
      .then(res => {
        this.setState({
          gameInfo: res
        });
      })
      .catch(error => console.log(error));

    // Get Role
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

  handleLeaveFaction = e => {};

  render() {
    const initialPosition = [this.state.lat, this.state.lng];

    return (
      <div>
        <Link to="/">
          <button>Game selection</button>
        </Link>
        {this.state.gameInfo !== null && (
          <div>
            <div>Game Name: {this.state.gameInfo.name}</div>
            {this.state.role === "" && (
              <div>You don't have a role in this game</div>
            )}
            {this.state.role !== "" && (
              <div>Your role in this game: {this.state.role}</div>
            )}
            {this.state.role === "admin" && (
              <button
                id="editGameButton"
                onClick={() => this.setState({ form: "edit" })}
              >
                Edit
              </button>
            )}
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
              />
            )}
            {this.state.role !== "admin" && this.state.role !== "" && (
              <button id="leaveFactionButton" onClick={this.handleLeaveFaction}>
                Leave Faction
              </button>
            )}
            <UserMap
              position={initialPosition}
              zoom={this.state.zoom}
              mapUrl={this.state.mapUrl}
              currentGameId={this.state.gameInfo.id}
            />
            {this.state.form === "edit" && (
              <EditGameForm
                gameId={this.state.gameInfo.id}
                toggleView={() => this.setState({ form: "" })}
                onEditSave={() => {
                  this.getGameInfo();
                }}
              />
            )}
            {this.state.form === "join" && (
              <JoinGameForm
                gameId={this.state.gameInfo.id}
                toggleView={() => this.setState({ form: "" })}
                onJoin={() => console.log("joinde")}
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
              />
            )}
          </div>
        )}
      </div>
    );
  }
}
