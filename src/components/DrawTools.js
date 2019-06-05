import React, {Component} from 'react';
import { EditControl } from "react-leaflet-draw"
import L from 'leaflet';
import {
	FeatureGroup,
	GeoJSON,
	Marker
} from 'react-leaflet'

class DrawTools extends Component {
	_onCreated = (e) => {
		let type = e.layerType;
		let layer = e.layer;		
		let geoJSON = layer.toGeoJSON();
		console.log(JSON.stringify(geoJSON, null, 4));
		this._onChange();
	}
	
	render() {
		return (
			// "It's important to wrap EditControl component into FeatureGroup component from react-leaflet. The elements you draw will be added to this FeatureGroup layer, when you hit edit button only items in this layer will be edited."
			<FeatureGroup ref={ (reactFGref) => {this._onFeatureGroupReady(reactFGref);} }> 
				<EditControl
					position='topright'
					onCreated={this._onCreated}
					draw={{
						circle: {
							repeatMode: true // allows using the tool again after finishing the previous shape
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
								color: '#97009c'
							}
						},
						polyline: {
							repeatMode: true
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
	
	_editableFG = null

	_onFeatureGroupReady = (reactFGref) => {
		// store the ref for future access to content
		console.log("reactFGref:");
		console.log(reactFGref);
		this._editableFG = reactFGref;
	}
	
	_onChange = () => {
		// this._editableFG contains the edited geometry, which can be manipulated through the leaflet API

		const { onChange } = this.props;
		console.log("onChange: ");
		console.log(onChange);
		console.log("this.props: ");
		console.log(this.props);
		if (!this._editableFG || !onChange) {
			return;
		}

		const geojsonData = this._editableFG.leafletElement.toGeoJSON();
		onChange(geojsonData);
	}
}

export default DrawTools;