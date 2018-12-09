import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react'

require('dotenv').config()
const { REACT_APP_API_KEY } = process.env

class ListPlacesMap extends Component {
	static defaultProps = {
		center: {
			lat: 41.398623,
			lng: 2.199970
		},
		zoom: 16
	};

	state = { latitude: this.props.latitude, longitude: this.props.longitude }

	setMarker = ({ map, maps }) => {
		this.map = map
		this.mapsApi = maps
		this.map.markers = []

		this.props.places.forEach(place => {
			let marker = new this.mapsApi.Marker({
				position: { lat: place.latitude, lng: place.longitude },
				map: this.map,
				title: place.name,
				
			});

			let contentString = `<a href=${`/#/home/place/${place.id}`}> 
				<div class='info__container'>
					<div class='info__text'>	
						<h1 class='info__text__title'>${place.name}</h1> 
						<h5 class='info__text__subtitle'>${place.address}</h5>
					</div>
				</div></a>`

			marker.addListener('click', function () {
				infowindow.close()
        		infowindow.setContent(contentString)
        		infowindow.open(map, marker)

			})
			this.map.markers.push(marker)
		})


		const icon = {
				url: 'https://res.cloudinary.com/dancing890/image/upload/v1543998523/pbr6fxjtuipslui2mftf.png',
				scaledSize: new this.mapsApi.Size(80, 80)
		}

		let marker = new this.mapsApi.Marker({
			position: { lat: this.props.latitude, lng: this.props.longitude },
			map: this.map,
			icon: icon
		})

		let contentString = `<div class='info__text'>	
				<h1 class='info__text__title'>You are here</h1> 
			</div>`

		let infowindow = new this.mapsApi.InfoWindow({
			content: contentString
		})

		marker.addListener('click', function () {
			infowindow.close()
			infowindow.setContent(contentString)
			infowindow.open(map, marker)
		});

		this.map.markers.push(marker)

	}

	render() {
		return (
			// Important! Always set the container height explicitly
			<section style={{ height: '80vh', width: '100%' }}>
				<GoogleMapReact
					defaultCenter={this.props.center}
					center={{ lat: this.props.latitude, lng: this.props.longitude }}
					defaultZoom={this.props.zoom}
					bootstrapURLKeys={{ key: REACT_APP_API_KEY, language: 'es', region: 'es' }}
					onGoogleApiLoaded={this.setMarker}>
				</GoogleMapReact>
			</section>
		);
	}
}

export default ListPlacesMap


