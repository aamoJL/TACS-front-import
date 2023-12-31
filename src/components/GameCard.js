import React from "react";
import { Link } from "react-router-dom";

/*
Component for showing game's information in game selection page
*/

export default class GameCard extends React.Component {
  state = {
    editForm: false,
    gameInfo: {}
  };

  // Get game info when the page loads
  componentDidMount() {
    this.getGameInfo();
  }

  // Gets the game's information from server and sets the information to state
  getGameInfo() {
    fetch(`${process.env.REACT_APP_API_URL}/game/${this.props.gameId}`)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
      })
      .then(res => {
        this.setState({
          gameInfo: {
            id: res.id,
            name: res.name,
            desc: res.desc,
            state: res.state,
            startdate: res.startdate,
            enddate: res.enddate,
            image: `${process.env.REACT_APP_API_URL}/game/${res.image}`
          }
        });
      })
      .catch(error => console.log(error));
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
    if (this.state.gameInfo.id === undefined) {
      return false;
    }

    return (
      <div className="gamecard ">
        <div
          className="gamecard-img-container"
          style={{
            backgroundImage: `url(${this.state.gameInfo.image})`,
            width: "300px",
            height: "300px",
            backgroundSize: "cover",
            backgroundPosition: "50% 50%"
          }}
        />
        <div className="card-body">
          <label>Name: {this.state.gameInfo.name}</label>
          <br />
          <label>Description: {this.state.gameInfo.desc}</label>
          <br />
          <label>
            Date: {this.getFormattedDate(this.state.gameInfo.startdate)}{" "}
            {this.getFormattedTime(this.state.gameInfo.startdate)} -{" "}
            {this.getFormattedDate(this.state.gameInfo.enddate)}{" "}
            {this.getFormattedTime(this.state.gameInfo.enddate)}
          </label>
          <br />
          <label>State: {this.state.gameInfo.state}</label>
          <br />
          <Link
            to={{
              pathname: "/game",
              search: "?id=" + this.state.gameInfo.id
            }}
          >
            <button
              type="button"
              id={`select${this.state.gameInfo.name}`}
              className="select-game-button"
            >
              Select
            </button>
          </Link>
          <Link
            to={{
              pathname: "/info/game",
              search: "?id=" + this.state.gameInfo.id
            }}
          >
            <button
              id={`info${this.state.gameInfo.name}`}
              type="button"
              className="select-game-button"
            >
              Info
            </button>
          </Link>
          {this.state.gameInfo.state === "ENDED" && (
            <Link
              to={{
                pathname: "/replay",
                search: "?id=" + this.state.gameInfo.id
              }}
            >
              <button
                id={`replay${this.state.gameInfo.name}`}
                type="button"
                className="select-game-button"
              >
                Replay
              </button>
            </Link>
          )}
        </div>
      </div>
    );
  }
}
