import React from "react";
import { Link } from "react-router-dom";

export default class GameCard extends React.Component {
  state = {
    editForm: false,
    gameInfo: {}
  };

  // Get game info
  componentDidMount() {
    this.getGameInfo();
  }

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
            enddate: res.enddate
          }
        });
      })
      .catch(error => console.log(error));
  }

  render() {
    if (this.state.gameInfo.id === undefined) {
      return false;
    }

    return (
      <div className="gamecard">
        <label>Name: {this.state.gameInfo.name}</label>
        <br />
        <label>Description: {this.state.gameInfo.desc}</label>
        <br />
        <label>
          Date: {this.state.gameInfo.startdate} - {this.state.gameInfo.enddate}
        </label>
        <br />
        <label>State: {this.state.gameInfo.state}</label>
        <br />
        <Link
          to={{ pathname: "/game", search: "?id=" + this.state.gameInfo.id }}
        >
          <button id={`select${this.state.gameInfo.name}`} type="button">
            Select
          </button>
        </Link>
      </div>
    );
  }
}
