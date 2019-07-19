import React from "react";
import ReactDOM from "react-dom";
import { Map, TileLayer } from "react-leaflet";
import { SketchPicker } from "react-color";
import reactCSS from "reactcss";

export default class EditGameForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      zoom: 13,
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
      factionNameInput: "", // >= 2 chars
      factionPasswordInput: "", // >= 3 chars
      factionColorInput: "#852222",
      factions: [],
      objectivePointDescriptionInput: "", // >= 7
      objectivePointMultiplierInput: "", // number
      objectivePoints: [],
      capture_time: 300,
      confirmation_time: 60,
      displayColorPicker: false,
      saved: true
    };
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value, saved: false });
  };

  handleFactionAdd = e => {
    e.preventDefault();

    if (
      this.state.factionNameInput === "" ||
      this.state.factionPasswordInput === ""
    ) {
      return alert("Faction needs a name and password");
    }

    if (
      this.state.factions.findIndex(
        faction => faction.factionName === this.state.factionNameInput
      ) !== -1
    ) {
      return alert(
        "Faction " + this.state.factionNameInput + " already exists"
      );
    }

    this.setState(state => {
      let factions = state.factions;
      factions.push({
        factionName: this.state.factionNameInput,
        factionPassword: this.state.factionPasswordInput,
        colour: this.state.factionColorInput,
        multiplier: 1
      });
      return {
        factions: factions,
        factionNameInput: "",
        factionPasswordInput: ""
      };
    });
  };

  removeFaction(factionName) {
    this.setState(state => {
      let factions = state.factions;
      const index = factions.findIndex(
        faction => faction.factionName === factionName
      );

      if (index !== -1) {
        factions.splice(index, 1);
      } else {
        console.log("Faction is not in the faction list");
      }

      return factions;
    });
  }

  handleObjectivePointAdd = e => {
    e.preventDefault();

    if (
      this.state.objectivePointDescriptionInput === "" ||
      this.state.objectivePointMultiplierInput === ""
    ) {
      return alert("Capture point needs an ID and multiplier");
    }

    if (
      this.state.objectivePoints.findIndex(
        point =>
          point.objectivePointDescription ===
          this.state.objectivePointDescriptionInput
      ) !== -1
    ) {
      return alert(
        "Capture point " +
          this.state.objectivePointDescriptionInput +
          " already exists"
      );
    }

    this.setState(state => {
      let objectivePoints = state.objectivePoints;
      objectivePoints.push({
        objectivePointDescription: this.state.objectivePointDescriptionInput,
        objectivePointMultiplier: parseFloat(
          this.state.objectivePointMultiplierInput
        )
      });

      return {
        objectivePoints: objectivePoints,
        objectivePointDescriptionInput: "",
        objectivePointMultiplierInput: ""
      };
    });
  };

  removeObjectivePoint(objectivePointId) {
    this.setState(state => {
      let objectivePoints = state.objectivePoints;
      const index = objectivePoints.findIndex(
        point => point.objectivePointDescription === objectivePointId
      );

      if (index !== -1) {
        objectivePoints.splice(index, 1);
      } else {
        console.log("Objective point is not in the point list");
      }

      return objectivePoints;
    });
  }

  handleGameDeletion = e => {
    e.preventDefault();

    let token = sessionStorage.getItem("token");

    if (window.confirm("Are you sure you want to delete this game")) {
      alert("Game deleted");

      fetch(
        `${process.env.REACT_APP_API_URL}/game/delete/${this.props.gameId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token
          }
        }
      )
        .then(result => result.json())
        .then(result => {
          console.log(result);
          this.handleView();
          this.props.onEditSave();
        })
        .catch(error => console.log(error));
    }
  };

  // show/hide this form
  handleView = e => {
    if (
      this.state.saved ||
      window.confirm("Are you sure you want to leave without saving?")
    ) {
      this.props.toggleView(this.props.view);
    }
  };

  // remove view with ESC
  handleEsc = e => {
    if (e.keyCode === 27) {
      this.handleView();
    }
  };

  handleMapScroll = e => {};

  handleGameSave = e => {
    e.preventDefault();

    let startDate =
      this.state.startDate + "T" + this.state.startTime + ":00.000Z";
    let endDate = this.state.endDate + "T" + this.state.endTime + ":00.000Z";

    let objectivePoints = this.state.objectivePoints;

    // objective points are not allowed if the game has no factions
    if (this.state.factions.length === 0) {
      objectivePoints = [];
    }

    console.log(objectivePoints);

    // Object the form sends to server
    let gameObject = {
      name: this.state.gamename,
      desc: this.state.description,
      map: "",
      startdate: startDate,
      enddate: endDate,
      center: this.state.mapCenter,
      factions: this.state.factions,
      objective_points: objectivePoints,
      nodesettings: {
        node_settings: {
          capture_time: parseInt(this.state.capture_time),
          confirmation_time: parseInt(this.state.confirmation_time),
          owner: 0,
          capture: 0,
          buttons_available: 16,
          heartbeat_interval: 60
        }
      }
    };

    let token = sessionStorage.getItem("token");
    let error = false;

    // Send Game info to the server
    fetch(`${process.env.REACT_APP_API_URL}/game/edit/${this.props.gameId}`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(gameObject)
    })
      .then(res => {
        if (!res.ok) {
          error = true;
        }
        return res.json();
      })
      .then(result => {
        alert(result.message);
        if (!error) {
          this.setState(
            {
              saved: true
            },
            () => {
              this.handleView();
              this.props.onEditSave();
            }
          );
        }
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
    fetch(`${process.env.REACT_APP_API_URL}/game/${gameId}`)
      .then(response => response.json())
      .then(json => this.setGameInfoToState(json))
      .catch(error => console.log(error));
  }

  setGameInfoToState(json) {
    let token = sessionStorage.getItem("token");

    // Get factions and passwordds
    fetch(
      `${process.env.REACT_APP_API_URL}/game/get-factions/${this.props.gameId}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token
        }
      }
    )
      .then(result => result.json())
      .then(result => {
        let factions = result.map(faction => {
          return {
            factionId: faction.factionId,
            factionName: faction.factionName,
            factionPassword: faction.factionPassword,
            multiplier: 1,
            colour: faction.colour
          };
        });

        // Remove objective point's id from the object
        let objectivePoints = json.objective_points.map(point => {
          return {
            objectivePointId: point.objectivePointId,
            objectivePointDescription: point.objectivePointDescription,
            objectivePointMultiplier: point.objectivePointMultiplier
          };
        });

        // get node settings if the settings exists in the game
        let nodesettings =
          json.nodesettings !== null &&
          json.nodesettings.node_settings !== undefined
            ? json.nodesettings.node_settings
            : undefined;

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
          objectivePoints: objectivePoints,
          capture_time:
            nodesettings !== undefined
              ? json.nodesettings.node_settings.capture_time
              : this.state.capture_time,
          confirmation_time:
            nodesettings !== undefined
              ? json.nodesettings.node_settings.confirmation_time
              : this.state.confirmation_time
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
          <div style={{ color: faction.colour }}>
            {faction.factionName} : {faction.factionPassword}
          </div>
          <button
            type="button"
            onClick={() => this.removeFaction(faction.factionName)}
          >
            Remove
          </button>
        </li>
      );
    }

    let objectivePoints = [];
    for (let i = 0; i < this.state.objectivePoints.length; i++) {
      const point = this.state.objectivePoints[i];
      objectivePoints.push(
        <li key={point.objectivePointDescription}>
          <div>
            {point.objectivePointDescription} : {point.objectivePointMultiplier}
          </div>
          <button
            type="button"
            onClick={() =>
              this.removeObjectivePoint(point.objectivePointDescription)
            }
          >
            Remove
          </button>
        </li>
      );
    }

    const styles = reactCSS({
      default: {
        color: {
          width: "36px",
          height: "14px",
          borderRadius: "2px",
          background: `${this.state.factionColorInput}`
        },
        swatch: {
          padding: "5px",
          background: "#fff",
          borderRadius: "1px",
          boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
          display: "inline-block",
          cursor: "pointer"
        },
        popover: {
          position: "absolute",
          zIndex: "2"
        },
        cover: {
          position: "fixed",
          top: "0px",
          right: "0px",
          bottom: "0px",
          left: "0px"
        }
      }
    });

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
          <form id="gameEditForm" onSubmit={this.handleGameSave} />
          <form id="factionAddFrom" onSubmit={this.handleFactionAdd} />
          <form id="gameDeletionForm" onSubmit={this.handleGameDeletion} />
          <form
            id="objectivePointAddFrom"
            onSubmit={this.handleObjectivePointAdd}
          />

          <h1>Game Editor</h1>
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
          <input
            id="editGameFactionNameInput"
            name="factionNameInput"
            value={this.state.factionNameInput}
            minLength="2"
            onChange={this.handleChange}
            placeholder="Add new faction"
            form="factionAddFrom"
          />
          <input
            id="editGameFactionPasswordInput"
            name="factionPasswordInput"
            value={this.state.factionPasswordInput}
            minLength="3"
            onChange={this.handleChange}
            placeholder="Faction password"
            type="password"
            form="factionAddFrom"
          />
          <div
            id="editGameColorPickerButton"
            style={styles.swatch}
            onClick={() =>
              this.setState({
                displayColorPicker: !this.state.displayColorPicker
              })
            }
          >
            <div style={styles.color} />
          </div>
          {this.state.displayColorPicker && (
            <div
              id="editGameColorPicker"
              style={styles.cover}
              onClick={() => this.setState({ displayColorPicker: false })}
            >
              <SketchPicker
                color={this.state.factionColorInput}
                onChangeComplete={color =>
                  this.setState({ factionColorInput: color.hex })
                }
              />
            </div>
          )}
          <button
            id="editGameFactionSubmitButton"
            type="submit"
            form="factionAddFrom"
          >
            Add
          </button>
          <ul>{factions}</ul>
          <br />
          <br />
          <label>Objective points</label>
          <br />
          <input
            id="editGameObjectivePointDescriptionInput"
            name="objectivePointDescriptionInput"
            type="number"
            value={this.state.objectivePointDescriptionInput}
            onChange={this.handleChange}
            placeholder="Objective point id"
            min="1000000"
            form="objectivePointAddFrom"
          />
          <input
            id="editGameObjectivePointMultiplierInput"
            name="objectivePointMultiplierInput"
            type="number"
            value={this.state.objectivePointMultiplierInput}
            onChange={this.handleChange}
            placeholder="Objective point multiplier"
            form="objectivePointAddFrom"
          />
          <button
            id="editGameObjectivePointSubmitButton"
            type="submit"
            form="objectivePointAddFrom"
          >
            Add
          </button>
          <ul>{objectivePoints}</ul>
          <br />
          <br />
          <label>Node things (set if objective points are in the game)</label>
          <br />
          <br />
          <label className="" form="gameEditForm">
            Capture time:
          </label>
          <input
            id="editGameCaptureTimeInput"
            name="capture_time"
            type="number"
            value={this.state.capture_time}
            form="gameEditForm"
            onChange={this.handleChange}
          />
          <label className="">Confimation time:</label>
          <input
            id="editGameConfirmationTimeInput"
            name="confirmation_time"
            type="number"
            value={this.state.confirmation_time}
            form="gameEditForm"
            onChange={this.handleChange}
          />
          <br />
          <br />
          <label>Map things</label>
          <br />
          <Map
            id="editGameCenterMap"
            className=""
            center={[this.state.mapCenter.lat, this.state.mapCenter.lng]}
            zoom={this.state.zoom}
            maxZoom="13"
            style={{ height: "400px", width: "400px" }}
            onmoveend={e => this.setState({ mapCenter: e.target.getCenter() })}
            onzoomend={e => this.setState({ zoom: e.target.getZoom() })}
          >
            <TileLayer
              attribution="Maanmittauslaitoksen kartta"
              url=" https://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.jpg"
            />
          </Map>
          <br />
          <button
            id="editGameDeleteGameButton"
            style={{ backgroundColor: "red" }}
            type="submit"
            form="gameDeletionForm"
          >
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
