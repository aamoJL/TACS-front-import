import React, { Component } from "react";
import { Marker, Popup } from "react-leaflet";

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: null,
      time: Date.now()
    };
  }

  getPlayers() {
    fetch(
      "http://172.20.2.143:5000/tracking/players/" + this.props.currentGameId,
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
  }

  componentDidMount() {
    // update components every 10 seconds
    this.interval = setInterval(
      () => this.setState({ time: Date.now() }),
      10000
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    // do not update component until players have been fetched and game ID is available
    if (this.state.players === null) {
      this.getPlayers();
      return false;
    } else if (this.props.currentGameId === null) {
      return false;
    } else {
      return true;
    }
  }

  componentDidUpdate() {
    // check if game ID has changed
    if (this.state.currentGameId !== this.props.currentGameId) {
      this.setState({
        currentGameId: this.props.currentGameId
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        {this.state.players !== null &&
          this.state.players.map(player => {
            return (
              <Marker
                key={Math.random()}
                position={player.coordinates}
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
