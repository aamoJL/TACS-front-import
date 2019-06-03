import React, {Component} from 'react';
import { EditControl } from "react-leaflet-draw"
import {
	FeatureGroup,
	GeoJSON,
} from 'react-leaflet'

class DrawTools extends Component {
	render() {
		return (
			// "It's important to wrap EditControl component into FeatureGroup component from react-leaflet. The elements you draw will be added to this FeatureGroup layer, when you hit edit button only items in this layer will be edited."
			<FeatureGroup> 
				<EditControl
					position='topright'
					onEdited={this._onEdited}
					onCreated={this._onCreated}
					onDeleted={this._onDeleted}
					onMounted={this._onMounted}
					onEditStart={this._onEditStart}
					onEditStop={this._onEditStop}
					onDeleteStart={this._onDeleteStart}
					onDeleteStop={this._onDeleteStop}
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
						}
					}}
				/>
			</FeatureGroup>
		)
	}
}

export default DrawTools;