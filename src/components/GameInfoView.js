import React from "react";
import { Map, TileLayer } from "react-leaflet";
import { Link } from "react-router-dom";

/*
Component for showing game's information
*/

export default class GameInfoView extends React.Component {
  state = {
    gameInfo: null,
    center: []
  };

  // Gets game's id from the URL when the page loads
  componentDidMount() {
    let gameId = new URL(window.location.href).searchParams.get("id");
    this.getGameInfo(gameId);
  }

  // Gets game's information from server and sets it to state
  getGameInfo(gameId) {
    let error = false;
    // Get game info
    fetch(`${process.env.REACT_APP_API_URL}/game/${gameId}`)
      .then(response => {
        if (!response.ok) {
          error = true;
        }
        return response.json();
      })
      .then(json => {
        if (error) {
          throw Error("Game not found");
        } else {
          this.setState({ gameInfo: json });
        }
      })
      .catch(error => {
        alert(error);
        window.document.location.href = "/";
      });
  }

  // Formats date from ISO format to dd.mm.yyyy
  getFormattedDate(date) {
    let day = date.substring(8, 10);
    let month = date.substring(5, 7);
    let year = date.substring(0, 4);
    return day + "." + month + "." + year;
  }

  // Formats time from ISO format to hh:mm
  getFormattedTime(date) {
    let time = date.substring(11, 16);
    return time;
  }

  render() {
    if (this.state.gameInfo === null) {
      return false;
    }
    return (
      <div>
        <h1 className="edit-game-title">Game Info</h1>
        <div className="game-info-view-container">
          <div className="game-info-view-inner-container">
            <p>Game name: </p>
            <p>{this.state.gameInfo.name}</p>
            <p>Description: </p>
            <p>{this.state.gameInfo.desc}</p>
            <p>Date:</p>{" "}
            <p>
              {this.getFormattedDate(this.state.gameInfo.startdate)}{" "}
              {this.getFormattedTime(this.state.gameInfo.startdate)} -{" "}
              {this.getFormattedDate(this.state.gameInfo.enddate)}{" "}
              {this.getFormattedTime(this.state.gameInfo.enddate)}
            </p>
            <h2>Factions</h2>
            {this.state.gameInfo.factions.map(faction => (
              <p key={faction.factionId} style={{ color: faction.colour }}>
                {faction.factionName}
              </p>
            ))}
          </div>
          <div className="game-info-view-inner-container">
            <Map
              id="gameInfoCenterMap"
              scrollWheelZoom={false}
              doubleClickZoom={false}
              dragging={false}
              boxZoom={false}
              zoomControl={false}
              viewport={{
                center: [
                  this.state.gameInfo.center.lat,
                  this.state.gameInfo.center.lng
                ],
                zoom: 13
              }}
              style={{ height: "400px", width: "400px" }}
            >
              <TileLayer
                attribution="Maanmittauslaitoksen kartta"
                url=" https://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.jpg"
              />
            </Map>
          </div>
        </div>
        <div className="edit-game-form-buttons">
          <Link
            to={{
              pathname: "/game",
              search: "?id=" + this.state.gameInfo.id
            }}
          >
            <button id="infoToGameButton">Back to the game</button>
          </Link>
          <Link
            to={{
              pathname: "/",
              search: "?id=" + this.state.gameInfo.id
            }}
          >
            <button id="infoToGameSelectionButton">Game selection</button>
          </Link>
        </div>
      </div>
    );
  }
}
