import React, { Component } from "react";
import { FeatureGroup } from "react-leaflet";
import "leaflet-draw";
import DrawingFormatter, { initialTextSetup } from "./DrawingFormatter";
import DrawLeafletObjects from "./DrawLeafletObjects.js";
import DrawToolsPanel from "./DrawToolsPanel";

class DrawTools extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editModeActive: false,
      deleteModeActive: false,
      flagboxes: [],
      timer: null
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    // disable re-rendering when edit mode is active
    if (
      this.state.editModeActive === true ||
      this.state.deleteModeActive === true
    ) {
      return false;
    }

    // don't render if the coming elements are same as the current elements
    // stops focus loss in elements, i.e. textbox
    if (nextProps.drawings === this.props.drawings) {
      return false;
    }

    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    // start updating interval
    if (prevState.timer === null) {
      this.setState({
        timer: setInterval(this.animation, 2000)
      });
    }
  }

  sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  // animate some css when flagbox is being captured
  animation = async _ => {
    var boxes = await document.getElementsByClassName("capturing-flagbox");
    if (boxes) {
      for (let i in boxes) {
        if (boxes[i].style) {
          boxes[i].style.width = "100px";
          boxes[i].style.height = "100px";
          boxes[i].style.marginLeft = "-47px";
          boxes[i].style.marginTop = "-77px";
          boxes[i].style.borderRadius = "0%";
          boxes[i].style.backgroundColor = boxes[i].title;
          await this.sleep(400);
          boxes[i].style.backgroundColor = "#ebd7d5";
          boxes[i].style.width = "75px";
          boxes[i].style.height = "75px";
          boxes[i].style.marginLeft = "-47px";
          boxes[i].style.marginTop = "-77px";
          boxes[i].style.borderRadius = "50%";
          await this.sleep(400);
        }
      }
    }
  };

  checkTextOnBlur = drawing => {
    let text = drawing._tooltip._container.innerText;

    // compare old text with new text; if text has changed, send new textbox to database
    if (text !== drawing.options.oldText) {
      let data = DrawingFormatter["textbox"](drawing);

      let obj = {
        gameId: this.props.currentGameId,
        mapDrawingId: drawing.options.id,
        drawingIsActive: true,
        data: data
      };
      this.props.sendGeoJSON(obj);

      // if textbox is newly created, remove the added element to make way for the one fetched
      if (!drawing.options.id) {
        drawing._icon.outerHTML = "";
        drawing._tooltip._container.outerHTML = "";
      }
    }
  };

  textboxSetup = (drawing, text) => {
    initialTextSetup(drawing, text);
    // blur event listener can't be given straight to a layer
    // getting element by ID and adding an event listener to the element
    drawing.on("click", this.checkDeleteModeStatus.bind(this, drawing));
    document
      .getElementById(drawing._leaflet_id)
      // can't put functions straight, as it calls the function
      .addEventListener("blur", this.checkTextOnBlur.bind(this, drawing));
  };

  checkDeleteModeStatus = drawing => {
    if (this.state.deleteModeActive === true) {
      drawing._map.dragging.enable();
    }
  };

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
      this.textboxSetup(e.layer, "");
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

    // removing drawn elements because new elements are fetched and drawn again on top
    // removing markers and textboxes with e.layer.remove() doesn't remove them completely;
    // they still linger in the source code and disables the edit functionality due to error.
    // removing HTML elements of both to make them invisible
    if (e.layerType === "marker") {
      e.layer._icon.outerHTML = "";
      e.layer._shadow.outerHTML = "";
    } else {
      e.layer.remove();
    }
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
  _onEditStart = () => {
    this.setState({ editModeActive: true });
  };
  _onEditStop = () => {
    this.setState({ editModeActive: false });
  };

  // used to deny component update when deleting is active
  _onDeleteStart = () => {
    this.setState({ deleteModeActive: true });
    console.log(this.state.deleteModeActive);
  };

  _onDeleteStop = () => {
    this.setState({ deleteModeActive: false });
  };

  // Second DrawLeafletObjects is outside of FeatureGroup to deny editing
  render() {
    return (
      <React.Fragment>
        <FeatureGroup>
          {(this.props.role === "admin" ||
            this.props.role === "factionleader") && (
            <DrawToolsPanel
              onCreated={this._onCreated}
              onEdited={this._onEdited}
              onDeleted={this._onDeleted}
              onEditStart={this._onEditStart}
              onDeleteStart={this._onDeleteStart}
              onEditStop={this._onEditStop}
              onDeleteStop={this._onDeleteStop}
            />
          )}
          <DrawLeafletObjects
            drawings={this.props.drawings}
            textboxSetup={this.textboxSetup}
          />
        </FeatureGroup>
        <DrawLeafletObjects drawings={this.props.flagboxes} />
      </React.Fragment>
    );
  }
}

export default DrawTools;
