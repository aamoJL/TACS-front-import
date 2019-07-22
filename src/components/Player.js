// https://github.com/YUzhva/react-leaflet-markercluster
// https://github.com/Leaflet/Leaflet.markercluster#all-options

import React, { Component } from "react";
import { Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";

import { playerIcon, clusterIcon } from "./DrawToolsPanel";

class Player extends Component {
  state = {
    factions: []
  };

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
            factions: data
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
      <React.Fragment>
        {this.state.factions &&
          this.state.factions.map(faction => {
            return (
              <MarkerClusterGroup iconCreateFunction={clusterIcon}>
                {faction.map(player => {
                  return (
                    <Marker
                      key={Math.random()}
                      position={[
                        player.coordinates.lat,
                        player.coordinates.lng
                      ]}
                      icon={playerIcon(player.icon, player.factionColour)}
                      factionId={player.factionId}
                      gamepersonId={player.gamepersonId}
                      gamepersonRole={player.gamepersonRole}
                      colour={player.factionColour}
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
              </MarkerClusterGroup>
            );
          })}
      </React.Fragment>
    );
  }
}

export default Player;
