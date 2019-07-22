import React from "react";
import { Link } from "react-router-dom";
import img from "../icons/ehasa-monitor.jpeg";
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
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="gamecard card mb-4 shadow-sm">
              <img className="card-img-top" src={img} alt="Game Logo" />
              <div className="card-body">
                <label>Name: {this.state.gameInfo.name}</label>
                <br />
                <label>Description: {this.state.gameInfo.desc}</label>
                <br />
                <label>
                  Date: {this.state.gameInfo.startdate} -{" "}
                  {this.state.gameInfo.enddate}
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
                  <button type="button" className="select-game-button">
                    Select
                  </button>
                </Link>
                <Link
                  to={{
                    pathname: "/replay",
                    search: "?id=" + this.state.gameInfo.id
                  }}
                >
                  <button
                    id={`replay${this.state.gameInfo.name}`}
                    type="button"
                  >
                    Replay
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
