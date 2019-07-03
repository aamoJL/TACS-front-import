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
      map: "",
      mapCenter: {
        lat: 62.2416479,
        lng: 25.7597186
      },
      factionNameInput: "",
      factionPasswordInput: "",
      factions: [],
      objectivePointDescriptionInput: "",
      objectivePointMultiplierInput: "",
      objectivePoints: [],
      capture_time: 300,
      confirmation_time: 60,
      owner: 1,
      capture: 0,
      buttons_available: 16,
      heartbeat_interval: 60,
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

    if(this.state.factions.findIndex(faction => faction.factionName === this.state.factionNameInput) !== -1){
      return alert("Faction " + this.state.factionNameInput + " already exists");
    }

    this.setState(state => {
      let factions = state.factions;
      factions.push({
        factionName: this.state.factionNameInput,
        factionPassword: this.state.factionPasswordInput,
        multiplier: 1
      });
      return {
        factions: factions,
        factionNameInput: "",
        factionPasswordInput: ""
      }
    });
  }

  removeFaction(factionName){
    this.setState(state => {
      let factions = state.factions;
      const index = factions.findIndex(faction => faction.factionName === factionName);

      if(index !== -1){
        factions.splice(index,1);
      }
      else{
        console.log("Faction is not in the faction list");
      }

      return factions;
    });
  }

  handleObjectivePointAdd = e => {
    e.preventDefault();

    if(this.state.objectivePointDescriptionInput === "" || this.state.objectivePointMultiplierInput === ""){
      return alert("Capture point needs an ID and multiplier");
    }

    if(this.state.objectivePoints.findIndex(point => point.objectivePointDescription === this.state.objectivePointDescriptionInput) !== -1){
      return alert("Capture point " + this.state.objectivePointDescriptionInput + " already exists");
    }

    this.setState(state => {
      let objectivePoints = state.objectivePoints;
      objectivePoints.push({
        objectivePointDescription: this.state.objectivePointDescriptionInput,
        objectivePointMultiplier: this.state.objectivePointMultiplierInput
      });

      return{
        objectivePoints: objectivePoints,
        objectivePointDescriptionInput: "",
        objectivePointMultiplierInput: ""
      }
    });
  }

  removeObjectivePoint(objectivePointId){
    this.setState(state => {
      let objectivePoints = state.objectivePoints;
      const index = objectivePoints.findIndex(point => point.objectivePointDescription === objectivePointId);

      if(index !== -1){
        objectivePoints.splice(index, 1);
      }
      else{
        console.log("Objective point is not in the point list");
      }

      return objectivePoints;
    })
  }

  handleGameDeletion = e =>{
    e.preventDefault();

    let token = sessionStorage.getItem("token");

    if(window.confirm("Are you sure you want to delete this game")){
      alert("Game deleted");

      fetch(`${process.env.REACT_APP_URL}/game/${this.props.gameId}`,{
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json",
          "Content-Type": "application/json"
        },
      })
      .then(result => result.json())
      .then(result =>  {
        console.log(result);
        this.handleView();
      })
      .catch(error => console.log(error));
    }
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
    let startDate = this.state.startDate + "T" + this.state.startTime + ":00.000Z";
    let endDate = this.state.endDate + "T" + this.state.endTime + ":00.000Z";

    const gameObject = {
      name: this.state.gamename,
      desc: this.state.description,
      map: "",
      startdate: startDate,
      enddate: endDate,
      center: this.state.mapCenter,
      factions: this.state.factions,
      objective_points: this.state.objectivePoints
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
    fetch(`${process.env.REACT_APP_URL}/game/` + gameId)
      .then(response => response.json())
      .then(json => this.handleGameInfo(json))
      .catch(error => console.log(error));
  }

  // Add selected game's data to state
  handleGameInfo(json) {
    let token = sessionStorage.getItem("token");
    
    // Get factions
    fetch(`${process.env.REACT_APP_URL}/game/get-factions/${this.props.gameId}`,{
      method: "GET",
      headers: {
        Authorization: "Bearer " + token
      }
    })
    .then(result => result.json())
    .then(result => {

      let factions = result.map(faction => {
        return {
          factionName: faction.factionName,
          factionPassword: faction.factionPassword,
          multiplier: 1
        }
      })

      this.setState({
        gamename: json.name,
        description: json.desc,
        startDate: json.startdate.substring(0, 10),
        startTime: json.startdate.substring(11, 16),
        endDate: json.enddate.substring(0, 10),
        endTime: json.enddate.substring(11, 16),
        mapCenter: {
          lat: json.center.lat,
          lng: json.center.lng
        },
        factions: factions,
        objectivePoints: json.objective_points
      });
    })
    .catch(error => console.log(error));
  }

  render() {

    let factions = [];
    for (let i = 0; i < this.state.factions.length; i++) {
      const faction = this.state.factions[i];
      factions.push(
        <li key={faction.factionName}>
          <div >{faction.factionName} : {faction.factionPassword}</div>
          <button type="button" onClick={() => this.removeFaction(faction.factionName)}>Remove</button>
        </li>
      );
    }

    let objectivePoints = [];
    for (let i = 0; i < this.state.objectivePoints.length; i++) {
      const point = this.state.objectivePoints[i];
      objectivePoints.push(
        <li key={point.objectivePointDescription}>
          <div>{point.objectivePointDescription} : {point.objectivePointMultiplier}</div>
          <button type="button" onClick={() => this.removeObjectivePoint(point.objectivePointDescription)}>Remove</button>
        </li>
      )
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
          
          <form id="gameEditForm" onSubmit={this.handleGameSave}></form>
          <form id="factionAddFrom" onSubmit={this.handleFactionAdd}></form>
          <form id="gameDeletionForm" onSubmit={this.handleGameDeletion}></form>
          <form id="objectivePointAddFrom" onSubmit={this.handleObjectivePointAdd}></form>

          <h1>Demo Game Editor</h1>
          <br />
          <input
            placeholder="Game name"
            name="gamename"
            value={this.state.gamename}
            onChange={this.handleChange}
            id="editGameNameInput"
            form="gameEditForm"
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
            form="gameEditForm"
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
            form="gameEditForm"
            required
          />
          <input
            className="formTime"
            type="time"
            name="startTime"
            value={this.state.startTime}
            onChange={this.handleChange}
            sid="editGameTimeStartInput"
            form="gameEditForm"
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
            form="gameEditForm"
            required
          />
          <input
            className="formTime"
            type="time"
            name="endTime"
            value={this.state.endTime}
            onChange={this.handleChange}
            id="editGameTimeEndInput"
            form="gameEditForm"
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
          <br />
          <br />
          <label>Objective points</label>
          <br />
          <input name="objectivePointDescriptionInput" type="number" value={this.state.objectivePointDescriptionInput} onChange={this.handleChange} placeholder="Objective point id" form="objectivePointAddFrom"></input>
          <input name="objectivePointMultiplierInput" type="number" value={this.state.objectivePointMultiplierInput} onChange={this.handleChange} placeholder="Objective point multiplier" form="objectivePointAddFrom"></input>
          <button type="submit" form="objectivePointAddFrom">Add</button>
          <ul>
            {objectivePoints}
          </ul>
          <br />
          <br />
          <label>Node things</label>
          <br />
          <br />
          <label className="" form="gameEditForm">Capture time:</label>
          <input name="capture_time" type="number" value={this.state.capture_time} form="gameEditForm" onChange={this.handleChange}></input>
          <label className="">Confimation time:</label>
          <input name="confirmation_time" type="number" value={this.state.confirmation_time} form="gameEditForm" onChange={this.handleChange}></input>
          <label className="">Owner:</label>
          <input name="owner" type="number" value={this.state.owner} form="gameEditForm" onChange={this.handleChange}></input>
          <label className="">Buttons available:</label>
          <input name="buttons_available" type="number" value={this.state.buttons_available} form="gameEditForm" onChange={this.handleChange}></input>
          <label className="">Heartbeat interval:</label>
          <input name="heartbeat_interval" type="number" value={this.state.heartbeat_interval} form="gameEditForm" onChange={this.handleChange}></input>
          <br />
          <br />
          <label>Map things</label>
          <br />
          <Map
            id="editGameCenterMap"
            className=""
            center={[this.state.mapCenter.lat, this.state.mapCenter.lng]}
            zoom="13"
            style={{ height: "400px", width: "400px" }}
            onmoveend={this.handleMapDrag}
            // onzoomend={this.handleMapScroll}
          >
          <TileLayer
            attribution="Maanmittauslaitoksen kartta"
            url=" https://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.jpg"
          />
          </Map>
          <br />
          <button style={{backgroundColor: "red"}} type="submit" form="gameDeletionForm">
            Delete
          </button>
          <button id="editGameSubmitButton" type="submit" form="gameEditForm">
            Save changes
          </button>
          <h2>{this.state.errorMsg}</h2>
        </div>
      </div>,
      document.getElementById("form")
    );
  }
}

export default EditGameForm;
