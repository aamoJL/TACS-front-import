import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Draggable from "react-draggable";

/*
Component for join game form
*/

export default class JoinGameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameJSON: undefined,
      selectedFactionId: "",
      factionPasswordInput: "", //>= 3 chars
      errorMessage: ""
    };
  }

  // Gets game info when the component loads
  componentDidMount() {
    if (this.props.gameId === undefined) {
      alert("game not selected");
    } else {
      fetch(`${process.env.REACT_APP_API_URL}/game/${this.props.gameId}`)
        .then(result => result.json())
        .then(json => {
          this.setState({
            gameJSON: json,
            selectedFactionId:
              json.factions.length > 0 ? json.factions[0].factionId : ""
          });
        })
        .catch(error => console.log(error));
    }
  }

  // Sends callback for form closing.
  handleView = e => {
    this.props.toggleView(this.props.view);
  };

  // Sends request to server to join the selected faction
  handleGameJoin = e => {
    e.preventDefault();

    let token = sessionStorage.getItem("token");
    let error = false;

    fetch(
      `${process.env.REACT_APP_API_URL}/faction/join-faction/${
        this.state.gameJSON.id
      }`,
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          factionPassword: this.state.factionPasswordInput,
          factionId: this.state.selectedFactionId,
          game: this.state.gameJSON.id
        })
      }
    )
      .then(res => {
        if (!res.ok) {
          error = true;
        }
        return res.json();
      })
      .then(result => {
        if (!error) {
          alert("Joined faction " + result.faction.factionName);
          this.props.onJoin();
          this.handleView();
        } else {
          alert(result.message);
        }
      })
      .catch(error => console.log(error));
  };

  render() {
    if (this.state.gameJSON === undefined) {
      return false;
    }

    let factionItems = this.state.gameJSON.factions.map(faction => (
      <option key={faction.factionId} value={faction.factionId}>
        {faction.factionName}
      </option>
    ));

    return ReactDOM.createPortal(
      <Draggable
        bounds="body"
        className="draggableContainer"
        enableUserSelectHack={false}
        cancel=".input-cancel-drag"
      >
        <div className="tasklist">
          <button
            id="closeNewGameFormX"
            className="close"
            onClick={this.handleView}
          >
            ×
          </button>

          <form className="task-form" onSubmit={this.handleGameJoin}>
            <h1>Join game: {this.state.gameJSON.name}</h1>
            <p>Description: {this.state.gameJSON.desc}</p>
            <select
              id="selectFactionList"
              onChange={e =>
                this.setState({ selectedFactionId: e.target.value })
              }
            >
              {factionItems}
            </select>
            <input
              id="factionPasswordInput"
              value={this.state.factionPasswordInput}
              onChange={e =>
                this.setState({ factionPasswordInput: e.target.value })
              }
              type="password"
              placeholder="Password"
              minLength="3"
              required
            />
            <button id="joinGameSubmitButton" type="submit">
              Submit
            </button>
            <h2>{this.state.errorMsg}</h2>
          </form>
        </div>
      </Draggable>,
      document.getElementById("form")
    );
  }
}

JoinGameForm.propTypes = {
  gameId: PropTypes.string,
  toggleView: PropTypes.func,
  onJoin: PropTypes.func
};
