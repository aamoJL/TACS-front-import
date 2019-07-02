import React, {Fragment} from "react";
import ReactDOM from "react-dom";
import { Map, TileLayer } from "react-leaflet";

export class EditGameForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gamename: "",
      description: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      zoom: 13,
      mapCenter: {
        lat: 62.2416479,
        lng: 25.7597186
      },
      factionNameInput: "",
      factionPasswordInput: "",
      factions: [{
        name: "Overflow",
        password: "Wimma"
      }]
    };

    this.handleMapDrag = this.handleMapDrag.bind(this);
  }

  handleError = error => {
    this.setState({ errorMsg: error });
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleFactionAdd = e =>{
    e.preventDefault();
    
    if(this.state.factionNameInput === "" || this.state.factionPasswordInput === ""){
      return alert("Faction needs a name and password");
    }

    this.setState(state => {
      let factions = state.factions;
      factions.push({
        name: this.state.factionNameInput,
        password: this.state.factionPasswordInput
      });
      return {
        factions: factions,
        factionNameInput: "",
        factionPasswordInput: ""
      }
    })
  }

  // show/hide this form
  handleView = e => {
    this.props.toggleView(this.props.view);
  };

  // remove view with ESC
  handleEsc = e => {
    if (e.keyCode === 27) {
      this.handleView();
    }
  };

  handleMapDrag = e => {
    this.setState({
      mapCenter: e.target.getCenter()
    });
  };

  handleMapScroll = e => {
    this.setState({
      zoom: e.target.getZoom()
    });
  };

  handleGameSave = e => {
    let startDate =
      this.state.startDate + "T" + this.state.startTime + ":00.000Z";
    let endDate = this.state.endDate + "T" + this.state.endTime + ":00.000Z";

    const gameObject = {
      name: this.state.gamename,
      desc: this.state.description,
      map: "",
      startdate: startDate,
      enddate: endDate,
      center: this.state.mapCenter
    };

    e.preventDefault();

    let token = sessionStorage.getItem("token");

    // Send Game info to the server
    fetch("http://localhost:5000/game/edit/" + this.props.gameId, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(gameObject)
    })
      .then(res => res.json())
      .then(result => {
        alert(result.message);
        this.handleView();
      })
      .catch(error => console.log("Error: ", error));
  };

  componentDidMount() {
    document.addEventListener("keyup", this.handleEsc);
    this.getGameInfo(this.props.gameId);
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.handleEsc);
  }

  getGameInfo(gameId) {
    fetch("http://localhost:5000/game/" + gameId)
      .then(response => response.json())
      .then(json => this.handleGameInfo(json))
      .catch(error => console.log(error));
  }

  handleGameInfo(json) {
    this.setState({
      gamename: json.name,
      description: json.desc,
      startDate: json.startdate.substring(0, 10),
      startTime: json.startdate.substring(11, 16),
      endDate: json.enddate.substring(0, 10),
      endTime: json.enddate.substring(11, 16),
      zoom: 13,
      mapCenter: {
        lat: json.center.lat,
        lng: json.center.lng
      }
    });
  }

  removeFaction(index){
    this.setState(state => {
      let factions = state.factions;
      factions.splice(index,1);

      return factions;
    });
  }

  render() {

    let factions = [];
    for (let i = 0; i < this.state.factions.length; i++) {
      const faction = this.state.factions[i];
      factions.push(
        <Fragment>
          <li key={i}>{faction.name} : {faction.password}</li>
          <button onClick={() => this.removeFaction(i)}>Remove</button>
        </Fragment>
      );
    }

    return ReactDOM.createPortal(
      <div className="fade-main">
        <div className="sticky">
          <span
            id="closeEditGameFormX"
            className="close"
            onClick={this.handleView}
          >
            ×
          </span>
        </div>
        <div className="">
          
          <form id="gameCreationForm" onSubmit={this.handleGameCreation}></form>
          <form id="factionAddFrom" onSubmit={this.handleFactionAdd}></form>
          
          <form onSubmit={this.handleGameSave}>
            <h1>Demo Game Editor</h1>
            <br />
            <input
              placeholder="Game name"
              name="gamename"
              value={this.state.gamename}
              onChange={this.handleChange}
              id="editGameNameInput"
              form="gameCreationForm"
              required
            />
            <br />
            <input
              placeholder="Description"
              type="text"
              name="description"
              value={this.state.description}
              onChange={this.handleChange}
              id="editGameDescriptionInput"
              form="gameCreationForm"
              required
            />
            <br />
            <label className="">Start:</label>
            <input
              className="formDate"
              type="date"
              name="startDate"
              value={this.state.startDate}
              onChange={this.handleChange}
              id="editGameDateStartInput"
              form="gameCreationForm"
              required
            />
            <input
              className="formTime"
              type="time"
              name="startTime"
              value={this.state.startTime}
              onChange={this.handleChange}
              sid="editGameTimeStartInput"
              form="gameCreationForm"
              required
            />
            <br />
            <label className="">End:</label>
            <input
              className="formDate"
              type="date"
              name="endDate"
              value={this.state.endDate}
              onChange={this.handleChange}
              min={this.state.startDate}
              id="editGameDateEndInput"
              form="gameCreationForm"
              required
            />
            <input
              className="formTime"
              type="time"
              name="endTime"
              value={this.state.endTime}
              onChange={this.handleChange}
              id="editGameTimeEndInput"
              form="gameCreationForm"
              required
            />
            <br />
            <br />

            <label>Factions</label>
            <br />
            <input name="factionNameInput" value={this.state.factionNameInput} onChange={this.handleChange} placeholder="Add new faction" form="factionAddFrom"></input>
            <input name="factionPasswordInput" value={this.state.factionPasswordInput} onChange={this.handleChange} placeholder="Faction password" form="factionAddFrom"></input>
            <button type="submit" form="factionAddFrom">Add</button>
            <ul>
              {factions}
            </ul>

            <label>Map things</label>
            <br />
            <Map
              id="editGameCenterMap"
              className=""
              center={[this.state.mapCenter.lat, this.state.mapCenter.lng]}
              zoom={this.state.zoom}
              style={{ height: "400px", width: "400px" }}
              onmoveend={this.handleMapDrag}
              onzoomend={this.handleMapScroll}
            >
              <TileLayer
                attribution="Maanmittauslaitoksen kartta"
                url=" https://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.jpg"
              />
            </Map>
            <br />
            <button id="editGameSubmitButton" type="submit" form="gameCreationForm">
              Save changes
            </button>
            <h2>{this.state.errorMsg}</h2>
          </form>
        </div>
      </div>,
      document.getElementById("form")
    );
  }
}

export default EditGameForm;
