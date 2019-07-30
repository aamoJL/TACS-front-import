import React from "react";
import ReactDOM from "react-dom";
import { Map, TileLayer } from "react-leaflet";
import ImageUpload from "./ImageUpload";

/*
Component for form to create new games
*/

export class NewGameForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gamename: "",
      description: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      filepath: "images/default.jpeg",
      zoom: 13,
      mapCenter: {
        lat: 62.2416479,
        lng: 25.7597186
      }
    };

    this.handleMapDrag = this.handleMapDrag.bind(this);
  }

  // Change state value
  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

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

  // Changes map position state when the map has been dragged
  handleMapDrag = e => {
    this.setState({
      mapCenter: e.target.getCenter()
    });
  };

  // Changes map zoom state when the map has been zoomed
  handleMapScroll = e => {
    this.setState({
      zoom: e.target.getZoom()
    });
  };

  // Changes image path state when the path has been changed
  handleImagePath = path => {
    this.setState({
      filepath: path
    });
  };

  // Sends new game's information to server
  handleGameCreation = e => {
    let startDate =
      this.state.startDate + "T" + this.state.startTime + ":00.000Z";
    let endDate = this.state.endDate + "T" + this.state.endTime + ":00.000Z";

    const gameObject = {
      name: this.state.gamename,
      desc: this.state.description,
      map: "",
      startdate: startDate,
      enddate: endDate,
      image: this.state.filepath,
      center: this.state.mapCenter
    };

    e.preventDefault();

    let token = sessionStorage.getItem("token");

    // Send Game info to the server
    fetch(`${process.env.REACT_APP_API_URL}/game/new`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(gameObject)
    })
      .then(res => res.json())
      .then(result => {
        if (result.code) {
          alert(result.message);
        } else {
          alert(`Game ${this.state.gamename} added`);
          this.handleView();
        }
      })
      .catch(error => console.log("Error: ", error));
  };

  // Sets keyup event for the component when the component has been loaded
  componentDidMount() {
    document.addEventListener("keyup", this.handleEsc);
  }

  // Removes the keyup event from the component when the component has been removed
  componentWillUnmount() {
    document.removeEventListener("keyup", this.handleEsc);
  }

  // Renders a React portal in popup element
  render() {
    return ReactDOM.createPortal(
      <div className="new-game-popup">
        <h1 className="edit-game-title">Game Creation</h1>
        <div className="new-game-outer-container">
          <div className="new-game-inner-container">
            <form id="gameCreationForm" onSubmit={this.handleGameCreation} />
            <label className="">Name: &nbsp;</label>
            <input
              className="new-game-input"
              placeholder="Game name"
              name="gamename"
              value={this.state.gamename}
              onChange={this.handleChange}
              id="newGameNameInput"
              form="gameCreationForm"
              minLength="3"
              maxLength="30"
              required
            />
            <label className="">Description: &nbsp;</label>
            <textarea
              className="new-game-input"
              placeholder="Description"
              name="description"
              value={this.state.description}
              onChange={this.handleChange}
              id="newGameDescriptionInput"
              form="gameCreationForm"
              minLength="1"
              maxLength="255"
              required
            />
            <label className="">Start: &nbsp;</label>
            <input
              className="new-game-input"
              type="date"
              name="startDate"
              value={this.state.startDate}
              onChange={this.handleChange}
              id="newGameDateStartInput"
              form="gameCreationForm"
              required
            />
            <input
              className="new-game-input"
              type="time"
              name="startTime"
              onChange={this.handleChange}
              id="newGameTimeStartInput"
              form="gameCreationForm"
              required
            />
            <label className="">End: &nbsp; </label>
            <input
              className="new-game-input"
              type="date"
              name="endDate"
              value={this.state.endDate}
              onChange={this.handleChange}
              min={this.state.startDate}
              id="newGameDateEndInput"
              form="gameCreationForm"
              required
            />
            <input
              className="new-game-input"
              type="time"
              name="endTime"
              onChange={this.handleChange}
              id="newGameTimeEndInput"
              form="gameCreationForm"
              required
            />
            <label>Game Image:</label>
            <ImageUpload handleImagePath={this.handleImagePath} />
          </div>
          <div className="new-game-inner-container">
            <label>Map</label>
            <div className="new-game-map-container">
              <Map
                id="newGameCenterMap"
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
            </div>
          </div>
        </div>
        <div className="new-game-button-container">
          <button
            className="new-game-button"
            id="closeNewGameFormX"
            onClick={this.handleView}
          >
            Close
          </button>
          <button
            className="new-game-button"
            id="newGameSubmitButton"
            type="submit"
            form="gameCreationForm"
          >
            Submit
          </button>
        </div>
      </div>,
      document.getElementById("popup")
    );
  }
}

export default NewGameForm;
