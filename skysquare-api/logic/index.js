'use strict'

const { models: { User, Voter, Place, Picture, Tip, } } = require('skysquare-data')
const { AlreadyExistsError, AuthError, NotFoundError } = require('../errors')
const validate = require('../utils/validate')
const moment = require('moment')

let cloudinary = require('cloudinary')

const { MY_CLOUD_NAME, MY_API_KEY, MY_APY_SECRET } = process.env

cloudinary.config({
    cloud_name: MY_CLOUD_NAME,
    api_key: MY_API_KEY,
    api_secret: MY_APY_SECRET
})

const logic = {

    _returnPlacePicture(pictures) {
        let pictureUrl = 'https://res.cloudinary.com/dancing890/image/upload/v1542807002/waxfi0xtcm5u48yltzxc.png'

        if (pictures.length > 0) {
            const picture = pictures[Math.floor(Math.random() * pictures.length)]

            pictureUrl = picture.url
        }
        return pictureUrl
    },

    _returnPlaceTip(tips) {
        let tipText = ''

        if (tips.length > 0) {
            const tip = tips[Math.floor(Math.random() * tips.length)]

            tipText = tip.text
        }
        return tipText
    },

    _returnPlaceScoring(voters) {
        let scoring = '?'

        if (voters.length === 1) {
            return scoring = voters[0].score

        } else if (voters.length > 1) {
            const scores = voters.map(voter => voter.score)

            const sum = scores.reduce((a, b) => a + b, 0)

            const average = +(sum / scores.length).toFixed(1)

            return average
        }
        return scoring
    },

    /**
     * @param {String} name 
     * @param {String} surname 
     * @param {String} email 
     * @param {String} password 
     * @param {String} birthday 
     * @param {String} gender 
     * @param {String} phone 
     * 
     * @throws {AlreadyExistsError} when user with input email already exist
     * 
     * @returns {Promise} resolves on correct data, rejects on incorrect data 
     */
    registerUser(name, surname, email, password, birthday, gender, phone) {
        validate([
            { key: 'name', value: name, type: String },
            { key: 'surname', value: surname, type: String },
            { key: 'email', value: email, type: String },
            { key: 'password', value: password, type: String },
            { key: 'birthday', value: birthday, type: String },
            { key: 'gender', value: gender, type: String, optional: true },
            { key: 'phone', value: phone, type: String, optional: true }
        ])

        return (async () => {
            let user = await User.findOne({ email })

            if (user) throw new AlreadyExistsError(`${email} already exist`)

            user = new User({ name, surname, email, password, birthday })

            gender != null && (user.gender = gender)

            phone != null && (user.phone = phone)

            await user.save()
        })()
    },

    /**
     * @param {String} email 
     * @param {String} password 
     * 
     * @throws {NotFoundError} when user with input email does not exist
     * @throws {AuthError} when password is incorrect 
     * 
     * @returns {Promise} resolves on correct data, rejects on incorrect data 
     */
    authenticateUser(email, password) {
        validate([
            { key: 'email', value: email, type: String },
            { key: 'password', value: password, type: String },
        ])

        return (async () => {
            let user = await User.findOne({ email })

            if (!user) throw new NotFoundError(`user not found`)

            if (user.password !== password) throw new AuthError(`incorrect user or password`)

            return user.id
        })()
    },

    /**
     * @param {String} id 
     * 
     * @throws {NotFoundError} when user with input email does not exist
     * 
     * @returns {Promise} resolves on correct data, rejects on incorrect data 
     */
    retrieveUser(id) {
        validate([
            { key: 'id', value: id, type: String }
        ])

        return (async () => {
            const user = await User.findById(id, { password: 0, postits: 0, __v: 0 }).lean()

            if (!user) throw new NotFoundError(`user not found`)

            user.id = user._id.toString()

            delete user._id

            delete user.password

            return user
        })()
    },

    /**
     * @param {String} id 
     * @param {Stream} file 
     * 
     * @throws {NotFoundError} when user with input email does not exist
     * 
     * @returns {Promise} resolves on correct data, rejects on incorrect data 
     */
    addProfilePicture(id, file) {
        validate([
            { key: 'id', value: id, type: String },
        ])

        return (async () => {
            let user = await User.findById(id)

            if (!user) throw new NotFoundError(`user does not exist`)

            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((result, error) => {
                    if (error) return reject(error)

                    resolve(result)
                })

                file.pipe(stream)
            })

            user.profilePicture = result.url

            user.profilePublicId = result.public_id

            await user.save()

            return user.profilePicture
        })()
    },

    /**
     * @param {String} name 
     * @param {Number} latitude 
     * @param {Number} longitude 
     * @param {String} address 
     * @param {String} userId 
     * @param {Boolean} breakfast 
     * @param {Boolean} lunch 
     * @param {Boolean} dinner 
     * @param {Boolean} coffee 
     * @param {Boolean} nigthLife 
     * @param {Boolean} thingsToDo 
     * 
     * @throws {NotFoundError} when user with input email does not exist
     * 
     * @returns {Promise} resolves on correct data, rejects on incorrect data 
     */
    addPlace(name, latitude, longitude, address, userId, breakfast, lunch, dinner, coffee, nigthLife, thingsToDo) {
        validate([
            { key: 'name', value: name, type: String },
            { key: 'latitude', value: latitude, type: Number },
            { key: 'longitude', value: longitude, type: Number },
            { key: 'address', value: address, type: String },
            { key: 'userId', value: userId, type: String },
            { key: 'breakfast', value: breakfast, type: Boolean, optional: true },
            { key: 'lunch', value: lunch, type: Boolean, optional: true },
            { key: 'dinner', value: dinner, type: Boolean, optional: true },
            { key: 'coffee', value: coffee, type: Boolean, optional: true },
            { key: 'nigthLife', value: nigthLife, type: Boolean, optional: true },
            { key: 'thingsToDo', value: thingsToDo, type: Boolean, optional: true }
        ])
        return (async () => {
            let user = await User.findById(userId)

            if (!user) throw new NotFoundError(`user does not exist`)

            const location = {
                type: "Point",
                coordinates: [latitude, longitude]
            }

            let place = new Place({ name, location, address, userId, breakfast, lunch, dinner, coffee, nigthLife, thingsToDo })

            await place.save()
        })()
    },

    /**
     * @param {String} name 
     * @param {String} longitude 
     * @param {String} latitude 
     * 
     * @returns {Promise} resolves on correct data, rejects on incorrect data 
     */
    listPlacesByName(name, longitude, latitude) {
        validate([
            { key: 'name', value: name, type: String },
            { key: 'latitude', value: latitude, type: String },
            { key: 'longitud', value: longitude, type: String },
        ])

        return (async () => {
            let placeReg = new RegExp(name, "i")

            let places = await Place.find({
                $and: [{ name: { $regex: placeReg } },
                {
                    location: {
                        $near: {
                            $maxDistance: 15000,
                            $geometry: {
                                type: "Point",
                                coordinates: [latitude, longitude]
                            }
                        }
                    }
                }
                ]
            }, { userId: 0, __v: 0 }).lean()

            let promises = places.map(async place => {

                const pictures = await Picture.find({ placeId: place._id })

                place.picture = this._returnPlacePicture(pictures)


                const tips = await Tip.find({ placeId: place._id })

                place.tip = this._returnPlaceTip(tips)


                const [latitude, longitude] = place.location.coordinates

                place.longitude = longitude
                place.latitude = latitude

                place.scoring = this._returnPlaceScoring(place.voters)

                place.id = place._id.toString()

                delete place._id

                return place
            })
            const listPlaces = await Promise.all(promises)

            return listPlaces.map(({ id, name, address, scoring, picture, tip, longitude, latitude }) => ({ id, name, address, scoring, picture, tip, longitude, latitude }))
        })()
    },

    /**
     * 
     * @param {String} filter 
     * @param {String} longitude 
     * @param {String} latitude 
     * 
     * @returns {Promise} resolves on correct data, rejects on incorrect data 
     */
    listPlacesByFilter(filter, longitude, latitude) {
        validate([
            { key: 'filter', value: filter, type: String },
            { key: 'latitude', value: latitude, type: String },
            { key: 'longitud', value: longitude, type: String },
        ])

        return (async () => {

            let places = await Place.find({
                $and: [
                    { [filter]: true },
                    {
                        location: {
                            $near: {
                                $maxDistance: 15000,
                                $geometry: {
                                    type: "Point",
                                    coordinates: [latitude, longitude]
                                }
                            }
                        }
                    }]
            }, { userId: 0, __v: 0 }).lean()

            const listPlaces = await Promise.all(
                places.map(async place => {
                    const pictures = await Picture.find({ placeId: place._id.toString() })

                    place.picture = this._returnPlacePicture(pictures)

                    const tips = await Tip.find({ placeId: place._id })

                    const [latitude, longitude] = place.location.coordinates

                    place.longitude = longitude
                    place.latitude = latitude

                    place.tip = this._returnPlaceTip(tips)

                    place.id = place._id.toString()

                    delete place._id

                    place.scoring = this._returnPlaceScoring(place.voters)

                    return place
                })
            )
            return listPlaces.map(({ id, name, address, scoring, picture, tip, longitude, latitude }) => ({ id, name, address, scoring, picture, tip, longitude, latitude }))
        })()
    },

    /**
     * @param {String} userId 
     * @param {String} placeId 
     * 
     *  @throws {NotFoundError} when user with input email does not exist
     * 
     * @returns {Promise} resolves on correct data, rejects on incorrect data 
     */
    retrievePlaceById(userId, placeId) {
        validate([
            { key: 'userId', value: userId, type: String },
            { key: 'placeId', value: placeId, type: String }
        ])
        return (async () => {
            let place = await Place.findById(placeId, { __v: 0 }).lean()

            if (!place) throw new NotFoundError(`place does not exist`)

            let user = await User.findById(userId, { __v: 0 }).lean()

            if (!user) throw new NotFoundError(`user does not exist`)

            //check if it is a user favorites
            const fav = user.favourites.find(fav => fav.toString() === placeId)

            place.favourite = fav ? true : false

            //check if it is a user check in
            const check = user.checkIns.find(check => check.toString() === placeId)

            place.checkIn = check ? true : false

            //find user score and visitors 
            const voter = place.voters.find(voter => voter.userId.toString() === userId)

            if (voter) place.userScore = voter.score

            place.visitors = place.voters.length

            //get one picture
            const pictures = await Picture.find({ placeId })

            place.picture = this._returnPlacePicture(pictures)

            //get scoring and scores
            place.scoring = this._returnPlaceScoring(place.voters)

            place.scores = []

            if (place.voters.length === 1) {

                place.scores = [place.scoring]

            } else if (place.voters.length > 1) {
                const scores = place.voters.map(voter => voter.score)

                place.scores = scores
            }

            place.id = place._id.toString()

            delete place._id

            place.userId = place.userId.toString()

            delete place.voters

            return place
        })()
    },

    /**
     * @param {String} userId 
     * @param {String} placeId 
     * @param {Number} score 
     * 
     * @throws {NotFoundError} when user with input email does not exist
     * 
     * @returns {Promise} resolves on correct data, rejects on incorrect data 
     */
    updateScoring(userId, placeId, score) {
        validate([
            { key: 'userId', value: userId, type: String },
            { key: 'placeId', value: placeId, type: String },
            { key: 'score', value: score, type: Number },
        ])

        return (async () => {
            let user = await User.findById(userId)

            if (!user) throw new NotFoundError(`user does not exist`)

            let place = await Place.findById(placeId)

            if (!place) throw new NotFoundError(`place does not exist`)

            const index = place.voters.findIndex(voter => voter.userId.toString() === userId)

            if (index < 0) {
                const voter = new Voter({ userId, score })

                place.voters.push(voter)
            } else {

                place.voters.splice(index, 1)

                const voter = new Voter({ userId, score })

                place.voters.push(voter)
            }

            await place.save()

            let userScore = score

            let scoring = this._returnPlaceScoring(place.voters)

            let scores

            if (place.voters.length === 1) {
                scores = [scoring]

            } else {
                scores = place.voters.map(voter => voter.score)
            }

            let visitors = place.voters.length

            return { scoring, visitors, scores, userScore }
        })()
    },

    /**
     * @param {String} userId 
     * @param {String} placeId 
     * @param {Stream} file 
     * 
     * @throws {NotFoundError} when user with input email does not exist
     * 
     * @returns {Promise} resolves on correct data, rejects on incorrect data 
     */
    addPlacePicture(userId, placeId, file) {
        validate([
            { key: 'userId', value: userId, type: String },
            { key: 'placeId', value: placeId, type: String },

        ])
        return (async () => {
            let user = await User.findById(userId)

            if (!user) throw new NotFoundError(`user does not exist`)

            let place = await Place.findById(placeId)

            if (!place) throw new NotFoundError(`place does not exist`)

            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((result, error) => {
                    if (error) return reject(error)

                    resolve(result)
                })

                file.pipe(stream)
            })

            let picture = new Picture({ url: result.url, public_id: result.public_id, userId, placeId })

            await picture.save()

            return picture.url
        })()
    },

    /**
     * @param {String} placeId 
     * * @throws {NotFoundError} when user with input email does not exist
     * 
     * @returns {Promise} resolves on correct data, rejects on incorrect data 
     */
    listPlacePictures(placeId) {
        validate([
            { key: 'placeId', value: placeId, type: String },
        ])

        return (async () => {
            let place = await Place.findById(placeId)

            if (!place) throw new NotFoundError(`place does not exist`)

            const pictures = await Picture.find({ placeId })

            const pictureUrls = pictures.map(picture => picture.url)

            return pictureUrls
        })()
    },

    /**
     * @param {String} userId 
     * 
     * * @throws {NotFoundError} when user with input email does not exist
     * 
     * @returns {Promise} resolves on correct data, rejects on incorrect data 
     */
    listUserPictures(userId) {
        validate([
            { key: 'userId', value: userId, type: String },
        ])

        return (async () => {
            let user = await User.findById(userId)

            if (!user) throw new NotFoundError(`user does not exist`)

            const pictures = await Picture.find({ userId })

            const pictureUrls = pictures.map(picture => picture.url)

            return pictureUrls
        })()
    },

    /**
     * @param {String} userId 
     * @param {String} placeId 
     * @param {String} text 
     * 
     * * @throws {NotFoundError} when user with input email does not exist
     * 
     * @returns {Promise} resolves on correct data, rejects on incorrect data 
     */
    addTip(userId, placeId, text) {
        validate([
            { key: 'userId', value: userId, type: String },
            { key: 'placeId', value: placeId, type: String },
            { key: 'text', value: text, type: String },

        ])
        return (async () => {
            const user = await User.findById(userId)

            if (!user) throw new NotFoundError(`user does not exist`)

            const place = await Place.findById(placeId)

            if (!place) throw new NotFoundError(`place does not exist`)

            const time = moment().format('D MMMM YYYY')

            const tip = new Tip({ userId, placeId, text, time })

            await tip.save()

            return { userPicture: user.profilePicture, userName: user.name, userSurname: user.surname, text: tip.text, time: tip.time }
        })()
    },

    /**
     * @param {String} placeId 
     * 
     * * @throws {NotFoundError} when user with input email does not exist
     * 
     * @returns {Promise} resolves on correct data, rejects on incorrect data 
     */
    listPlaceTips(placeId) {
        validate([
            { key: 'placeId', value: placeId, type: String },
        ])

        return (async () => {
            let place = await Place.findById(placeId)

            if (!place) throw new NotFoundError(`place does not exist`)

            let tips = await Tip.find({ placeId })

            const listTips = await Promise.all(
                tips.map(async tip => {

                    const user = await User.findById(tip.userId)

                    tip.userPicture = user.profilePicture

                    tip.userName = user.name

                    tip.userSurname = user.surname

                    tip.id = tip._id.toString()

                    delete tip._id

                    return tip
                })
            )
            return listTips.map(({ id, text, userPicture, userName, userSurname, time }) => ({ id, text, userPicture, userName, userSurname, time }))
        })()
    },
    /**
     * @param {String} userId 
     * 
     * * @throws {NotFoundError} when user with input email does not exist
     * 
     * @returns {Promise} resolves on correct data, rejects on incorrect data 
     */
    listUserTips(userId) {
        validate([
            { key: 'userId', value: userId, type: String },
        ])

        return (async () => {
            let user = await User.findById(userId)

            if (!user) throw new NotFoundError(`user does not exist`)

            let tips = await Tip.find({ userId })

            let promises = tips.map(async tip => {
                let place = await Place.findById(tip.placeId)

                tip.placeName = place.name

                tip.scoring = place.scoring

                const pictures = await Picture.find({ placeId: tip.placeId })

                tip.picture = this._returnPlacePicture(pictures)

                tip.scoring = this._returnPlaceScoring(place.voters) 

                tip.id = tip._id.toString()

                delete tip._id

                return tip
            })

            let listTips = await Promise.all(promises)

            return listTips.map(({ id, text, placeId, picture, placeName, scoring, time }) => ({ id, text, placeId, picture, placeName, scoring, time }))
        })()
    },

    /**
     * @param {String} userId 
     * @param {String} placeId 
     * 
     * * @throws {NotFoundError} when user with input email does not exist
     * 
     * @returns {Promise} resolves on correct data, rejects on incorrect data 
     */
    uploadFavourites(userId, placeId) {
        validate([
            { key: 'userId', value: userId, type: String },
            { key: 'placeId', value: placeId, type: String },
        ])

        return (async () => {
            let user = await User.findById(userId)

            if (!user) throw new NotFoundError(`user does not exist`)

            let place = await Place.findById(placeId)

            if (!place) throw new NotFoundError(`place does not exist`)

            const index = user.favourites.findIndex(fav => fav.toString() === placeId)

            if (index >= 0) {
                user.favourites.splice(index, 1)
            } else {
                user.favourites.push(placeId)
            }

            await user.save()
        })()
    },

    /**
     * @param {String} userId 
     * 
     * * @throws {NotFoundError} when user with input email does not exist
     * 
     * @returns {Promise} resolves on correct data, rejects on incorrect data 
     */
    listFavourites(userId) {
        validate([
            { key: 'userId', value: userId, type: String },
        ])

        return (async () => {
            let user = await User.findById(userId).populate('favourites').lean().exec()

            if (!user) throw new NotFoundError(`user does not exist`)

            const promises = user.favourites.map(async fav => {
                const pictures = await Picture.find({ placeId: fav._id })

                fav.picture = this._returnPlacePicture(pictures)

                fav.placeId = fav._id.toString()

                delete fav._id

                fav.scoring = this._returnPlaceScoring(fav.voters)

                return fav
            })
            let listFavourites = await Promise.all(promises)

            return listFavourites.map(({ placeId, name, scoring, address, picture }) => ({ placeId, name, scoring, address, picture }))
        })()
    },

    /**
     * @param {String} userId 
     * @param {String} placeId 
     * 
     * * @throws {NotFoundError} when user with input email does not exist
     * 
     * @returns {Promise} resolves on correct data, rejects on incorrect data 
     */
    uploadCheckIns(userId, placeId) {
        validate([
            { key: 'userId', value: userId, type: String },
            { key: 'placeId', value: placeId, type: String },
        ])

        return (async () => {
            let user = await User.findById(userId)

            if (!user) throw new NotFoundError(`user does not exist`)

            let place = await Place.findById(placeId)

            if (!place) throw new NotFoundError(`place does not exist`)

            const index = user.checkIns.findIndex(check => check.toString() === placeId)

            if (index >= 0) {
                user.checkIns.splice(index, 1)
            } else {
                user.checkIns.push(placeId)
            }

            await user.save()
        })()
    },

    /**
     * @param {String} userId 
     * 
     * @throws {NotFoundError} when user with input email does not exist
     * 
     * @returns {Promise} resolves on correct data, rejects on incorrect data 
     */
    listCheckIns(userId) {
        validate([
            { key: 'userId', value: userId, type: String },
        ])

        return (async () => {
            let user = await User.findById(userId).populate('checkIns').lean().exec()

            if (!user) throw new NotFoundError(`user does not exist`)

            let promises = user.checkIns.map(async check => {
                let pictures = await Picture.find({ placeId: check._id })

                check.picture = this._returnPlacePicture(pictures)

                check.scoring = this._returnPlaceScoring(check.voters)

                check.placeId = check._id.toString()

                delete check._id

                return check
            })

            let listCheckIns = await Promise.all(promises)

            return listCheckIns.map(({ placeId, name, scoring, address, picture }) => ({ placeId, name, scoring, address, picture }))
        })()
    },
}

module.exports = logic