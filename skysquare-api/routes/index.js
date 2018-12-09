'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const routeHandler = require('./route-handler')
const logic = require('../logic')
const jwt = require('jsonwebtoken')
const bearerTokenParser = require('../utils/bearer-token-parser')
const jwtVerifier = require('./jwt-verifier')
const Busboy = require('busboy')

const router = express.Router()

const jsonBodyParser = bodyParser.json({ limit: '100mb' })

const { env: { JWT_SECRET } } = process

router.post('/users', jsonBodyParser, (req, res) => {
    routeHandler(() => {
        const { body: { name, surname, email, password, birthday, gender, phone } } = req

        return logic.registerUser(name, surname, email, password, birthday, gender ? gender : null, phone ? phone : null)
            .then(() => {
                res.status(201)
                res.json({
                    message: `${email} successfully registered`
                })
            })
    }, res)
})

router.post('/auth', jsonBodyParser, (req, res) => {
    routeHandler(() => {
        const { body: { email, password } } = req

        return logic.authenticateUser(email, password)
            .then(id => {
                const token = jwt.sign({ sub: id }, JWT_SECRET)

                res.json({
                    data: {
                        id,
                        token
                    }
                })
            })
    }, res)
})

router.get('/users/:id', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id }, sub } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.retrieveUser(id)
            .then(user =>
                res.json({
                    data: user
                })
            )
    }, res)
})

router.post('/users/:id/profilePicture', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id }, sub } = req

        if (id !== sub) throw Error('token sub does not match user id')
        debugger
        return new Promise((resolve, reject) => {
            const busboy = new Busboy({ headers: req.headers })

            busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
                logic.addProfilePicture(id, file)
                    .then(url => {
                        debugger
                        res.json({
                            data: url
                        })
                    })
                    .catch(err => {
                        debugger
                        res.json({
                            error: err.message
                        })
                    })
            })

            busboy.on('finish', () => resolve())

            busboy.on('error', err => reject(err))

            req.pipe(busboy)
        })


    }, res)
})

router.post('/users/:id/favourites', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id }, body: { placeId }, sub } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.uploadFavourites(id, placeId)
            .then(() =>
                res.json({
                    message: 'favourite uploaded'
                })
            )
    }, res)
})

router.get('/users/:id/favourites', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id }, sub } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.listFavourites(id)
            .then(favourites =>
                res.json({
                    data: favourites
                })
            )
    }, res)
})
router.post('/users/:id/check-ins', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id }, body: { placeId }, sub } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.uploadCheckIns(id, placeId)
            .then(() =>
                res.json({
                    message: 'checkIn uploaded'
                })
            )
    }, res)
})

router.get('/users/:id/check-ins', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id }, sub } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.listCheckIns(id)
            .then(checkIns =>
                res.json({
                    data: checkIns
                })
            )
    }, res)
})

router.post('/users/:id/places', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id }, body: { name, latitude, longitude, address, breakfast, lunch, dinner, coffee, nigthLife, thingsToDo }, sub } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.addPlace(name, latitude, longitude, address, id, breakfast, lunch, dinner, coffee, nigthLife, thingsToDo)
            .then(() =>
                res.json({
                    message: 'place added'
                })
            )
    }, res)
})

router.get('/users/:id/places/name/:name/:longitude/:latitude', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id, name, longitude, latitude }, sub } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.listPlacesByName(name, longitude, latitude)
            .then(places => {
                res.json({
                    data: places
                })
            })
    }, res)
})

router.get('/users/:id/places/filter/:filter/:longitude/:latitude', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id, filter, longitude, latitude }, sub } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.listPlacesByFilter(filter, longitude, latitude)
            .then(places =>
                res.json({
                    data: places
                })
            )
    }, res)
})

router.get('/users/:id/places/:placeId', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id, placeId }, sub } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.retrievePlaceById(id, placeId)
            .then(place =>
                res.json({
                    data: place
                })
            )
    }, res)
})

router.post('/users/:id/places/:placeId/scoring', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id, placeId }, body: { score }, sub } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.updateScoring(id, placeId, score)
            .then(place =>
                res.json({
                    data: place
                })
            )
    }, res)
})

router.post('/users/:id/places/:placeId/pictures', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id, placeId }, sub } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return new Promise((resolve, reject) => {
            const busboy = new Busboy({ headers: req.headers })

            busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
                logic.addPlacePicture(id, placeId, file)
                    .then(url => {
                        res.json({
                            data: url
                        })
                    })
            })

            busboy.on('finish', res => resolve(res))

            busboy.on('error', err => reject(err))

            req.pipe(busboy)
        })

    }, res)
})

router.get('/users/:id/places/:placeId/pictures', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id, placeId }, sub } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.listPlacePictures(placeId)
            .then(pictureUrls =>
                res.json({
                    data: pictureUrls
                })
            )
    }, res)
})

router.get('/users/:id/pictures', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id }, sub } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.listUserPictures(id)
            .then(pictureUrls =>
                res.json({
                    data: pictureUrls
                })
            )
    }, res)
})



router.post('/users/:id/places/:placeId/scoring', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id, placeId }, body: { score }, sub } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.updateScoring(placeId, score)
            .then(place =>
                res.json({
                    data: place
                })
            )
    }, res)
})

router.post('/users/:id/places/:placeId/tips', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id, placeId }, body: { text }, sub } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.addTip(id, placeId, text)
            .then(tip =>
                res.json({
                    data: tip
                })
            )
    }, res)
})

router.get('/users/:id/places/:placeId/tips', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id, placeId }, sub } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.listPlaceTips(placeId)
            .then(tips =>
                res.json({
                    data: tips
                })
            )
    }, res)
})

router.get('/users/:id/tips', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id }, sub } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.listUserTips(id)
            .then(tips =>
                res.json({
                    data: tips
                })
            )
    }, res)
})


module.exports = router