import React from "react";
import { Map, TileLayer } from "react-leaflet";
import { Link } from "react-router-dom";

export default class GameInfoView extends React.Component {
  state = {
    gameInfo: null,
    center: []
  };

  componentDidMount() {
    let gameId = new URL(window.location.href).searchParams.get("id");
    this.getGameInfo(gameId);
  }

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

  getFormattedDate(date) {
    let day = date.substring(8, 10);
    let month = date.substring(5, 7);
    let year = date.substring(0, 4);
    return day + "." + month + "." + year;
  }

  getFormattedTime(date) {
    let time = date.substring(11, 16);
    return time;
  }

  render() {
    if (this.state.gameInfo === null) {
      return false;
    }
    return (
      <div className="fade-main">
        <div className="">
          <h1>Game Info</h1>
          <p>Game name: {this.state.gameInfo.name}</p>
          <p>Description: {this.state.gameInfo.desc}</p>
          <p>
            Date: {this.getFormattedDate(this.state.gameInfo.startdate)}{" "}
            {this.getFormattedTime(this.state.gameInfo.startdate)} -{" "}
            {this.getFormattedDate(this.state.gameInfo.enddate)}{" "}
            {this.getFormattedTime(this.state.gameInfo.enddate)}
          </p>
          <h2>Factions</h2>
          <div>
            {this.state.gameInfo.factions.map(faction => (
              <p key={faction.factionId} style={{ color: faction.colour }}>
                {faction.factionName}
              </p>
            ))}
          </div>
          <div>
            <Map
              id="gameInfoCenterMap"
              className=""
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
          <div>
            <Link
              to={{
                pathname: "/game",
                search: "?id=" + this.state.gameInfo.id
              }}
            >
              <button id="infoToGameButton">Go to the game</button>
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
      </div>
    );
  }
}
