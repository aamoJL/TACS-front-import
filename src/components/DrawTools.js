import React, { Component } from "react";
import { FeatureGroup } from "react-leaflet";
import "leaflet-draw";
import { Draw } from "leaflet-draw";
import DrawingFormatter, { initialTextSetup } from "./DrawingFormatter";
import DrawLeafletObjects from "./DrawLeafletObjects.js";
import DrawToolsPanel from "./DrawToolsPanel";

class DrawTools extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editModeActive: false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    // disable re-rendering when edit mode is active
    return !this.state.editModeActive;
  }

  // send drawing to database when it's created
  _onCreated = e => {
    // handle one point polylines
    if (e.layerType === "polyline" && e.layer.getLatLngs().length === 1) {
      e.layer.remove();
      return;
    }
    // initial textbox setup, only sending to db when text has been written
    // e has property _tooltip after first setup => skip this if
    // more information in DrawingFormatter
    if (e.layerType === "textbox" && !e.layer._tooltip) {
      initialTextSetup(e);
      console.log(e);
      // blur event listener can't be given straight to a layer
      // getting element by ID and adding an event listener to the element
      document
        .getElementById(e.layer._leaflet_id)
        // can't put functions straight, as it calls the function
        .addEventListener("blur", this._onCreated.bind(this, e));
      document.getElementById(e.layer._leaflet_id).focus();
      return;
    }
    // use DrawingFormatter to format data for database
    let data = DrawingFormatter[e.layerType](e.layer);

    let obj = {
      gameId: this.props.currentGameId,
      drawingIsActive: true,
      data: data
    };
    this.props.sendGeoJSON(obj);
  };

  // save edit changes to db
  _onEdited = e => {
    // layers are saved in a rather curious format. they're not in an array, so need to make an array first
    let idsToEdit = [];
    e.layers.eachLayer(function(layer) {
      idsToEdit.push(layer);
    });
    idsToEdit.forEach(layer => {
      let data = DrawingFormatter[layer.options.type](layer);
      let obj = {
        gameId: this.props.currentGameId,
        mapDrawingId: layer.options.id,
        drawingIsActive: true,
        data: data
      };
      this.props.sendGeoJSON(obj);
    });
  };

  // save delete changes to db
  _onDeleted = e => {
    // layers are saved in a rather curious format. they're not in an array, so need to make an array first
    let idsToDelete = [];
    e.layers.eachLayer(function(layer) {
      idsToDelete.push(layer);
    });
    idsToDelete.forEach(layer => {
      let data = DrawingFormatter[layer.options.type](layer);
      let obj = {
        gameId: this.props.currentGameId,
        mapDrawingId: layer.options.id,
        drawingIsActive: false,
        data: data
      };
      this.props.sendGeoJSON(obj);
    });
  };

  // used to deny component update when editing is active
  _onEditDeleteStart = () => {
    this.setState({ editModeActive: true });
  };
  _onEditDeleteStop = () => {
    this.setState({ editModeActive: false });
  };

  render() {
    return (
      <FeatureGroup>
        {(this.props.role === "admin" ||
          this.props.role === "factionleader") && (
          <DrawToolsPanel
            onCreated={this._onCreated}
            onEdited={this._onEdited}
            onDeleted={this._onDeleted}
            onEditStart={this._onEditDeleteStart}
            onDeleteStart={this._onEditDeleteStart}
            onEditStop={this._onEditDeleteStop}
            onDeleteStop={this._onEditDeleteStop}
            sendGeoJSON={this.props.sendGeoJSON}
          />
        )}
        <DrawLeafletObjects drawings={this.props.drawings} />
      </FeatureGroup>
    );
  }
}

export default DrawTools;
