import React from "react";
import ReactDOM from "react-dom";
import { Map, TileLayer } from "react-leaflet";

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
      zoom: 13,
      mapCenter: {
        lat: 62.2416479,
        lng: 25.7597186
      }
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

  componentDidMount() {
    document.addEventListener("keyup", this.handleEsc);
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.handleEsc);
  }

  render() {
    return ReactDOM.createPortal(
      <div className="fade-main container">
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
          <form id="gameCreationForm" onSubmit={this.handleGameCreation} />
          <h1>Demo Game Creation</h1>
          <br />
          <label className="">Name: &nbsp;</label>
          <input
            placeholder="Game name"
            name="gamename"
            value={this.state.gamename}
            onChange={this.handleChange}
            id="newGameNameInput"
            form="gameCreationForm"
            required
          />
          <br />
          <label className="">Description: &nbsp;</label>
          <input
            placeholder="Description"
            type="text"
            name="description"
            value={this.state.description}
            onChange={this.handleChange}
            id="newGameDescriptionInput"
            form="gameCreationForm"
            required
          />
          <br />
          <label className="">Start: &nbsp;</label>
          <input
            className="formDate"
            type="date"
            name="startDate"
            value={this.state.startDate}
            onChange={this.handleChange}
            id="newGameDateStartInput"
            form="gameCreationForm"
            required
          />
          <input
            className="formTime"
            type="time"
            name="startTime"
            onChange={this.handleChange}
            id="newGameTimeStartInput"
            form="gameCreationForm"
            required
          />
          <br />
          <label className="">End: &nbsp; </label>
          <input
            className="formDate"
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
            className="formTime"
            type="time"
            name="endTime"
            onChange={this.handleChange}
            id="newGameTimeEndInput"
            form="gameCreationForm"
            required
          />
          <br/><br/>
          <label>Map things</label>
          <br />
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
          <br />
          <button
            id="newGameSubmitButton"
            type="submit"
            form="gameCreationForm"
          >
            Submit
          </button>
          <h2>{this.state.errorMsg}</h2>
        </div>
      </div>,
      document.getElementById("form")
    );
  }
}

export default NewGameForm;
