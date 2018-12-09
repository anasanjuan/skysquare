import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react'

require('dotenv').config()
const {  REACT_APP_API_KEY  } = process.env

class ShowMap extends Component {
	static defaultProps = {
		center: {
			lat: 41.398623, 
			lng:  2.199970
		},
		zoom: 14
	};

	state = {lat: this.props.lat, lng: this.props.lng}
	
	setMarker = ({ map, maps }) => {
		this.map = map
		this.mapsApi = maps
		this.map.markers = []

		let marker = new this.mapsApi.Marker({
			position: { lat: this.props.lat, lng: this.props.lng },
			map: this.map
		});
		this.map.markers.push(marker)
	}

	render() {
		return (
			// Important! Always set the container height explicitly
			<section style={{ height: '100%', width: '160px' }} >
				<GoogleMapReact
					defaultCenter={this.props.center}
					center={{ lat:this.props.lat, lng: this.props.lng }}
					defaultZoom={this.props.zoom}
					bootstrapURLKeys={{ key: REACT_APP_API_KEY, language: 'es', region: 'es' }}
					onGoogleApiLoaded={this.setMarker}>
				</GoogleMapReact>
			</section>
		);
	}
}

export default ShowMap


