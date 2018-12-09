import validate from '../utils/validate'
// const validate = require('../utils/validate')

const logic = {
    _userId: sessionStorage.getItem('userId') || null,
    _token: sessionStorage.getItem('token') || null,

    
    url: 'NO-URL', //todo pasar a .env

    register(name, surname, email, password, birthday, gender, phone) {
        validate([
            { key: 'name', value: name, type: String },
            { key: 'surname', value: surname, type: String },
            { key: 'email', value: email, type: String },
            { key: 'password', value: password, type: String },
            { key: 'birthday', value: birthday, type: String },
            { key: 'gender', value: gender, type: String, optional: true },
            { key: 'phone', value: phone, type: String, optional: true }
        ])

        return fetch(`${this.url}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ name, surname, email, password, birthday, gender, phone })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },

    logIn(email, password) {
        validate([
            { key: 'email', value: email, type: String },
            { key: 'password', value: password, type: String },
        ])

        return fetch(`${this.url}/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ email, password })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                const { id, token } = res.data

                this._userId = id
                this._token = token

                sessionStorage.setItem('userId', id)
                sessionStorage.setItem('token', token)
            })
    },

    retrieveUser() {
        return fetch(`${this.url}/users/${this._userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
            .then(res => {
                return res.json()
            })
            .then(res => {
                if (res.error) throw Error(res.error)

                return res.data
            })
    },

    get loggedIn() {
        return !!this._userId
    },

    logOut() {
        this._userId = null
        this._token = null

        sessionStorage.removeItem('userId')
        sessionStorage.removeItem('token')
    },

    addPlace(name, address, latitude, longitude, breakfast, lunch, dinner, coffee, nightLife, thingsToDo) {
        validate([
            { key: 'name', value: name, type: String },
            { key: 'address', value: address, type: String },
            { key: 'latitude', value: latitude, type: Number },
            { key: 'longitude', value: longitude, type: Number },
            { key: 'breakfast', value: breakfast, type: Boolean },
            { key: 'lunch', value: lunch, type: Boolean },
            { key: 'dinner', value: dinner, type: Boolean },
            { key: 'coffee', value: coffee, type: Boolean },
            { key: 'nightLife', value: nightLife, type: Boolean },
            { key: 'thingsToDo', value: thingsToDo, type: Boolean }
        ])
        return fetch(`${this.url}/users/${this._userId}/places`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`
            },
            body: JSON.stringify({ name, address, latitude, longitude, breakfast, lunch, dinner, coffee, nightLife, thingsToDo })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },

    //‘Haversine’ formula.
    _getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = this._deg2rad(lat2 - lat1);  // _deg2rad below
        var dLon = this._deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this._deg2rad(lat1)) * Math.cos(this._deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    },

    _deg2rad(deg) {
        return deg * (Math.PI / 180)
    },

    listPlacesByFilter(filter, longitude, latitude) {
        validate([
            { key: 'filter', value: filter, type: String },
        ])

        return fetch(`${this.url}/users/${this._userId}/places/filter/${filter}/${longitude}/${latitude}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
            .then(res => {
                return res.json()
            })
            .then(res => {
                if (res.error) throw Error(res.error)

                let places = res.data

                let placesDistance = places.map(place => {
                    place.distance = (this._getDistanceFromLatLonInKm(latitude, longitude, place.latitude, place.longitude) * 1000).toFixed(0)
                    return place
                })
                return placesDistance
            })
    },

    listPlacesByName(name, longitude, latitude) {
        validate([
            { key: 'name', value: name, type: String },
        ])
        return fetch(`${this.url}/users/${this._userId}/places/name/${name}/${longitude}/${latitude}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
            .then(res => {
                return res.json()
            })
            .then(res => {
                if (res.error) throw Error(res.error)

                let places = res.data

                let placesDistance = places.map(place => {
                    place.distance = (this._getDistanceFromLatLonInKm(latitude, longitude, place.latitude, place.longitude) * 1000).toFixed(0)
                    return place
                })
                return placesDistance
            })

    },

    retrievePlace(placeId) {
        validate([
            { key: 'placeId', value: placeId, type: String },
        ])
        return fetch(`${this.url}/users/${this._userId}/places/${placeId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
            .then(res => {
                return res.json()
            })
            .then(res => {
                if (res.error) throw Error(res.error)

                const { scores } = res.data
                const brokenScore = scores.filter(score => score === 0)
                const mehScore = scores.filter(score => score === 5)
                const heartScore = scores.filter(score => score === 10)

                res.data.meh = 0
                res.data.heart = 0
                res.data.broken = 0

                if (mehScore.length !== 0 || heartScore.length !== 0 || brokenScore.length !== 0) {
                    res.data.meh = ((mehScore.length / scores.length) * 100).toFixed(0)
                    res.data.heart = ((heartScore.length / scores.length) * 100).toFixed(0)
                    res.data.broken = (100 - res.data.meh - res.data.heart).toFixed(0)
                }

                return res.data
            })

    },

    updateScoring(placeId, scoring) {
        validate([
            { key: 'scoring', value: scoring, type: String },
            { key: 'placeId', value: placeId, type: String },

        ])

        let score = 0
        if (scoring === 'heart') {
            score = 10
        } else if (scoring === 'meh') {
            score = 5
        } else if (scoring === 'borkenHeart') {
            score = 0
        }

        return fetch(`${this.url}/users/${this._userId}/places/${placeId}/scoring`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`
            },
            body: JSON.stringify({ score })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                const { scores } = res.data

                const brokenScore = scores.filter(score => score === 0)
                const mehScore = scores.filter(score => score === 5)
                const heartScore = scores.filter(score => score === 10)

                res.data.meh = 0
                res.data.heart = 0
                res.data.broken = 0

                if (mehScore.length !== 0 || heartScore.length !== 0 || brokenScore.length !== 0) {
                    res.data.meh = ((mehScore.length / scores.length) * 100).toFixed(0)
                    res.data.heart = ((heartScore.length / scores.length) * 100).toFixed(0)
                    res.data.broken = (100 - res.data.meh - res.data.heart).toFixed(0)
                }

                return res.data
            })
    },

    listPictures(placeId) {
        validate([
            { key: 'placeId', value: placeId, type: String },
        ])

        return fetch(`${this.url}/users/${this._userId}/places/${placeId}/pictures`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
            .then(res => {
                return res.json()
            })
            .then(res => {
                if (res.error) throw Error(res.error)
                return res.data
            })

    },

    listUserPictures(userId) {
        validate([
            { key: 'userId', value: userId, type: String },
        ])
        return fetch(`${this.url}/users/${this._userId}/pictures`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
            .then(res => {
                return res.json()
            })
            .then(res => {
                if (res.error) throw Error(res.error)
                return res.data
            })

    },


    uploadPicture(placeId, picture) {
        validate([
            { key: 'placeId', value: placeId, type: String },
        ])

        let data = new FormData()

        data.append('picture', picture)

        return fetch(`${this.url}/users/${this._userId}/places/${placeId}/pictures`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this._token}`
            },
            body: data
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                return res.data
            })
    },

    uploadProfilePicture(picture) {
        let data = new FormData()

        data.append('picture', picture)

        return fetch(`${this.url}/users/${this._userId}/profilePicture`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this._token}`
            },
            body: data
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                return res.data
            })
    },

    addTip(placeId, text) {
        validate([
            { key: 'placeId', value: placeId, type: String },
            { key: 'text', value: text, type: String },

        ])
        return fetch(`${this.url}/users/${this._userId}/places/${placeId}/tips`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`
            },
            body: JSON.stringify({ text })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
                return res.data
            })
    },

    listPlaceTips(placeId) {
        validate([
            { key: 'placeId', value: placeId, type: String },
        ])

        return fetch(`${this.url}/users/${this._userId}/places/${placeId}/tips`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            },
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
                return res.data
            })
    },

    listUserTips(userId) {
        validate([
            { key: 'userId', value: userId, type: String },
        ])

        return fetch(`${this.url}/users/${this._userId}/tips`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            },
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
                return res.data
            })
    },

    uploadCheckin(placeId) {
        validate([
            { key: 'placeId', value: placeId, type: String },
        ])
        return fetch(`${this.url}/users/${this._userId}/check-ins`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`
            },
            body: JSON.stringify({ placeId })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
                return res
            })
    },

    uploadFavourites(placeId) {
        validate([
            { key: 'placeId', value: placeId, type: String },
        ])
        return fetch(`${this.url}/users/${this._userId}/favourites`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`
            },
            body: JSON.stringify({ placeId })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
                return res
            })
    },

    listFavourites() {
        return fetch(`${this.url}/users/${this._userId}/favourites`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            },
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                return res.data
            })
    },

    listCheckIns() {
        return fetch(`${this.url}/users/${this._userId}/check-ins`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            },
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                return res.data
            })
    }


}

export default logic
// module.exports = logic