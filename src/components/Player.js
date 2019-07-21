import React, { Component } from "react";
import { Marker, Popup } from "react-leaflet";
import { playerIcon } from "./DrawToolsPanel";

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: []
    };
  }

  getPlayers = () => {
    fetch(
      `${process.env.REACT_APP_API_URL}/tracking/players/${
        this.props.currentGameId
      }`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token")
        }
      }
    )
      .then(res => res.json()) // no brackets over res.json() or it breaks (what)
      .then(data => {
        // don't do anything if data is not an array, as it breaks the map function at render
        if (Array.isArray(data)) {
          this.setState({
            players: data
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  componentDidMount() {
    this.getPlayers();
    setInterval(this.getPlayers, 60000);
  }

  render() {
    return (
      <div>
        {this.state.players !== null &&
          this.state.players.map(player => {
            return (
              <Marker
                key={Math.random()}
                position={[player.coordinates.lat, player.coordinates.lng]}
                icon={playerIcon(player.icon, player.factionColour)}
                factionId={player.factionId}
                gamepersonId={player.gamepersonId}
                gamepersonRole={player.gamepersonRole}
              >
                <Popup>
                  <b>factionId:</b> {player.factionId}
                  <br />
                  <b>gamepersonId:</b> {player.gamepersonId}
                  <br />
                  <b>gamepersonRole:</b> {player.gamepersonRole}
                </Popup>
              </Marker>
            );
          })}
      </div>
    );
  }
}

export default Player;
