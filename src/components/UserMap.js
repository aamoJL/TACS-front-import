import React, {Component} from 'react';
import {
	GeoJSON,
	Map,
	TileLayer
} from 'react-leaflet'
import DrawTools from './DrawTools.js'


class UserMap extends Component {
	render() {
		return (
			<Map
				className="map"
				center={this.props.position}
				zoom={this.props.zoom}
			>
				<TileLayer
					attribution='Maanmittauslaitoksen kartta'
					url=" https://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.jpg"
				/>
				<DrawTools position={this.props.position} />
			</Map>
		)
	}
}


export default UserMap;