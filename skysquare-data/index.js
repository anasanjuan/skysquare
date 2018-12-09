const mongoose = require('mongoose')

const { User, Voter, Place, Picture, Tip } = require('./schemas')

Place.index({ location: "2dsphere" })

module.exports = {
    mongoose,
    models: {
        User: mongoose.model('User', User),
        Voter: mongoose.model('Voter', Voter),
        Place: mongoose.model('Place', Place),
        Picture: mongoose.model('Picture', Picture),
        Tip: mongoose.model('Tip', Tip)
    }
}