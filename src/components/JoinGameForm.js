import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

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

  // Get game info
  //TODO: from props
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

  handleView = e => {
    this.props.toggleView(this.props.view);
  };

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
      <div className="fade-main">
        <div className="sticky">
          <span
            id="closeNewGameFormX"
            className="close"
            onClick={this.handleView}
          >
            ×
          </span>
        </div>
        <div className="">
          <form onSubmit={this.handleGameJoin}>
            <h1>Join game: {this.state.gameJSON.name}</h1>
            <h2>Description: {this.state.gameJSON.desc}</h2>
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
      </div>,
      document.getElementById("form")
    );
  }
}

JoinGameForm.propTypes = {
  gameId: PropTypes.string,
  toggleView: PropTypes.func,
  onJoin: PropTypes.func
};
