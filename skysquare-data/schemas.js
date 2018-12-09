const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')

const User = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    birthday: {
        type: String,
        required: true
    },
    gender: {
        type: String
    },
    phone: {
        type: String
    },
    followers: [{
        type: ObjectId,
        ref: 'User'
    }],
    following: [{
        type: ObjectId,
        ref: 'User'
    }],
    favourites: [{
        type: ObjectId,
        ref: 'Place'
    }],
    checkIns: [{
        type: ObjectId,
        ref: 'Place'
    }],
    profilePicture: {
        type: 'String',
        required: true,
        default: 'https://res.cloudinary.com/dancing890/image/upload/v1542808705/i4lb8xdnpblbbhuvi7zv.png'
    },
    profilePublicId: {
        type: 'String',
    }

})

const Voter = new Schema({
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    score: {
        type: Number,
        required: true
    }
})

const Place = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: { type: String },
        coordinates: []
    },
    address: {
        type: String,
    },
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    voters: [Voter]
    ,
    breakfast: {
        type: Boolean,
    },
    lunch: {
        type: Boolean,
    },
    dinner: {
        type: Boolean,
    },
    coffee: {
        type: Boolean,
    },
    nigthLife: {
        type: Boolean,
    },
    thingsToDo: {
        type: Boolean,
    }
})

const Picture = new Schema({
    url: {
        type: String,
        required: true
    },
    public_id: {
        type: String,
        required: true
    },
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    placeId: {
        type: ObjectId,
        red: 'Place',
        required: true
    }
})

const Tip = new Schema({
    text: {
        type: String,
        required: true
    },
    userId: {
        type: ObjectId,
        ref: 'User'
    },
    placeId: {
        type: ObjectId,
        red: 'Place'
    },
    time: {
        type: String
    }
})

module.exports = {
    User,
    Voter,
    Place,
    Picture,
    Tip
}