import React from "react";
import UserMap from "./UserMap";
import TaskListButton from "./TaskListButton";
import { BrowserRouter as Router, Link } from "react-router-dom";
import EditGameForm from "./EditGameForm";
import JoinGameForm from "./JoinGameForm";
import PlayerlistView from "./PlayerlistView";
import NotificationView from "./NotificationView";

export default class GameView extends React.Component {
  state = {
    gameInfo: null,
    form: "",
    lat: 62.2416479,
    lng: 25.7597186,
    zoom: 13,
    mapUrl: "https://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.jpg"
  };

  componentDidMount() {
    let gameId = new URL(window.location.href).searchParams.get("id");
    fetch(`${process.env.REACT_APP_API_URL}/game/${gameId}`)
      .then(res => res.json())
      .then(res => {
        this.setState({
          gameInfo: res
        });
      })
      .catch(error => console.log(error));
  }

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
            <button
              id="editGameButton"
              onClick={() => this.setState({ form: "edit" })}
            >
              Edit
            </button>
            <button
              id="joinGameButton"
              onClick={() => this.setState({ form: "join" })}
            >
              Join
            </button>
            <button
              id="showPlayersButton"
              onClick={() => this.setState({ form: "players" })}
            >
              Players
            </button>
            <button
              id="notificationsButton"
              onClick={() => this.setState({ form: "notifications" })}
            >
              Notifications
            </button>
            <TaskListButton gameId={this.state.gameInfo.id} />
            <button
              id="leaveFactionButton"
              onClick={() => console.log("WIP: leave faction")}
            >
              Leave Faction
            </button>
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
