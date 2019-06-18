import React, {Component} from 'react';
import { EditControl } from "react-leaflet-draw"
import {
	FeatureGroup,
} from 'react-leaflet'

class DrawTools extends Component {
	_onCreated = (e) => {
		//let type = e.layerType; // from the example; isn't used right now, but may be relevant in the future
		let layer = e.layer;		
		let geoJSON = layer.toGeoJSON();
		console.log(JSON.stringify(geoJSON, null, 4)); // makes the output readable in the console
		this.props.setCurrentPosition(geoJSON);
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
}

export default DrawTools;