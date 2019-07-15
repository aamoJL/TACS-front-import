import React, { Component } from "react";
import { Marker, Popup } from "react-leaflet";

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: null,
      timer: null
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
            players: data,
            timer: null // state for updating player positions every minute
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  shouldComponentUpdate(nextProps, nextState) {
    // do not update component until players have been fetched and game ID is available
    if (this.props.currentGameId === null) {
      return false;
    }
    /*
    if (this.props.socketSignal !== "tracking-update") {
      return false;
    }
    */
    return true;
    /*
    if (nextProps.currentGameId === null) {
      return false;
    } else if (this.state.players === null) {
      this.getPlayers();
      return false;
    } else {
      return true;
    }
    */
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.socketSignal === "tracking-update") {
      // start updating interval
      if (prevState.timer === null) {
        this.getPlayers();
        this.setState({
          timer: setInterval(this.getPlayers, 60000)
        });
      }
    }
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
