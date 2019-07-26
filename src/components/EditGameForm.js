import React from "react";
import { Map, TileLayer } from "react-leaflet";
import { SketchPicker } from "react-color";
import reactCSS from "reactcss";
import EditGameFormToolbar from "./EditGameFormToolbar";

/*
Component that is used to:
  - Edit game's information
  - Add factions to the game
  - Add objective points to the game
  - Change map position
*/

export default class EditGameForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gameId: null,
      role: null,
      zoom: 13,
      gamename: null,
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

  // Change inputs state value
  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value, saved: false });
  };

  // get flagbox data from EditGameFormToolbar and push it to state array
  // when saving changes, the whole array is sent to database
  pushFlagbox = box => {
    let newdata = [...this.state.objectivePoints];
    for (let i in newdata) {
      if (!newdata[i].data) {
        newdata[i].data = box.data;
        this.setState({ objectivePoints: newdata });
        break;
      }
    }
  };
  // get edited flagbox data from EditGameFormToolbar and update it in state array
  // changes are sent to db on save
  updateFlagbox = boxes => {
    let newData = [...this.state.objectivePoints];
    boxes.forEach(flagbox => {
      let i = newData.findIndex(
        x => x.objectivePointId === flagbox.objectivePointId
      );
      if (i !== -1) newData[i].data = flagbox.data;
    });
    this.setState({ objectivePoints: newData });
  };
  // get deleted flagbox data from EditGameFormToolbar and update it in state array
  // changes are sent to db on save
  deleteFlagbox = boxes => {
    let newData = [...this.state.objectivePoints];
    boxes.forEach(flagbox => {
      let i = newData.findIndex(
        x => x.objectivePointId === flagbox.objectivePointId
      );
      if (i !== -1) newData.splice(i, 1);
    });
    this.setState({ objectivePoints: newData });
  };

  // Adds faction to state array, but does not send it to the server
  handleFactionAdd = e => {
    e.preventDefault();

    if (
      this.state.factionNameInput === "" ||
      this.state.factionPasswordInput === ""
    ) {
      return alert("Faction needs a name and password");
    }

    // Faction existence check
    if (
      this.state.factions.findIndex(
        faction => faction.factionName === this.state.factionNameInput
      ) !== -1
    ) {
      return alert(
        "Faction " + this.state.factionNameInput + " already exists"
      );
    }

    // Push new faction to the state faction array
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

  // Removes faction from state array, but does not remove it from the server
  removeFaction(factionName) {
    this.setState(state => {
      // Faction existence check
      let factions = state.factions;
      const index = factions.findIndex(
        faction => faction.factionName === factionName
      );

      if (index !== -1) {
        // Remove the faction from the array if it exists
        factions.splice(index, 1);
      } else {
        console.log("Faction is not in the faction list");
      }

      return factions;
    });
  }

  // Adds objective point to state array, but does not send it to the server
  handleObjectivePointAdd = e => {
    e.preventDefault();

    if (
      this.state.objectivePointDescriptionInput === "" ||
      this.state.objectivePointMultiplierInput === ""
    ) {
      return alert("Capture point needs an ID and multiplier");
    }

    // Campture point existence check
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

    // Add the point to the state array
    this.setState(state => {
      let objectivePoints = state.objectivePoints;
      objectivePoints.push({
        objectivePointDescription: this.state.objectivePointDescriptionInput,
        objectivePointMultiplier: parseFloat(
          this.state.objectivePointMultiplierInput
        ),
        data: {
          type: "flagbox",
          coordinates: [this.state.mapCenter.lat, this.state.mapCenter.lng]
        }
      });

      return {
        objectivePoints: objectivePoints,
        objectivePointDescriptionInput: "",
        objectivePointMultiplierInput: ""
      };
    });
  };

  // Removes objective point from the state array, but does not remove it from the server
  removeObjectivePoint(objectivePointId) {
    this.setState(state => {
      // Objective point existence check
      let objectivePoints = state.objectivePoints;
      const index = objectivePoints.findIndex(
        point => point.objectivePointDescription === objectivePointId
      );

      if (index !== -1) {
        // Remove point from the array if the point exists
        objectivePoints.splice(index, 1);
      } else {
        console.log("Objective point is not in the point list");
      }

      return objectivePoints;
    });
  }

  // Deletes the game from the server database
  handleGameDeletion = e => {
    e.preventDefault();

    let token = sessionStorage.getItem("token");

    // Ask user confirmation
    if (window.confirm("Are you sure you want to delete this game")) {
      fetch(
        `${process.env.REACT_APP_API_URL}/game/delete/${this.state.gameId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token
          }
        }
      )
        .then(result => result.json())
        .then(result => {
          this.setState({ saved: true }, () => {
            alert("Game deleted");
            // Redirect user to root when the game has been deleted
            window.document.location.href = "/";
          });
        })
        .catch(error => console.log(error));
    }
  };

  // Redirects user to root
  handleGameSelectionClick = e => {
    // Ask user confirmation
    if (
      this.state.saved ||
      window.confirm("Are you sure you want to leave without saving?")
    ) {
      // Redirect user to root
      window.document.location.href = "/";
    }
  };

  // Redirects user to game view
  handleBackToGameClick = e => {
    // Ask user confirmation
    if (
      this.state.saved ||
      window.confirm("Are you sure you want to leave without saving?")
    ) {
      // Redirect user to game view
      window.document.location.href = "/game?id=" + this.state.gameId;
    }
  };

  // Sends the form's information to the server.
  handleGameSave = e => {
    e.preventDefault();

    // Format dates to ISO format
    let startDate =
      this.state.startDate + "T" + this.state.startTime + ":00.000Z";
    let endDate = this.state.endDate + "T" + this.state.endTime + ":00.000Z";

    let objectivePoints = this.state.objectivePoints;

    // objective points are not allowed if the game has no factions
    if (this.state.factions.length === 0) {
      objectivePoints = [];
    }
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
    fetch(`${process.env.REACT_APP_API_URL}/game/edit/${this.state.gameId}`, {
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
              // Redirect to the game view
              this.handleBackToGameClick();
            }
          );
        }
      })
      .catch(error => console.log("Error: ", error));
  };

  // Gets the game id from the URL when the page loads
  componentDidMount() {
    let gameId = new URL(window.location.href).searchParams.get("id");
    this.setState(
      {
        gameId: gameId
      },
      () => {
        this.getGameInfo(gameId);
      }
    );
  }

  // Gets the game's information from server
  // Redirects the user to root if the game's information was not found
  getGameInfo(gameId) {
    let token = sessionStorage.getItem("token");
    // Get player's role
    fetch(`${process.env.REACT_APP_API_URL}/faction/check-faction/${gameId}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.role === "admin") {
          // Get game info
          fetch(`${process.env.REACT_APP_API_URL}/game/${gameId}`)
            .then(response => response.json())
            .then(json => this.setGameInfoToState(json))
            .catch(error => {
              console.log(error);
              window.document.location.href = "/";
            });
        } else {
          alert(
            "The game was not found or you don't have permission to edit it"
          );
          // Redirect user to root
          window.document.location.href = "/";
        }
      })
      .catch(error => console.log(error));
  }

  // Sets game's information to state
  setGameInfoToState(json) {
    let token = sessionStorage.getItem("token");

    // Get factions and passwords
    fetch(
      `${process.env.REACT_APP_API_URL}/game/get-factions/${this.state.gameId}`,
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

        let objectivePoints = json.objective_points.map(point => {
          return {
            objectivePointId: point.objectivePointId,
            objectivePointDescription: point.objectivePointDescription,
            objectivePointMultiplier: point.objectivePointMultiplier,
            data: point.data
          };
        });

        // get node settings if the settings exists in the game
        let nodesettings =
          json.nodesettings !== null &&
          json.nodesettings.node_settings !== undefined
            ? json.nodesettings.node_settings
            : undefined;

        // Set the information to state
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
          objectivePointLocation: json.objective_point_location,
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
    if (this.state.gamename === null) {
      return false;
    }

    // Faction list elements
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

    // Objective point list elements
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

    // Color picker style settings
    const styles = reactCSS({
      default: {
        color: {
          width: "36px",
          height: "14px",
          borderRadius: "2px",
          background: `${this.state.factionColorInput}`
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

    return (
      <div className="fade-main">
        {/* Separate froms for the game information and faction/objective point additions */}
        <form id="gameEditForm" onSubmit={this.handleGameSave} />
        <form id="factionAddFrom" onSubmit={this.handleFactionAdd} />
        <form id="gameDeletionForm" onSubmit={this.handleGameDeletion} />
        <form
          id="objectivePointAddFrom"
          onSubmit={this.handleObjectivePointAdd}
        />

        <h1 className="edit-game-title">Game Editor</h1>
        <div className="edit-game-container">
          <div className="edit-game-inner-container">
            <label>Name:</label>
            <input
              placeholder="Game name"
              name="gamename"
              value={this.state.gamename}
              onChange={this.handleChange}
              id="editGameNameInput"
              form="gameEditForm"
              required
            />
            <label>Description:</label>
            <textarea
              placeholder="Description"
              type="text"
              name="description"
              value={this.state.description}
              onChange={this.handleChange}
              id="editGameDescriptionInput"
              form="gameEditForm"
              required
            />
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
          </div>
          <div className="edit-game-inner-container">
            <label>Factions</label>
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
            <div className="edit-game-faction-color">
              <label>Faction color:</label>
              <div
                id="editGameColorPickerButton"
                className="edit-game-color-picker-button"
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
                  className="edit-game-color-picker"
                  style={styles.cover}
                  onClick={() => this.setState({ displayColorPicker: false })}
                >
                  <SketchPicker
                    className="edit-game-color-picker"
                    color={this.state.factionColorInput}
                    onChangeComplete={color =>
                      this.setState({ factionColorInput: color.hex })
                    }
                  />
                </div>
              )}
            </div>
            <button
              id="editGameFactionSubmitButton"
              type="submit"
              form="factionAddFrom"
            >
              Add
            </button>
            <ul>{factions}</ul>

            <label>Objective points</label>
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
            <label>Node things (set if objective points are in the game)</label>
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
          </div>

          <div className="edit-game-inner-container">
            <label>Map things</label>
            <Map
              id="editGameCenterMap"
              className=""
              center={[this.state.mapCenter.lat, this.state.mapCenter.lng]}
              zoom={this.state.zoom}
              maxZoom="13"
              style={{ height: "400px", width: "400px" }}
              onmoveend={e =>
                this.setState({ mapCenter: e.target.getCenter() })
              }
              onzoomend={e => this.setState({ zoom: e.target.getZoom() })}
            >
              <TileLayer
                attribution="Maanmittauslaitoksen kartta"
                url=" https://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.jpg"
              />
              <EditGameFormToolbar
                pushFlagbox={this.pushFlagbox}
                updateFlagbox={this.updateFlagbox}
                deleteFlagbox={this.deleteFlagbox}
                flagboxlocations={this.state.objectivePoints}
                gameId={this.state.gameId}
              />
            </Map>
          </div>
        </div>
        <div className="edit-game-form-buttons">
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
          <button
            id="editGameBackToGameButton"
            onClick={this.handleBackToGameClick}
          >
            Back to game
          </button>
          <button
            id="editGameGameSelectionButton"
            onClick={this.handleGameSelectionClick}
          >
            Game selection
          </button>
          <h2>{this.state.errorMsg}</h2>
        </div>
      </div>
    );
  }
}
