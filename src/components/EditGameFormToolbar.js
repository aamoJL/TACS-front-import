import React from "react";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";

import { flagboxIcon } from "./DrawToolsPanel";
import DrawingFormatter from "./DrawingFormatter";
import DrawLeafletObjects from "./DrawLeafletObjects";

// class for flagbox
L.Draw.MarkerFlagbox = L.Draw.Marker.extend({
  options: {
    icon: flagboxIcon,
    repeatMode: false,
    interactive: true
  },
  initialize: function(map, options) {
    this.type = "flagbox";
    this.featureTypeCode = "flagbox";
    L.Draw.Feature.prototype.initialize.call(this, map, options);
  }
});

class EditGameFormToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editModeActive: false
    };
    // Overriding default toolbar
    // Removing everything but edit and delete
    L.DrawToolbar.include({
      getModeHandlers: function(map) {
        return [];
      }
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    // disable re-rendering when edit mode is active
    return !this.state.editModeActive;
  }

  _onEdited = e => {
    // layers are saved in a rather curious format. they're not in an array, so need to make an array first
    let idsToEdit = [];
    e.layers.eachLayer(function(layer) {
      idsToEdit.push(layer);
    });
    // use DrawingFormatter to format data for database
    let objs = idsToEdit.map(layer => {
      return {
        objectivePointId: layer.options.id,
        objectivePointDescription: layer.options.node,
        objectivePointMultiplier: layer.options.multiplier,
        data: DrawingFormatter[layer.options.type](layer)
      };
    });
    this.props.updateFlagbox(objs);
  };

  _onDeleted = e => {
    // layers are saved in a rather curious format. they're not in an array, so need to make an array first
    let idsToDelete = [];
    e.layers.eachLayer(function(layer) {
      idsToDelete.push(layer);
    });
    // use DrawingFormatter to format data for database
    let objs = idsToDelete.map(layer => {
      return {
        gameId: this.props.gameId,
        objectivePointId: layer.options.id,
        objectivePointDescription: layer.options.node,
        data: DrawingFormatter[layer.options.type](layer)
      };
    });
    this.props.deleteFlagbox(objs);
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
        <EditControl
          onEdited={this._onEdited}
          onDeleted={this._onDeleted}
          onEditStart={this._onEditDeleteStart}
          onDeleteStart={this._onEditDeleteStart}
          onEditStop={this._onEditDeleteStop}
          onDeleteStop={this._onEditDeleteStop}
          sendGeoJSON={this.props.sendGeoJSON}
        />
        <DrawLeafletObjects drawings={this.props.flagboxlocations || []} />
      </FeatureGroup>
    );
  }
}

export default EditGameFormToolbar;
