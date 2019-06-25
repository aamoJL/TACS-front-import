import React, { Component } from "react";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import "leaflet-draw";
import { FeatureGroup } from "react-leaflet";

// class for text field
L.Draw.MarkerTextBox = L.Draw.Marker.extend({
  options: {
    icon: L.divIcon({
      className: "", // empty class to override default styling
      iconSize: [20, 20],
      iconAnchor: [10, 20]
    }),
    repeatMode: false,
    interactive: true
  },
  initialize: function(map, options) {
    this.type = "textbox"; // important to have a unique type, so that it won't get mixed up with other elements
    this.featureTypeCode = "textbox";
    L.Draw.Feature.prototype.initialize.call(this, map, options);
  }
});

// Overriding default toolbar
// Just adding one new button though lol
L.DrawToolbar.include({
  getModeHandlers: function(map) {
    return [
      {
        enabled: this.options.polyline,
        handler: new L.Draw.Polyline(map, this.options.polyline),
        title: L.drawLocal.draw.toolbar.buttons.polyline
      },
      {
        enabled: this.options.polygon,
        handler: new L.Draw.Polygon(map, this.options.polygon),
        title: L.drawLocal.draw.toolbar.buttons.polygon
      },
      {
        enabled: this.options.rectangle,
        handler: new L.Draw.Rectangle(map, this.options.rectangle),
        title: L.drawLocal.draw.toolbar.buttons.rectangle
      },
      {
        enabled: this.options.circle,
        handler: new L.Draw.Circle(map, this.options.circle),
        title: L.drawLocal.draw.toolbar.buttons.circle
      },
      {
        enabled: this.options.marker,
        handler: new L.Draw.Marker(map, this.options.marker),
        title: L.drawLocal.draw.toolbar.buttons.marker
      },
      {
        enabled: this.options.marker,
        handler: new L.Draw.MarkerTextBox(map, this.options.marker),
        title: "Write text"
      }
    ];
  }
});

class DrawTools extends Component {
<<<<<<< src/components/DrawTools.js
  constructor(props) {
    super(props);
    this.state = {
      geoJSONAll: [] // property for all GeoJSON data in the map
    };
  }

  _onCreated = e => {
    // check if a drawn polyline has just one point in it
    if (e.layerType === "polyline" && e.layer.getLatLngs().length === 1) {
      e.layer.remove();
      return;
    }

    if (e.layerType === "textbox") {
      // have to create tooltip as a DOM element to allow text selecting. maybe
      let tooltip = L.DomUtil.create("div", "editable");
      tooltip.innerHTML =
        '<div contenteditable="true" placeholder="Click here and type"></div>';

      e.layer.bindTooltip(tooltip, {
        permanent: true,
        direction: "bottom",
        interactive: true
      });

      // disable dragging when cursor is over marker (tooltip)
      // clicking on tooltip fires the marker's click handler, hence e.layer.on
      e.layer.on("mouseover", function() {
        e.layer._map.dragging.disable();
      });

      // enable dragging again when cursor is out of marker (tooltip)
      e.layer.on("mouseout", function() {
        e.layer._map.dragging.enable();
      });

      // show placeholder text again upon emptying textbox
      e.layer.on("keyup", function() {
        // when the text area is emptied, a <br> appears
        // manually removing it so that the placeholder text can show
        if (
          tooltip.innerHTML ===
            '<div placeholder="Click here and type" contenteditable="true"><br></div>' ||
          tooltip.innerHTML ===
            '<div placeholder="Click here and type" contenteditable="true"><div><br></div></div>'
        ) {
          tooltip.innerHTML =
            '<div placeholder="Click here and type" contenteditable="true"></div>';
        }
      });
    } // end if (e.layerType === "textbox")

    // turning layer data to GeoJSON
    this.makeGeoJSON(e.layer);
  }; // end _onCreated

  makeGeoJSON = e => {
    let geoJSON = e.toGeoJSON();
    let newGeoJSONAll = this.state.geoJSONAll;
    newGeoJSONAll.push(geoJSON); // can't do +=, need to use push function
    console.log(JSON.stringify(newGeoJSONAll, null, 4));
    this.setState({ geoJSONAll: newGeoJSONAll });
  };

  render() {
    return (
      // "It's important to wrap EditControl component into FeatureGroup component from react-leaflet. The elements you draw will be added to this FeatureGroup layer, when you hit edit button only items in this layer will be edited."
      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={this._onCreated}
          draw={{
            circle: {
              repeatMode: true, // allows using the tool again after finishing the previous shape
              shapeOptions: {
                color: "#f9f10c",
                opacity: 1 // affects the outline only. for some reason it wasn't at full opacity, so this is needed for more clarity
              }
            },
            rectangle: {
              repeatMode: true
            },
            polygon: {
              repeatMode: true,
              allowIntersection: false, // Restricts shapes to simple polygons
              drawError: {
                color: "#e1e100", // Color the shape will turn when intersects
                message: "<strong>Oh snap!<strong> you can't draw that!" // Message that will show when intersect
              },
              shapeOptions: {
                color: "#ed2572",
                opacity: 1
              }
            },
            polyline: {
              repeatMode: true,
              shapeOptions: {
                color: "#ed2572",
                opacity: 1
              }
            },
            marker: {
              repeatMode: false
            },
            circlemarker: false
          }}
        />
      </FeatureGroup>
    );
  }
=======
	constructor(props){
	  super(props);
	  this.state = {
		  geoJSONAll: [] // property for all GeoJSON data in the map
	  }
  }
  
	_onCreated = (e) => {
		let type = e.layerType; // from the example; isn't used right now, but may be relevant in the future
		let layer = e.layer;
    this.makeGeoJSON(e.layer);
	}

  // turn layer to GeoJSON data and add it to an array of all GeoJSON data of the current map
	makeGeoJSON = (e) => {
    let geoJSON = e.toGeoJSON();
    let newGeoJSONAll = this.state.geoJSONAll;
    newGeoJSONAll.push(geoJSON);
    this.setState({geoJSONAll: newGeoJSONAll});
    console.log(JSON.stringify(geoJSON, null, 4)); // printing GeoJSON data of the previous object create
    console.log("newGeoJSONAll.length: " + newGeoJSONAll.length);
	}
	
	render() {
		return (
			// "It's important to wrap EditControl component into FeatureGroup component from react-leaflet. The elements you draw will be added to this FeatureGroup layer, when you hit edit button only items in this layer will be edited."
			<FeatureGroup> 
				<EditControl
					position='topright'
					onCreated={this._onCreated}
					draw={{
						circle: {
							repeatMode: true, // allows using the tool again after finishing the previous shape
							shapeOptions: {
								color: '#f9f10c',
								opacity: 100
							}
						},
						rectangle: {
							repeatMode: true
						},
						polygon: {
							repeatMode: true,
							allowIntersection: false, // Restricts shapes to simple polygons
							drawError: {
								color: '#e1e100', // Color the shape will turn when intersects
								message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
							},
							shapeOptions: {
								color: '#ed2572',
								opacity: 100
							}
						},
						polyline: {
							repeatMode: true,
							shapeOptions: {
								color: '#ed2572',
								opacity: 100
							}
						},
						marker: {
							repeatMode: true
						},
						circlemarker: false
					}}
				/>
			</FeatureGroup>
		)
	}
>>>>>>> src/components/DrawTools.js
}

export default DrawTools;
