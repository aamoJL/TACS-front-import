import React, {Component} from 'react';
import { EditControl } from 'react-leaflet-draw'
import L from 'leaflet'
import 'leaflet-draw'
import { FeatureGroup } from 'react-leaflet'

// empty icon for the text field
let emptyicon = L.icon({
	iconUrl: '../icons/nil.png',
	iconSize: [1, 1],
	iconAnchor: [1, 1]
});

// class for text field
L.Draw.MarkerTextBox = L.Draw.Marker.extend({
	options: {
		icon: emptyicon,
		repeatMode: false,
	},
	initialize: function (map, options) {
		this.type = 'textbox'; // important to have a unique type, so that it won't get mixed up with other elements
    this.featureTypeCode = 'textbox';
		L.Draw.Feature.prototype.initialize.call(this, map, options);
  }
});

L.DrawToolbar.include ({
	getModeHandlers: function(map) {
		return [{
			enabled: this.options.polyline,
			handler: new L.Draw.Polyline(map, this.options.polyline),
			title: L.drawLocal.draw.toolbar.buttons.polyline
		},{
			enabled: this.options.polygon,
			handler: new L.Draw.Polygon(map, this.options.polygon),
			title: L.drawLocal.draw.toolbar.buttons.polygon
		},{
			enabled: this.options.rectangle,
			handler: new L.Draw.Rectangle(map, this.options.rectangle),
			title: L.drawLocal.draw.toolbar.buttons.rectangle
		},{
			enabled: this.options.circle,
			handler: new L.Draw.Circle(map, this.options.circle),
			title: L.drawLocal.draw.toolbar.buttons.circle
		},{
			enabled: this.options.marker,
			handler: new L.Draw.Marker(map, this.options.marker),
			title: L.drawLocal.draw.toolbar.buttons.marker
		},{
      enabled: this.options.marker,
			handler: new L.Draw.MarkerTextBox(map, this.options.marker),
			title: 'Write text'
		}];
	}
});

class DrawTools extends Component {
	_onCreated = (e) => {
		// check if a drawn polyline has just one point in it
		if (e.layerType === 'polyline' && e.layer.getLatLngs().length === 1) {
			e.layer.remove();
			return;
		}
		// binding text field to textbox
		if (e.layerType === 'textbox') {
			e.layer.bindTooltip('<div class="editable" contenteditable="true" placeholder="Type here"></div>', {permanent: true});
		}
		// turning layer data to geoJSON
		let layer = e.layer;
		let geoJSON = layer.toGeoJSON();
		console.log(JSON.stringify(geoJSON, null, 4)); // makes the output readable in the console
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
								color: '#e1e100', // Color the shape will turn when intersects
								message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
							},
							shapeOptions: {
								color: '#ed2572',
								opacity: 1
							}
						},
						polyline: {
							repeatMode: true,
							shapeOptions: {
								color: '#ed2572',
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
		)
	}
}

export default DrawTools;