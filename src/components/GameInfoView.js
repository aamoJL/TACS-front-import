import React from "react";
import { Map, TileLayer } from "react-leaflet";

export default class GameInfoView extends React.Component {
  componentDidMount() {
    document.addEventListener("keyup", this.handleEsc);
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.handleEsc);
  }

  handleEsc = e => {
    if (e.keyCode === 27) {
      this.props.toggleView();
    }
  };

  render() {
    if (this.props.gameInfo === undefined) {
      return false;
    }
    return (
      <div className="fade-main">
        <div className="sticky">
          <span
            id="closeGameInfoX"
            className="close"
            onClick={this.props.toggleView}
          >
            ×
          </span>
        </div>
        <div className="">
          <h1>Game Info</h1>
          <p>Game name: {this.props.gameInfo.name}</p>
          <p>Description: {this.props.gameInfo.desc}</p>
          <p>Start date: {this.props.gameInfo.startdate}</p>
          <p>End date: {this.props.gameInfo.enddate}</p>
          <h2>Factions</h2>
          <div>
            {this.props.gameInfo.factions.map(faction => (
              <p key={faction.factionId} style={{ color: faction.colour }}>
                {faction.factionName}
              </p>
            ))}
          </div>
          <div>
            <Map
              id="gameInfoCenterMap"
              className=""
              center={[
                this.props.gameInfo.center.lat,
                this.props.gameInfo.center.lng
              ]}
              zoom="13"
              maxZoom="13"
              style={{ height: "400px", width: "400px" }}
            >
              <TileLayer
                attribution="Maanmittauslaitoksen kartta"
                url=" https://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.jpg"
              />
            </Map>
          </div>
        </div>
      </div>
    );
  }
}
