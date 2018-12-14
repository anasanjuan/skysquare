'use strict'
require('dotenv').config()

const { mongoose, models: { User, Voter, Place, Picture, Tip } } = require('skysquare-data')
const logic = require('.')
const { AlreadyExistsError, AuthError, ValueError, NotFoundError } = require('../errors')
const fs = require('fs')

const { expect } = require('chai')

const MONGO_URL = 'mongodb://localhost:27017/skysquare-test'

const moment = require('moment')

let cloudinary = require('cloudinary')

const { MY_CLOUD_NAME, MY_API_KEY, MY_APY_SECRET } = process.env


cloudinary.config({
    cloud_name: MY_CLOUD_NAME,
    api_key: MY_API_KEY,
    api_secret: MY_APY_SECRET
})

describe('logic', () => {
    before(() => mongoose.connect(MONGO_URL, { useNewUrlParser: true, useCreateIndex: true }))

    beforeEach(() => Promise.all([User.deleteMany(), Place.deleteMany(), Picture.deleteMany(), Tip.deleteMany()]))

    !false && describe('users', () => {
        describe('register User', () => {
            let name, surname, email, password, birthday, gender, phone
            beforeEach(() => {
                name = 'John'
                surname = 'Doe'
                email = `jd-${Math.random()}@example.com`
                password = `jd-${Math.random()}`
                birthday = '20/02/2002'
                gender = 'Male'
                phone = `jdPhone-${Math.random()}`

            })

            it('should succed on correct data', async () => {
                const res = await logic.registerUser(name, surname, email, password, birthday, gender, phone)

                expect(res).to.be.undefined

                let users = await User.find()

                expect(users.length).to.equal(1)

                let [user] = users

                expect(user.id).to.be.a('string')
                expect(user.name).to.equal(name)
                expect(user.surname).to.equal(surname)
                expect(user.email).to.equal(email)
                expect(user.password).to.equal(password)
                expect(user.birthday).to.equal(birthday)
                expect(user.gender).to.equal(gender)
                expect(user.phone).to.equal(phone)

            })

            it('should fail on already exist user', async () => {
                const user = new User({ name, surname, email, password, birthday, gender, phone })

                await user.save()

                const _name = 'Ada'
                const _surname = 'Lovelace'
                const _password = `ad-${Math.random()}`
                const _birthday = '10/12/1815'
                const _gender = 'Female'
                const _phone = `adPhone-${Math.random()}`

                try {
                    await logic.registerUser(_name, _surname, email, _password, _birthday, _gender, _phone)
                    expect(true).to.be.false
                } catch (error) {
                    expect(error).to.be.instanceof(AlreadyExistsError)
                    expect(error.message).to.equal(`${email} already exist`)
                }
            })

            it('should fail on undefined name', () => {
                expect(() => { logic.registerUser(undefined, surname, email, password, birthday, gender, phone) }).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on undefined surname', () => {
                expect(() => { logic.registerUser(name, undefined, email, password, birthday, gender, phone) }).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on undefined email', () => {
                expect(() => { logic.registerUser(name, surname, undefined, password, birthday, gender, phone) }).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on undefined password', () => {
                expect(() => { logic.registerUser(name, surname, email, undefined, birthday, gender, phone) }).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on undefined birthday', () => {
                expect(() => { logic.registerUser(name, surname, email, password, undefined, gender, phone) }).to.throw(TypeError, 'undefined is not a string')
            })

            it('should succed on undefined gender', async () => {

                const res = await logic.registerUser(name, surname, email, password, birthday, undefined, phone)

                expect(res).to.be.undefined

                let users = await User.find()

                expect(users.length).to.equal(1)

                let [user] = users

                expect(user.id).to.be.a('string')
                expect(user.name).to.equal(name)
                expect(user.surname).to.equal(surname)
                expect(user.email).to.equal(email)
                expect(user.password).to.equal(password)
                expect(user.birthday).to.equal(birthday)
                expect(user.gender).to.equal(undefined)
                expect(user.phone).to.equal(phone)

            })

            it('should succed on undefined gender', async () => {

                const res = await logic.registerUser(name, surname, email, password, birthday, gender, undefined)

                expect(res).to.be.undefined

                let users = await User.find()

                expect(users.length).to.equal(1)

                let [user] = users

                expect(user.id).to.be.a('string')
                expect(user.name).to.equal(name)
                expect(user.surname).to.equal(surname)
                expect(user.email).to.equal(email)
                expect(user.password).to.equal(password)
                expect(user.birthday).to.equal(birthday)
                expect(user.gender).to.equal(gender)
                expect(user.phone).to.equal(undefined)

            })

            it('should succed on null gender', async () => {
                const res = await logic.registerUser(name, surname, email, password, birthday, null, phone)

                expect(res).to.be.undefined

                let users = await User.find()

                expect(users.length).to.equal(1)

                let [user] = users

                expect(user.id).to.be.a('string')
                expect(user.name).to.equal(name)
                expect(user.surname).to.equal(surname)
                expect(user.email).to.equal(email)
                expect(user.password).to.equal(password)
                expect(user.birthday).to.equal(birthday)
                expect(user.gender).to.equal(undefined)
                expect(user.phone).to.equal(phone)
            })

            it('should succed on null phone', async () => {
                const res = await logic.registerUser(name, surname, email, password, birthday, gender, null)

                expect(res).to.be.undefined

                let users = await User.find()

                expect(users.length).to.equal(1)

                let [user] = users

                expect(user.id).to.be.a('string')
                expect(user.name).to.equal(name)
                expect(user.surname).to.equal(surname)
                expect(user.email).to.equal(email)
                expect(user.password).to.equal(password)
                expect(user.birthday).to.equal(birthday)
                expect(user.gender).to.equal(gender)
                expect(user.phone).to.equal(undefined)
            })

            it('should fail on empty name', () => {
                expect(() => { logic.registerUser('', surname, email, password, birthday, gender, phone) }).to.throw(ValueError, `name is empty or blank`)
            })

            it('should fail on empty surname', () => {
                expect(() => { logic.registerUser(name, '', email, password, birthday, gender, phone) }).to.throw(ValueError, `surname is empty or blank`)
            })

            it('should fail on empty email', () => {
                expect(() => { logic.registerUser(name, surname, '', password, birthday, gender, phone) }).to.throw(ValueError, `email is empty or blank`)
            })

            it('should fail on empty password', () => {
                expect(() => { logic.registerUser(name, surname, email, '', birthday, gender, phone) }).to.throw(ValueError, `password is empty or blank`)
            })

            it('should fail on empty birthday', () => {
                expect(() => { logic.registerUser(name, surname, email, password, '', gender, phone) }).to.throw(ValueError, `birthday is empty or blank`)
            })

            it('should fail on blank name', () => {
                expect(() => { logic.registerUser('     ', surname, email, password, birthday, gender, phone) }).to.throw(ValueError, `name is empty or blank`)
            })

            it('should fail on blank surname', () => {
                expect(() => { logic.registerUser(name, '       ', email, password, birthday, gender, phone) }).to.throw(ValueError, `surname is empty or blank`)
            })

            it('should fail on blank email', () => {
                expect(() => { logic.registerUser(name, surname, '      ', password, birthday, gender, phone) }).to.throw(ValueError, `email is empty or blank`)
            })

            it('should fail on blank password', () => {
                expect(() => { logic.registerUser(name, surname, email, '       ', birthday, gender, phone) }).to.throw(ValueError, `password is empty or blank`)
            })

            it('should fail on blank birthday', () => {
                expect(() => { logic.registerUser(name, surname, email, password, '     ', gender, phone) }).to.throw(ValueError, `birthday is empty or blank`)
            })

            it('should fail on non-string name(object)', () => {
                expect(() => { logic.registerUser({ name }, surname, email, password, birthday, gender, phone) }).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string surname(object)', () => {
                expect(() => { logic.registerUser(name, { surname }, email, password, birthday, gender, phone) }).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string email(object)', () => {
                expect(() => { logic.registerUser(name, surname, { email }, password, birthday, gender, phone) }).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string password(object)', () => {
                expect(() => { logic.registerUser(name, surname, email, { password }, birthday, gender, phone) }).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string birthday(object)', () => {
                expect(() => { logic.registerUser(name, surname, email, password, { birthday }, gender, phone) }).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string gender(object)', () => {
                expect(() => { logic.registerUser(name, surname, email, password, birthday, { gender }, phone) }).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string phone(object)', () => {
                expect(() => { logic.registerUser(name, surname, email, password, birthday, gender, { phone }) }).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string name(boolean)', () => {
                expect(() => { logic.registerUser(true, surname, email, password, birthday, gender, phone) }).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on non-string surname(boolean)', () => {
                expect(() => { logic.registerUser(name, true, email, password, birthday, gender, phone) }).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on non-string email(boolean)', () => {
                expect(() => { logic.registerUser(name, surname, true, password, birthday, gender, phone) }).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on non-string password(boolean)', () => {
                expect(() => { logic.registerUser(name, surname, email, true, birthday, gender, phone) }).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on non-string birthday(boolean)', () => {
                expect(() => { logic.registerUser(name, surname, email, password, true, gender, phone) }).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on non-string gender(boolean)', () => {
                expect(() => { logic.registerUser(name, surname, email, password, birthday, true, phone) }).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on non-string phone(boolean)', () => {
                expect(() => { logic.registerUser(name, surname, email, password, birthday, gender, true) }).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on non-string name(array)', () => {
                expect(() => { logic.registerUser([], surname, email, password, birthday, gender, phone) }).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string surname(array)', () => {
                expect(() => { logic.registerUser(name, [], email, password, birthday, gender, phone) }).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string email(array)', () => {
                expect(() => { logic.registerUser(name, surname, [], password, birthday, gender, phone) }).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string password(array)', () => {
                expect(() => { logic.registerUser(name, surname, email, [], birthday, gender, phone) }).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string birthday(array)', () => {
                expect(() => { logic.registerUser(name, surname, email, password, [], gender, phone) }).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string gender(array)', () => {
                expect(() => { logic.registerUser(name, surname, email, password, birthday, [], phone) }).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string phone(array)', () => {
                expect(() => { logic.registerUser(name, surname, email, password, birthday, gender, []) }).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string name(number)', () => {
                let number = Math.random()

                expect(() => { logic.registerUser(number, surname, email, password, birthday, gender, phone) }).to.throw(TypeError, `${number} is not a string`)
            })

            it('should fail on non-string surname(number)', () => {
                let number = Math.random()

                expect(() => { logic.registerUser(name, number, email, password, birthday, gender, phone) }).to.throw(TypeError, `${number} is not a string`)
            })

            it('should fail on non-string email(number)', () => {
                let number = Math.random()

                expect(() => { logic.registerUser(name, surname, number, password, birthday, gender, phone) }).to.throw(TypeError, `${number} is not a string`)
            })

            it('should fail on non-string password(number)', () => {
                let number = Math.random()

                expect(() => { logic.registerUser(name, surname, email, number, birthday, gender, phone) }).to.throw(TypeError, `${number} is not a string`)
            })

            it('should fail on non-string birthday(number)', () => {
                let number = Math.random()

                expect(() => { logic.registerUser(name, surname, email, password, number, gender, phone) }).to.throw(TypeError, `${number} is not a string`)
            })

            it('should fail on non-string gender(number)', () => {
                let number = Math.random()

                expect(() => { logic.registerUser(name, surname, email, password, birthday, number, phone) }).to.throw(TypeError, `${number} is not a string`)
            })

            it('should fail on non-string phone(number)', () => {
                let number = Math.random()

                expect(() => { logic.registerUser(name, surname, email, password, birthday, gender, number) }).to.throw(TypeError, `${number} is not a string`)
            })
        })

        describe('log In', () => {
            let user
            beforeEach(async () => {
                const name = 'John'
                const surname = 'Doe'
                const email = `jd-${Math.random()}@example.com`
                const password = `jd-${Math.random()}`
                const birthday = '20/02/2002'
                const gender = 'Male'
                const phone = `jdPhone-${Math.random()}`

                user = await new User({ name, surname, email, password, birthday, gender, phone }).save()
            })

            it('should succed on correct data', async () => {
                const { email, password } = user

                const id = await logic.authenticateUser(email, password)

                expect(id).to.be.a('string')
                expect(id).to.be.equal(user.id)
            })

            it('should fail on non existing user', async () => {
                const email = `al-${Math.random()}@example.com`
                const { password } = user

                try {
                    const id = await logic.authenticateUser(email, password)
                    expect(true).to.be.false
                } catch (error) {
                    expect(error).to.be.instanceof(NotFoundError)

                    expect(error.message).to.equal(`user not found`)
                }
            })

            it('should fail on incorrect password ', async () => {
                const { email } = user
                let wrongPassword = `al-${Math.random()}`

                try {
                    const id = await logic.authenticateUser(email, wrongPassword)
                    expect(true).to.be.false
                } catch (error) {
                    expect(error).to.be.instanceof(AuthError)

                    expect(error.message).to.equal(`incorrect user or password`)
                }
            })

            it('should fail on undefined email', () => {
                expect(() => logic.authenticateUser(undefined, user.password)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on undefined password', () => {
                expect(() => { logic.authenticateUser(user.email, undefined) }).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty email', () => {
                expect(() => { logic.authenticateUser('', user.password) }).to.throw(ValueError, `email is empty or blank`)
            })

            it('should fail on empty password', () => {
                expect(() => { logic.authenticateUser(user.email, '') }).to.throw(ValueError, `password is empty or blank`)
            })

            it('should fail on blank email', () => {
                expect(() => { logic.authenticateUser('', user.password) }).to.throw(ValueError, `email is empty or blank`)
            })

            it('should fail on blank password', () => {
                expect(() => { logic.authenticateUser(user.email, '') }).to.throw(ValueError, `password is empty or blank`)
            })

            it('should fail on non-string email(object)', () => {
                expect(() => { logic.authenticateUser({}, user.password) }).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string password(object)', () => {
                expect(() => { logic.authenticateUser(user.email, {}) }).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string email(boolean)', () => {
                expect(() => { logic.authenticateUser(false, user.password) }).to.throw(TypeError, 'false is not a string')
            })

            it('should fail on non-string password(boolean)', () => {
                expect(() => { logic.authenticateUser(user.email, false) }).to.throw(TypeError, 'false is not a string')
            })

            it('should fail on non-string email(array)', () => {
                expect(() => { logic.authenticateUser([], user.password) }).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string password(array)', () => {
                expect(() => { logic.authenticateUser(user.email, []) }).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string email(number)', () => {
                const email = Math.random()

                expect(() => logic.authenticateUser(email, user.password)).to.throw(TypeError, `${email} is not a string`)
            })

            it('should fail on non-string password(number)', () => {
                const password = Math.random()

                expect(() => logic.authenticateUser(user.email, password)).to.throw(TypeError, `${password} is not a string`)
            })
        })

        describe('retrieve User', () => {
            let user
            beforeEach(async () => {
                const name = 'John'
                const surname = 'Doe'
                const email = `jd-${Math.random()}@example.com`
                const password = `jd-${Math.random()}`
                const birthday = '20/02/2002'
                const gender = 'Male'
                const phone = `jdPhone-${Math.random()}`

                user = await new User({ name, surname, email, password, birthday, gender, phone }).save()
            })

            it('should succed on correct data', async () => {
                const _user = await logic.retrieveUser(user.id)

                expect(_user).not.to.be.instanceOf(User)

                expect(_user.id).to.be.a('string')
                expect(_user.name).to.equal(user.name)
                expect(_user.surname).to.equal(user.surname)
                expect(_user.email).to.equal(user.email)
                expect(_user.birthday).to.equal(user.birthday)
                expect(_user.password).to.be.undefined
                expect(_user.profilePicture).to.equal('https://res.cloudinary.com/dancing890/image/upload/v1542808705/i4lb8xdnpblbbhuvi7zv.png')
            })

            it('should fail on non existing user', async () => {
                const id = user.id

                await User.deleteMany()

                try {
                    const __user = await logic.retrieveUser(id)

                    expect(true).to.be.false
                } catch (error) {
                    expect(error).to.be.instanceof(NotFoundError)

                    expect(error.message).to.equal(`user not found`)
                }
            })

            it('should fail on undefined id', async () => {
                expect(() => logic.retrieveUser(undefined)).to.throw(TypeError, `undefined is not a string`)
            })

            it('should fail on empty id', async () => {
                expect(() => logic.retrieveUser('')).to.throw(ValueError, `id is empty or blank`)
            })

            it('should fail on blank id', async () => {
                expect(() => logic.retrieveUser('        ')).to.throw(ValueError, `id is empty or blank`)
            })

            it('should fail on non-string id(object)', () => {
                expect(() => logic.retrieveUser({})).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string id(boolean)', () => {
                expect(() => logic.retrieveUser(true)).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on non-string id(array)', () => {
                expect(() => logic.retrieveUser([])).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string id(number)', () => {
                let id = Math.random()
                expect(() => logic.retrieveUser(id)).to.throw(TypeError, `${id} is not a string`)
            })
        })

        describe('add profile pictures ', () => {
            let user, file
            beforeEach(async () => {
                const name = 'John'
                const surname = 'Doe'
                const email = `jd-${Math.random()}@example.com`
                const password = `jd-${Math.random()}`
                const birthday = '20/02/2002'
                const gender = 'Male'
                const phone = `jdPhone-${Math.random()}`

                user = await new User({ name, surname, email, password, birthday, gender, phone }).save()

                const image = './data/test-images/default-profile-pic.png'

                file = fs.createReadStream(image)
            })

            it('should succed on correct data', async () => {

                const picture = await logic.addProfilePicture(user.id, file)

                expect(picture).to.be.a('string')

                expect(picture).not.to.equal('https://res.cloudinary.com/dancing890/image/upload/v1542808705/i4lb8xdnpblbbhuvi7zv.png')

                let _users = await User.find()

                expect(_users.length).to.equal(1)

                let [_user] = _users

                expect(_user.id).to.be.a('string')
                expect(_user.name).to.equal(user.name)
                expect(_user.surname).to.equal(user.surname)
                expect(_user.email).to.equal(user.email)
                expect(_user.password).to.equal(user.password)
                expect(_user.birthday).to.equal(user.birthday)
                expect(_user.gender).to.equal(user.gender)
                expect(_user.phone).to.equal(user.phone)
                expect(_user.profilePicture).to.be.a('string')
                expect(_user.profilePicture).not.to.equal('https://res.cloudinary.com/dancing890/image/upload/v1542808705/i4lb8xdnpblbbhuvi7zv.png')

                cloudinary.uploader.destroy(_user.profilePublicId, (result) => { });
            })

            it('should fail on non existing user', async () => {
                const id = user.id

                await User.deleteMany()

                try {
                    const picture = await logic.addProfilePicture(id, file)

                    expect(true).to.be.false
                } catch (error) {
                    expect(error).to.be.instanceof(NotFoundError)

                    expect(error.message).to.equal('user does not exist')
                }
            })

            it('should fail on undefined id', async () => {
                expect(() => logic.addProfilePicture(undefined, file)).to.throw(TypeError, `undefined is not a string`)
            })

            it('should fail on empty id', async () => {
                expect(() => logic.addProfilePicture('', file)).to.throw(ValueError, `id is empty or blank`)
            })

            it('should fail on blank id', async () => {
                expect(() => logic.addProfilePicture('        ', file)).to.throw(ValueError, `id is empty or blank`)
            })

            it('should fail on non-string id(object)', () => {
                expect(() => logic.addProfilePicture({}, file)).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string id(boolean)', () => {
                expect(() => logic.addProfilePicture(true, file)).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on non-string id(array)', () => {
                expect(() => logic.addProfilePicture([], file)).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string id(number)', () => {
                let id = Math.random()
                expect(() => logic.addProfilePicture(id, file)).to.throw(TypeError, `${id} is not a string`)
            })
        })

        describe('upload favourites', () => {
            let place, user
            beforeEach(async () => {
                let name = 'John'
                let surname = 'Doe'
                let email = `jd-${Math.random()}@example.com`
                let password = `jd-${Math.random()}`
                let birthday = '20/02/2002'
                let gender = 'Male'
                let phone = `jdPhone-${Math.random()}`

                user = new User({ name, surname, email, password, birthday, gender, phone })

                let placeName = 'Costa Dorada'
                let latitude = 41.398469
                let longitude = 2.199943
                let userId = user.id
                let address = 'address st'
                let breakfast = true
                let lunch = false
                let dinner = true
                let coffee = false
                let nightLife = true
                let thingsToDo = false

                const location = {
                    type: "Point",
                    coordinates: [longitude, latitude]
                }

                place = new Place({ name: placeName, location, userId, address, breakfast, lunch, dinner, coffee, nightLife, thingsToDo })

                await user.save()
                await place.save()
            })

            it('it should succedd on correct data', async () => {
                const res = await logic.uploadFavourites(user.id, place.id)

                expect(res).to.be.undefined

                const _user = await User.findById(user.id)

                expect(_user.favourites.length).to.equal(1)
                expect(_user.favourites[0]._id.toString()).to.equal(place.id)
            })

            it('should fail on non existing user', async () => {
                const id = user.id

                await User.deleteMany()

                try {
                    const res = await logic.uploadFavourites(id, place.id)

                    expect(true).to.be.false

                } catch (error) {
                    expect(error).to.be.instanceof(NotFoundError)

                    expect(error.message).to.equal(`user does not exist`)
                }
            })

            it('should fail on non existing place', async () => {
                const id = place.id

                await Place.deleteMany()

                try {
                    const res = await logic.uploadFavourites(user.id, id)

                    expect(true).to.be.false

                } catch (error) {
                    expect(error).to.be.instanceof(NotFoundError)

                    expect(error.message).to.equal(`place does not exist`)
                }
            })

            it('should fail on undefined user id', async () => {
                expect(() => logic.uploadFavourites(undefined, place.id)).to.throw(TypeError, `undefined is not a string`)
            })

            it('should fail on undefined place id', async () => {
                expect(() => logic.uploadFavourites(user.id, undefined)).to.throw(TypeError, `undefined is not a string`)
            })

            it('should fail on empty user id', async () => {
                expect(() => logic.uploadFavourites('', place.id)).to.throw(ValueError, `userId is empty or blank`)
            })

            it('should fail on empty place id', async () => {
                expect(() => logic.uploadFavourites(user.id, '')).to.throw(ValueError, `placeId is empty or blank`)
            })

            it('should fail on blank user id', async () => {
                expect(() => logic.uploadFavourites('   ', place.id)).to.throw(ValueError, `userId is empty or blank`)
            })

            it('should fail on blank place id', async () => {
                expect(() => logic.uploadFavourites(user.id, '   ')).to.throw(ValueError, `placeId is empty or blank`)
            })

            it('should fail on non-string user id(object)', () => {
                expect(() => logic.uploadFavourites({}, place.id)).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string place id(object)', () => {
                expect(() => logic.uploadFavourites(user.id, {})).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string user id(boolean)', () => {
                expect(() => logic.uploadFavourites(true, place.id)).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on non-string place id(boolean)', () => {
                expect(() => logic.uploadFavourites(user.id, false)).to.throw(TypeError, 'false is not a string')
            })

            it('should fail on non-string user id(array)', () => {
                expect(() => logic.uploadFavourites([], place.id)).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string place id(array)', () => {
                expect(() => logic.uploadFavourites(user.id, [])).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string user id(number)', () => {
                let id = Math.random()

                expect(() => logic.uploadFavourites(id, place.id)).to.throw(TypeError, `${id} is not a string`)
            })

            it('should fail on non-string place id(number)', () => {
                let id = Math.random()

                expect(() => logic.uploadFavourites(user.id, id)).to.throw(TypeError, `${id} is not a string`)
            })

        })

        describe('list favourites', () => {
            let place, user, voter

            beforeEach(async () => {
                let name = 'John'
                let surname = 'Doe'
                let email = `jd-${Math.random()}@example.com`
                let password = `jd-${Math.random()}`
                let birthday = '20/02/2002'
                let gender = 'Male'
                let phone = `jdPhone-${Math.random()}`

                user = new User({ name, surname, email, password, birthday, gender, phone })

                voter = new Voter({ userId: user.id, score: 10 })

                const voters = [voter]

                let placeName = 'Costa Dorada'
                let latitude = 41.398469
                let longitude = 2.199943
                let userId = user.id
                let address = 'address st'
                let breakfast = true
                let lunch = false
                let dinner = true
                let coffee = false
                let nightLife = true
                let thingsToDo = false

                const location = {
                    type: "Point",
                    coordinates: [longitude, latitude]
                }

                place = new Place({ name: placeName, location, userId, voters, address, breakfast, lunch, dinner, coffee, nightLife, thingsToDo })

                await user.save()
                await place.save()
            })

            it('it should succedd on correct data', async () => {

                user.favourites.push(place.id)

                await user.save()

                const favourites = await logic.listFavourites(user.id)

                expect(favourites.length).to.equal(1)

                const [favourite] = favourites

                expect(favourite.placeId).to.equal(place._id.toString())
                expect(favourite.name).to.equal(place.name)
                expect(favourite.scoring).to.equal(voter.score)
                expect(favourite.address).to.equal(place.address)
                expect(favourite.picture).to.be.a('string')
            })

            it('should fail on non existing user', async () => {
                await User.deleteMany()

                try {
                    const favourites = await logic.listFavourites(user.id)
                    expect(true).to.be.false
                } catch (error) {
                    expect(error).to.be.instanceof(NotFoundError)

                    expect(error.message).to.equal(`user does not exist`)
                }
            })

            it('should fail on undefined id', async () => {
                expect(() => logic.listFavourites(undefined)).to.throw(TypeError, `undefined is not a string`)
            })

            it('should fail on empty id', async () => {
                expect(() => logic.listFavourites('')).to.throw(ValueError, `userId is empty or blank`)
            })

            it('should fail on blank id', async () => {
                expect(() => logic.listFavourites('        ')).to.throw(ValueError, `userId is empty or blank`)
            })

            it('should fail on non-string id(object)', () => {
                expect(() => logic.listFavourites({})).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string id(boolean)', () => {
                expect(() => logic.listFavourites(true)).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on non-string id(array)', () => {
                expect(() => logic.listFavourites([])).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string id(number)', () => {
                let id = Math.random()

                expect(() => logic.listFavourites(id)).to.throw(TypeError, `${id} is not a string`)
            })
        })

        describe('add CheckIns', () => {
            let place, user

            beforeEach(async () => {
                let name = 'John'
                let surname = 'Doe'
                let email = `jd-${Math.random()}@example.com`
                let password = `jd-${Math.random()}`
                let birthday = '20/02/2002'
                let gender = 'Male'
                let phone = `jdPhone-${Math.random()}`

                user = new User({ name, surname, email, password, birthday, gender, phone })

                let placeName = 'Costa Dorada'
                let latitude = 41.398469
                let longitude = 2.199943
                let userId = user.id
                let address = 'address st'
                let breakfast = true
                let lunch = false
                let dinner = true
                let coffee = false
                let nightLife = true
                let thingsToDo = false

                const location = {
                    type: "Point",
                    coordinates: [longitude, latitude]
                }

                place = new Place({ name: placeName, location, userId, address, breakfast, lunch, dinner, coffee, nightLife, thingsToDo })

                await user.save()
                await place.save()
            })

            it('it should succedd on correct data', async () => {
                const res = await logic.uploadCheckIns(user.id, place.id)

                expect(res).to.be.undefined

                const _user = await User.findById(user.id)

                expect(_user.checkIns.length).to.equal(1)
                expect(_user.checkIns[0]._id.toString()).to.equal(place.id)
            })

            it('should fail on non existing user', async () => {
                const id = user.id

                await User.deleteMany()

                try {
                    const res = await logic.uploadCheckIns(id, place.id)

                    expect(true).to.be.false

                } catch (error) {
                    expect(error).to.be.instanceof(NotFoundError)

                    expect(error.message).to.equal(`user does not exist`)
                }
            })

            it('should fail on non existing place', async () => {
                const id = place.id

                await Place.deleteMany()

                try {
                    const res = await logic.uploadCheckIns(user.id, id)

                    expect(true).to.be.false

                } catch (error) {
                    expect(error).to.be.instanceof(NotFoundError)

                    expect(error.message).to.equal(`place does not exist`)
                }
            })

            it('should fail on undefined id', async () => {
                expect(() => logic.uploadCheckIns(undefined, place.id)).to.throw(TypeError, `undefined is not a string`)
            })

            it('should fail on undefined id', async () => {
                expect(() => logic.uploadCheckIns(user.id, undefined)).to.throw(TypeError, `undefined is not a string`)
            })

            it('should fail on empty user id', async () => {
                expect(() => logic.uploadCheckIns('', place.id)).to.throw(ValueError, `userId is empty or blank`)
            })

            it('should fail on empty place id', async () => {
                expect(() => logic.uploadCheckIns(user.id, '')).to.throw(ValueError, `placeId is empty or blank`)
            })

            it('should fail on blank user id', async () => {
                expect(() => logic.uploadCheckIns('   ', place.id)).to.throw(ValueError, `userId is empty or blank`)
            })

            it('should fail on blank place id', async () => {
                expect(() => logic.uploadCheckIns(user.id, '   ')).to.throw(ValueError, `placeId is empty or blank`)
            })

            it('should fail on non-string user id(object)', () => {
                expect(() => logic.uploadCheckIns({}, place.id)).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string place id(object)', () => {
                expect(() => logic.uploadCheckIns(user.id, {})).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string user id(boolean)', () => {
                expect(() => logic.uploadCheckIns(true, place.id)).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on non-string place id(boolean)', () => {
                expect(() => logic.uploadCheckIns(user.id, false)).to.throw(TypeError, 'false is not a string')
            })

            it('should fail on non-string user id(array)', () => {
                expect(() => logic.uploadCheckIns([], place.id)).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string place id(array)', () => {
                expect(() => logic.uploadCheckIns(user.id, [])).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string user id(number)', () => {
                let id = Math.random()

                expect(() => logic.uploadCheckIns(id, place.id)).to.throw(TypeError, `${id} is not a string`)
            })

            it('should fail on non-string place id(number)', () => {
                let id = Math.random()

                expect(() => logic.uploadCheckIns(user.id, id)).to.throw(TypeError, `${id} is not a string`)
            })
        })

        describe('list CheckIns', () => {
            let place, user, voter

            beforeEach(async () => {
                let name = 'John'
                let surname = 'Doe'
                let email = `jd-${Math.random()}@example.com`
                let password = `jd-${Math.random()}`
                let birthday = '20/02/2002'
                let gender = 'Male'
                let phone = `jdPhone-${Math.random()}`

                user = new User({ name, surname, email, password, birthday, gender, phone })

                voter = new Voter({ userId: user.id, score: 10 })

                const voters = [voter]

                let placeName = 'Costa Dorada'
                let latitude = 41.398469
                let longitude = 2.199943
                let userId = user.id
                let address = 'address st'
                let breakfast = true
                let lunch = false
                let dinner = true
                let coffee = false
                let nightLife = true
                let thingsToDo = false

                const location = {
                    type: "Point",
                    coordinates: [longitude, latitude]
                }

                place = new Place({ name: placeName, location, userId, address, voters, breakfast, lunch, dinner, coffee, nightLife, thingsToDo })

                await user.save()
                await place.save()
            })

            it('it should succedd on correct data', async () => {
                user.checkIns.push(place.id)

                await user.save()

                const checkIns = await logic.listCheckIns(user.id)

                expect(checkIns.length).to.equal(1)

                const [checkIn] = checkIns

                expect(checkIn.placeId).to.equal(place._id.toString())
                expect(checkIn.name).to.equal(place.name)
                expect(checkIn.scoring).to.equal(voter.score)
                expect(checkIn.address).to.equal(place.address)
                expect(checkIn.picture).to.be.a('string')
            })

            it('should fail on non existing user', async () => {
                await User.deleteMany()

                try {
                    const favourites = await logic.listCheckIns(user.id)
                    expect(true).to.be.false
                } catch (error) {
                    expect(error).to.be.instanceof(NotFoundError)

                    expect(error.message).to.equal(`user does not exist`)
                }
            })

            it('should fail on undefined id', async () => {
                expect(() => logic.listCheckIns(undefined)).to.throw(TypeError, `undefined is not a string`)
            })

            it('should fail on empty id', async () => {
                expect(() => logic.listCheckIns('')).to.throw(ValueError, `userId is empty or blank`)
            })

            it('should fail on blank id', async () => {
                expect(() => logic.listCheckIns('        ')).to.throw(ValueError, `userId is empty or blank`)
            })

            it('should fail on non-string id(object)', () => {
                expect(() => logic.listCheckIns({})).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string id(boolean)', () => {
                expect(() => logic.listCheckIns(true)).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on non-string id(array)', () => {
                expect(() => logic.listCheckIns([])).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string id(number)', () => {
                let id = Math.random()
                expect(() => logic.listCheckIns(id)).to.throw(TypeError, `${id} is not a string`)
            })
        })
    })

    describe('places', () => {
        let user, placeName, latitude, longitude, location, address, userId, breakfast, lunch, dinner, coffee, nightLife, thingsToDo, number

        beforeEach(async () => {
            let name = 'John'
            let surname = 'Doe'
            let email = `jd-${Math.random()}@example.com`
            let password = `jd-${Math.random()}`
            let birthday = '20/02/2002'
            let gender = 'Male'
            let phone = `jdPhone-${Math.random()}`

            user = await new User({ name, surname, email, password, birthday, gender, phone }).save()

            placeName = 'Costa Dorada'
            latitude = 41.398469
            longitude = 2.199943
            address = "Street st, 43, Barcelona"
            userId = user.id
            breakfast = true
            lunch = false
            dinner = true
            coffee = false
            nightLife = true
            thingsToDo = false

            location = {
                type: "Point",
                coordinates: [longitude, latitude]
            }

            number = Math.random()
        })

        describe('add place', () => {
            it('should succed on correct data', async () => {
                const res = await logic.addPlace(placeName, latitude, longitude, address, userId, breakfast, lunch, dinner, coffee, nightLife, thingsToDo)

                expect(res).to.be.undefined

                const places = await Place.find()

                expect(places.length).to.be.equal(1)


                const [place] = places

                expect(place.id).to.be.a('string')
                expect(place.name).to.equal(placeName)
                expect(place.location.coordinates[0]).to.equal(latitude)
                expect(place.location.coordinates[1]).to.equal(longitude)
                expect(place.userId.toString()).to.equal(user.id)
                expect(place.breakfast).to.equal(breakfast)
                expect(place.lunch).to.equal(lunch)
                expect(place.dinner).to.equal(dinner)
                expect(place.coffee).to.equal(coffee)
                expect(place.nigthLife).to.equal(nightLife)
                expect(place.thingsToDo).to.equal(thingsToDo)
            })

            it('should fail on non existing user', async () => {
                await User.deleteMany()

                try {
                    const res = await logic.addPlace(placeName, latitude, longitude, address, userId, breakfast, lunch, dinner, coffee, nightLife, thingsToDo)

                    expect(true).to.be.false
                } catch (error) {
                    expect(error).to.be.instanceof(NotFoundError)

                    expect(error.message).to.equal('user does not exist')
                }
            })

            it('should fail on undefined place name', () => {
                expect(() => logic.addPlace(undefined, latitude, longitude, address, userId, breakfast, lunch, dinner, coffee, nightLife, thingsToDo)).to.throw(TypeError, `undefined is not a string`)
            })

            it('should fail on undefined latitude', () => {
                expect(() => logic.addPlace(placeName, undefined, longitude, address, userId, breakfast, lunch, dinner, coffee, nightLife, thingsToDo)).to.throw(TypeError, `undefined is not a number`)
            })

            it('should fail on undefined longitude', () => {
                expect(() => logic.addPlace(placeName, latitude, undefined, address, userId, breakfast, lunch, dinner, coffee, nightLife, thingsToDo)).to.throw(TypeError, `undefined is not a number`)
            })

            it('should fail on undefined address', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, undefined, userId, breakfast, lunch, dinner, coffee, nightLife, thingsToDo)).to.throw(TypeError, `undefined is not a string`)
            })

            it('should fail on undefined userId', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, address, undefined, breakfast, lunch, dinner, coffee, nightLife, thingsToDo)).to.throw(TypeError, `undefined is not a string`)
            })

            it('should fail on empty name', () => {
                expect(() => logic.addPlace('', latitude, longitude, address, userId, breakfast, lunch, dinner, coffee, nightLife, thingsToDo)).to.throw(ValueError, `name is empty or blank`)
            })

            it('should fail on empty address', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, '', userId, breakfast, lunch, dinner, coffee, nightLife, thingsToDo)).to.throw(ValueError, `address is empty or blank`)
            })

            it('should fail on empty userId', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, address, '', breakfast, lunch, dinner, coffee, nightLife, thingsToDo)).to.throw(ValueError, `userId is empty or blank`)
            })

            it('should fail on blank name', () => {
                expect(() => logic.addPlace('       ', latitude, longitude, address, userId, breakfast, lunch, dinner, coffee, nightLife, thingsToDo)).to.throw(ValueError, `name is empty or blank`)
            })

            it('should fail on blank address', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, '       ', userId, breakfast, lunch, dinner, coffee, nightLife, thingsToDo)).to.throw(ValueError, `address is empty or blank`)
            })

            it('should fail on blank userId', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, address, '      ', breakfast, lunch, dinner, coffee, nightLife, thingsToDo)).to.throw(ValueError, `userId is empty or blank`)
            })

            it('should fail on non-string place name (object)', () => {
                expect(() => logic.addPlace({}, latitude, longitude, address, userId, breakfast, lunch, dinner, coffee, nightLife, thingsToDo)).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-number latitude (object)', () => {
                expect(() => logic.addPlace(placeName, {}, longitude, address, userId, breakfast, lunch, dinner, coffee, nightLife, thingsToDo)).to.throw(TypeError, '[object Object] is not a number')
            })

            it('should fail on non-number longitude (object)', () => {
                expect(() => logic.addPlace(placeName, latitude, {}, address, userId, breakfast, lunch, dinner, coffee, nightLife, thingsToDo)).to.throw(TypeError, '[object Object] is not a number')
            })

            it('should fail on non-string address (object)', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, {}, userId, breakfast, lunch, dinner, coffee, nightLife, thingsToDo)).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string userId (object)', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, address, {}, breakfast, lunch, dinner, coffee, nightLife, thingsToDo)).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-boolean breakfast (object)', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, address, userId, {}, lunch, dinner, coffee, nightLife, thingsToDo)).to.throw(TypeError, '[object Object] is not a boolean')
            })

            it('should fail on non-boolean lunch (object)', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, address, userId, breakfast, {}, dinner, coffee, nightLife, thingsToDo)).to.throw(TypeError, '[object Object] is not a boolean')
            })

            it('should fail on non-boolean dinner (object)', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, address, userId, breakfast, lunch, {}, coffee, nightLife, thingsToDo)).to.throw(TypeError, '[object Object] is not a boolean')
            })

            it('should fail on non-boolean coffee (object)', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, address, userId, breakfast, lunch, dinner, {}, nightLife, thingsToDo)).to.throw(TypeError, '[object Object] is not a boolean')
            })

            it('should fail on non-boolean nightLife(object)', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, address, userId, breakfast, lunch, dinner, coffee, {}, thingsToDo)).to.throw(TypeError, '[object Object] is not a boolean')
            })

            it('should fail on non-boolean thingsToDo (object)', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, address, userId, breakfast, lunch, dinner, coffee, nightLife, {})).to.throw(TypeError, '[object Object] is not a boolean')
            })

            it('should fail on non-string place name (boolean)', () => {
                expect(() => logic.addPlace(true, latitude, longitude, address, userId, breakfast, lunch, dinner, coffee, nightLife, thingsToDo)).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on non-number latitude (boolean)', () => {
                expect(() => logic.addPlace(placeName, false, longitude, address, userId, breakfast, lunch, dinner, coffee, nightLife, thingsToDo)).to.throw(TypeError, 'false is not a number')
            })

            it('should fail on non-number longitude (boolean)', () => {
                expect(() => logic.addPlace(placeName, latitude, true, address, userId, breakfast, lunch, dinner, coffee, nightLife, thingsToDo)).to.throw(TypeError, 'true is not a number')
            })

            it('should fail on non-string address (boolean)', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, false, userId, breakfast, lunch, dinner, coffee, nightLife, thingsToDo)).to.throw(TypeError, 'false is not a string')
            })

            it('should fail on non-string userId (boolean)', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, address, true, breakfast, lunch, dinner, coffee, nightLife, thingsToDo)).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on non-boolean breakfast (string)', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, address, userId, 'breakfast', lunch, dinner, coffee, nightLife, thingsToDo)).to.throw(TypeError, 'breakfast is not a boolean')
            })

            it('should fail on non-boolean lunch (string)', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, address, userId, breakfast, 'lunch', dinner, coffee, nightLife, thingsToDo)).to.throw(TypeError, 'lunch is not a boolean')
            })

            it('should fail on non-boolean dinner (string)', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, address, userId, breakfast, lunch, 'dinner', coffee, nightLife, thingsToDo)).to.throw(TypeError, 'dinner is not a boolean')
            })

            it('should fail on non-boolean coffee (string)', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, address, userId, breakfast, lunch, dinner, 'coffee', nightLife, thingsToDo)).to.throw(TypeError, 'coffee is not a boolean')
            })

            it('should fail on non-boolean nightLife (string)', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, address, userId, breakfast, lunch, dinner, coffee, 'nightLife', thingsToDo)).to.throw(TypeError, 'nightLife is not a boolean')
            })

            it('should fail on non-boolean thingsToDo (string)', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, address, userId, breakfast, lunch, dinner, coffee, nightLife, 'thingsToDo')).to.throw(TypeError, 'thingsToDo is not a boolean')
            })

            it('should fail on non-string place name (array)', () => {
                expect(() => logic.addPlace([], latitude, longitude, address, userId, breakfast, lunch, dinner, coffee, nightLife, thingsToDo)).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-number latitude (array)', () => {
                expect(() => logic.addPlace(placeName, [], longitude, address, userId, breakfast, lunch, dinner, coffee, nightLife, thingsToDo)).to.throw(TypeError, ' is not a number')
            })

            it('should fail on non-number longitude (array)', () => {
                expect(() => logic.addPlace(placeName, latitude, [], address, userId, breakfast, lunch, dinner, coffee, nightLife, thingsToDo)).to.throw(TypeError, ' is not a number')
            })

            it('should fail on non-string address (array)', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, [], userId, breakfast, lunch, dinner, coffee, nightLife, thingsToDo)).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string userId (array)', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, address, [], breakfast, lunch, dinner, coffee, nightLife, thingsToDo)).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-boolean breakfast (array)', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, address, userId, [], lunch, dinner, coffee, nightLife, thingsToDo)).to.throw(TypeError, ' is not a boolean')
            })

            it('should fail on non-boolean lunch (array)', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, address, userId, breakfast, [], dinner, coffee, nightLife, thingsToDo)).to.throw(TypeError, ' is not a boolean')
            })

            it('should fail on non-boolean dinner (array)', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, address, userId, breakfast, lunch, [], coffee, nightLife, thingsToDo)).to.throw(TypeError, ' is not a boolean')
            })

            it('should fail on non-boolean coffee (array)', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, address, userId, breakfast, lunch, dinner, [], nightLife, thingsToDo)).to.throw(TypeError, ' is not a boolean')
            })

            it('should fail on non-boolean nightLife (array)', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, address, userId, breakfast, lunch, dinner, coffee, [], thingsToDo)).to.throw(TypeError, ' is not a boolean')
            })

            it('should fail on non-boolean thingsToDo (array)', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, address, userId, breakfast, lunch, dinner, coffee, nightLife, [])).to.throw(TypeError, ' is not a boolean')
            })

            it('should fail on non-string place name (number))', () => {
                expect(() => logic.addPlace(number, latitude, longitude, address, userId, breakfast, lunch, dinner, coffee, nightLife, thingsToDo)).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-number latitude (string)', () => {
                const latitude = `text-${Math.random()}`

                expect(() => logic.addPlace(placeName, latitude, longitude, address, userId, breakfast, lunch, dinner, coffee, nightLife, thingsToDo)).to.throw(TypeError, `${latitude} is not a number`)
            })

            it('should fail on non-number longitude (string)', () => {
                const longitude = `text-${Math.random()}`

                expect(() => logic.addPlace(placeName, latitude, longitude, address, userId, breakfast, lunch, dinner, coffee, nightLife, thingsToDo)).to.throw(TypeError, `${longitude} is not a number`)
            })

            it('should fail on non-string address (number))', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, number, userId, breakfast, lunch, dinner, coffee, nightLife, thingsToDo)).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string userId (number))', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, address, number, breakfast, lunch, dinner, coffee, nightLife, thingsToDo)).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-boolean breakfast (number))', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, address, userId, number, lunch, dinner, coffee, nightLife, thingsToDo)).to.throw(TypeError, ' is not a boolean')
            })

            it('should fail on non-boolean lunch (number))', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, address, userId, breakfast, number, dinner, coffee, nightLife, thingsToDo)).to.throw(TypeError, ' is not a boolean')
            })

            it('should fail on non-boolean dinner (number))', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, address, userId, breakfast, lunch, number, coffee, nightLife, thingsToDo)).to.throw(TypeError, ' is not a boolean')
            })

            it('should fail on non-boolean coffee (number))', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, address, userId, breakfast, lunch, dinner, number, nightLife, thingsToDo)).to.throw(TypeError, ' is not a boolean')
            })

            it('should fail on non-boolean nightLife (number))', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, address, userId, breakfast, lunch, dinner, coffee, number, thingsToDo)).to.throw(TypeError, ' is not a boolean')
            })

            it('should fail on non-boolean thingsToDo (number))', () => {
                expect(() => logic.addPlace(placeName, latitude, longitude, address, userId, breakfast, lunch, dinner, coffee, nightLife, number)).to.throw(TypeError, ' is not a boolean')
            })
        })

        describe('list places by name', () => {
            let place, _latitude, _longitude

            beforeEach(async () => {
                place = new Place({ name: placeName, location, address, userId, breakfast, lunch, dinner, coffee, nightLife, thingsToDo })

                await place.save()

                _longitude = '41.38'
                _latitude = '2.18'
            })

            it('should succed on correct name', async () => {
                const places = await logic.listPlacesByName(place.name, _longitude, _latitude)

                const [_place] = places

                expect(_place).not.to.be.instanceof(Place)
                expect(_place.id).to.be.a('string')
                expect(_place.name).to.equal(place.name)
                expect(_place.address).to.equal(place.address)
                expect(_place.scoring).to.equal('?')
                expect(_place.picture).to.equal('https://res.cloudinary.com/dancing890/image/upload/v1542807002/waxfi0xtcm5u48yltzxc.png')
                expect(_place.tip).to.equal('')
                expect(_place.latitude).to.equal(place.location.coordinates[0])
                expect(_place.longitude).to.equal(place.location.coordinates[1])

            })

            it('should succed on correct name', async () => {
                // test list pictures
                let url = 'http://res.cloudinary.com/dancing890/image/upload/v1542718364/h7nnejboqjyirdyq5tfo.png'

                let picture = new Picture({ url, userId: user.id, public_id: 'h7nnejboqjyirdyq5tfo', placeId: place.id })

                await picture.save()

                let picture2 = new Picture({ url, userId: user.id, public_id: 'h7nnejboqjyirdyq5tfo', placeId: place.id })

                await picture2.save()

                //test list tips
                let text = `text-${Math.random()}`

                const time = moment().format('D MMMM YYYY')

                let tip = new Tip({ userId: user.id, placeId: place.id, text, time })

                await tip.save()

                let text2 = `text-${Math.random()}`

                const time2 = moment().format('D MMMM YYYY')

                let tip2 = new Tip({ userId: user.id, placeId: place.id, text: text2, time: time2 })

                await tip2.save()

                const places = await logic.listPlacesByName(place.name, _longitude, _latitude)

                const [_place] = places

                expect(_place).not.to.be.instanceof(Place)
                expect(_place.id).to.be.a('string')
                expect(_place.name).to.equal(place.name)
                expect(_place.address).to.equal(place.address)
                expect(_place.scoring).to.equal('?')
                expect(_place.picture).to.be.a('string')
                expect(_place.tip).to.be.a('string')
                expect(_place.latitude).to.equal(place.location.coordinates[0])
                expect(_place.longitude).to.equal(place.location.coordinates[1])
            })

            it('should fail on undefined place name', () => {
                expect(() => logic.listPlacesByName(undefined, _longitude, _latitude)).to.throw(TypeError, `undefined is not a string`)
            })

            it('should fail on undefined longitude', () => {
                expect(() => logic.listPlacesByName(place.name, undefined, _latitude)).to.throw(TypeError, `undefined is not a string`)
            })

            it('should fail on undefined latitude', () => {
                expect(() => logic.listPlacesByName(place.name, _longitude, undefined)).to.throw(TypeError, `undefined is not a string`)
            })

            it('should fail on non-string place name (object)', () => {
                expect(() => logic.listPlacesByName({}, _longitude, _latitude)).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string longitude (object)', () => {
                expect(() => logic.listPlacesByName(place.name, {}, _latitude)).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string latitude (object)', () => {
                expect(() => logic.listPlacesByName(place.name, _longitude, {})).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string place name (boolean)', () => {
                expect(() => logic.listPlacesByName(true, _longitude, _latitude)).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on non-string longitude (boolean)', () => {
                expect(() => logic.listPlacesByName(place.name, false, _latitude)).to.throw(TypeError, 'false is not a string')
            })

            it('should fail on non-string latitude (boolean)', () => {
                expect(() => logic.listPlacesByName(place.name, _longitude, true)).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on non-string place name (array)', () => {
                expect(() => logic.listPlacesByName([], _longitude, _latitude)).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string longitude (array)', () => {
                expect(() => logic.listPlacesByName(place.name, [], _latitude)).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string latitude (array)', () => {
                expect(() => logic.listPlacesByName(place.name, _longitude, [])).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string place name (number))', () => {
                const placeName = Math.random()

                expect(() => logic.listPlacesByName(placeName, _longitude, _latitude)).to.throw(TypeError, `${placeName} is not a string`)
            })

            it('should fail on non-string longitude (number)', () => {
                const _longitude = Math.random()

                expect(() => logic.listPlacesByName(place.name, _longitude, _latitude)).to.throw(TypeError, `${_longitude} is not a string`)
            })

            it('should fail on non-string latitude (number)', () => {
                const _latitude = Math.random()

                expect(() => logic.listPlacesByName(placeName, _longitude, _latitude)).to.throw(TypeError, `${_latitude} is not a string`)
            })

        })
        describe('list places by filter', () => {
            let place, place2, _latitude, _longitude

            beforeEach(async () => {
                place = new Place({ name: placeName, location, address, userId, breakfast, lunch, dinner, coffee, nightLife, thingsToDo })

                let placeName2 = 'Costa Dorada2'
                let latitude2 = 41.399469
                let longitude2 = 2.189943
                let address2 = "Street st, 45, Barcelona"
                let userId2 = user.id
                let breakfast2 = false
                let lunch2 = true
                let dinner2 = false
                let coffee2 = false
                let nightLife2 = false
                let thingsToDo2 = false

                const location2 = {
                    type: "Point",
                    coordinates: [longitude2, latitude2]
                }

                const voter1 = new Voter({ userId: user.id, score: 10 })

                const voter2 = new Voter({ userId: user.id, score: 5 })

                const voters = [voter1, voter2]

                place2 = new Place({ name: placeName2, location: location2, addres: address2, userId: userId2, voters, breakfast: breakfast2, lunch: lunch2, dinner: dinner2, coffee: coffee2, nightLife: nightLife2, thingsToDo: thingsToDo2 })

                await place.save()
                await place2.save()

                _longitude = '41.38'
                _latitude = '2.18'
            })

            it('should succed on correct name', async () => {
                let filter = 'breakfast'

                const places = await logic.listPlacesByFilter(filter, _longitude, _latitude)

                const [_place] = places

                expect(_place).not.to.be.instanceof(Place)
                expect(_place.id).to.be.a('string')
                expect(_place.name).to.equal(place.name)
                expect(_place.address).to.equal(place.address)
                expect(_place.scoring).to.equal('?')
                expect(_place.latitude).to.equal(place.location.coordinates[0])
                expect(_place.longitude).to.equal(place.location.coordinates[1])
                expect(_place.picture).to.be.a('string')
                expect(_place.tip).to.be.a('string')
            })

            it('should succed on correct name', async () => {
                // test list pictures
                let url = 'http://res.cloudinary.com/dancing890/image/upload/v1542718364/h7nnejboqjyirdyq5tfo.png'

                let picture = new Picture({ url, userId: user.id, public_id: 'h7nnejboqjyirdyq5tfo', placeId: place.id })

                await picture.save()

                let picture2 = new Picture({ url, userId: user.id, public_id: 'h7nnejboqjyirdyq5tfo', placeId: place.id })

                await picture2.save()

                //test list tips
                let text = `text-${Math.random()}`

                const time = moment().format('D MMMM YYYY')

                let tip = new Tip({ userId: user.id, placeId: place.id, text, time })

                await tip.save()

                let text2 = `text-${Math.random()}`

                const time2 = moment().format('D MMMM YYYY')

                let tip2 = new Tip({ userId: user.id, placeId: place.id, text: text2, time: time2 })

                await tip2.save()

                let filter = 'breakfast'

                const places = await logic.listPlacesByFilter(filter, _longitude, _latitude)

                const [_place] = places

                expect(_place).not.to.be.instanceof(Place)
                expect(_place.id).to.be.a('string')
                expect(_place.name).to.equal(place.name)
                expect(_place.address).to.equal(place.address)
                expect(_place.scoring).to.equal('?')
                expect(_place.picture).to.be.a('string')
                expect(_place.tip).to.be.a('string')
                expect(_place.latitude).to.equal(place.location.coordinates[0])
                expect(_place.longitude).to.equal(place.location.coordinates[1])
            })

            it('should succed on correct name and voters', async () => {
                let filter = 'lunch'

                const places = await logic.listPlacesByFilter(filter, _longitude, _latitude)

                const [_place] = places

                expect(_place).not.to.be.instanceof(Place)
                expect(_place.id).to.be.a('string')
                expect(_place.name).to.equal(place2.name)
                expect(_place.address).to.equal(place2.address)
                expect(_place.scoring).to.equal(7.5)
                expect(_place.latitude).to.equal(place2.location.coordinates[0])
                expect(_place.longitude).to.equal(place2.location.coordinates[1])
                expect(_place.picture).to.be.a('string')
                expect(_place.tip).to.be.a('string')
            })

            it('should fail on undefined place name', () => {

                expect(() => logic.listPlacesByFilter(undefined, _longitude, _latitude)).to.throw(TypeError, `undefined is not a string`)
            })

            it('should fail on undefined longitude', () => {
                expect(() => logic.listPlacesByFilter(place.name, undefined, _latitude)).to.throw(TypeError, `undefined is not a string`)
            })

            it('should fail on undefined latitude', () => {
                expect(() => logic.listPlacesByFilter(place.name, _longitude, undefined)).to.throw(TypeError, `undefined is not a string`)
            })

            it('should fail on non-string place name (object)', () => {
                expect(() => logic.listPlacesByFilter({}, _longitude, _latitude)).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string longitude (object)', () => {
                expect(() => logic.listPlacesByFilter(place.name, {}, _latitude)).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string latitude (object)', () => {
                expect(() => logic.listPlacesByFilter(place.name, _longitude, {})).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string place name (boolean)', () => {
                expect(() => logic.listPlacesByFilter(true, _longitude, _latitude)).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on non-string longitude (boolean)', () => {
                expect(() => logic.listPlacesByFilter(place.name, false, _latitude)).to.throw(TypeError, 'false is not a string')
            })

            it('should fail on non-string latitude (boolean)', () => {
                expect(() => logic.listPlacesByFilter(place.name, _longitude, true)).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on non-string place name (array)', () => {
                expect(() => logic.listPlacesByFilter([], _longitude, _latitude)).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string longitude (array)', () => {
                expect(() => logic.listPlacesByFilter(place.name, [], _latitude)).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string latitude (array)', () => {
                expect(() => logic.listPlacesByFilter(place.name, _longitude, [])).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string place name (number))', () => {
                const placeName = Math.random()
                expect(() => logic.listPlacesByFilter(placeName, _longitude, _latitude)).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string longitude (number)', () => {
                const _longitude = Math.random()

                expect(() => logic.listPlacesByFilter(place.name, _longitude, _latitude)).to.throw(TypeError, `${_longitude} is not a string`)
            })

            it('should fail on non-string latitude (number)', () => {
                const _latitude = Math.random()

                expect(() => logic.listPlacesByFilter(placeName, _longitude, _latitude)).to.throw(TypeError, `${_latitude} is not a string`)
            })
        })

        describe('retrieve place by Id', () => {
            let place

            beforeEach(async () => {
                const voter1 = new Voter({ userId: user.id, score: 10 })

                const voter2 = new Voter({ userId: user.id, score: 0 })

                const voters = [voter1, voter2]

                place = new Place({ name: placeName, location, address, userId, voters, breakfast, lunch, dinner, coffee, nightLife, thingsToDo })

                await place.save()
            })

            it('should succed on correct id', async () => {
                const _place = await logic.retrievePlaceById(user.id, place.id)

                expect(_place).not.to.be.instanceof(Place)
                expect(_place.id).to.be.a('string')
                expect(_place.name).to.equal(place.name)
                expect(_place.location.coordinates[0]).to.equal(place.location.coordinates[0])
                expect(_place.location.coordinates[1]).to.equal(place.location.coordinates[1])
                expect(_place.address).to.equal(place.address)
                expect(_place.userId).to.equal(user.id)
                expect(_place.scoring).to.equal(5)
                expect(_place.visitors).to.equal(2)
                expect(_place.breakfast).to.equal(place.breakfast)
                expect(_place.lunch).to.equal(place.lunch)
                expect(_place.dinner).to.equal(place.dinner)
                expect(_place.coffee).to.equal(place.coffee)
                expect(_place.nigthLife).to.equal(place.nigthLife)
                expect(_place.thingsToDo).to.equal(place.thingsToDo)
                expect(_place.scores).to.deep.equal([10, 0])
                expect(_place.picture).to.equal('https://res.cloudinary.com/dancing890/image/upload/v1542807002/waxfi0xtcm5u48yltzxc.png')

            })

            it('should fail on non existing user', async () => {
                const id = user.id

                await User.deleteMany()

                try {
                    const res = await logic.retrievePlaceById(id, place.id)

                    expect(true).to.be.false

                } catch (error) {
                    expect(error).to.be.instanceof(NotFoundError)

                    expect(error.message).to.equal(`user does not exist`)
                }
            })

            it('should fail on non existing place', async () => {
                const id = place.id

                await Place.deleteMany()

                try {
                    const res = await logic.retrievePlaceById(user.id, id)

                    expect(true).to.be.false

                } catch (error) {
                    expect(error).to.be.instanceof(NotFoundError)

                    expect(error.message).to.equal(`place does not exist`)
                }
            })

            it('should fail on undefined user id', async () => {
                expect(() => logic.retrievePlaceById(undefined, place.id)).to.throw(TypeError, `undefined is not a string`)
            })

            it('should fail on undefined place id', async () => {
                expect(() => logic.retrievePlaceById(user.id, undefined)).to.throw(TypeError, `undefined is not a string`)
            })

            it('should fail on empty user id', async () => {
                expect(() => logic.retrievePlaceById('', place.id)).to.throw(ValueError, `userId is empty or blank`)
            })

            it('should fail on empty place id', async () => {
                expect(() => logic.retrievePlaceById(user.id, '')).to.throw(ValueError, `placeId is empty or blank`)
            })

            it('should fail on blank user id', async () => {
                expect(() => logic.retrievePlaceById('   ', place.id)).to.throw(ValueError, `userId is empty or blank`)
            })

            it('should fail on blank place id', async () => {
                expect(() => logic.retrievePlaceById(user.id, '   ')).to.throw(ValueError, `placeId is empty or blank`)
            })

            it('should fail on non-string user id(object)', () => {
                expect(() => logic.retrievePlaceById({}, place.id)).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string place id(object)', () => {
                expect(() => logic.retrievePlaceById(user.id, {})).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string user id(boolean)', () => {
                expect(() => logic.retrievePlaceById(true, place.id)).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on non-string place id(boolean)', () => {
                expect(() => logic.retrievePlaceById(user.id, false)).to.throw(TypeError, 'false is not a string')
            })

            it('should fail on non-string user id(array)', () => {
                expect(() => logic.retrievePlaceById([], place.id)).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string place id(array)', () => {
                expect(() => logic.retrievePlaceById(user.id, [])).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string user id(number)', () => {
                let id = Math.random()

                expect(() => logic.retrievePlaceById(id, place.id)).to.throw(TypeError, `${id} is not a string`)
            })

            it('should fail on non-string place id(number)', () => {
                let id = Math.random()

                expect(() => logic.retrievePlaceById(user.id, id)).to.throw(TypeError, `${id} is not a string`)
            })
        })

        describe('update scoring', () => {
            let place, newScore

            beforeEach(async () => {

                place = new Place({ name: placeName, location, address, userId, breakfast, lunch, dinner, coffee, nightLife, thingsToDo })

                await place.save()

                newScore = 5

            })

            it('should succed on correct data', async () => {
                const { scoring, visitors, scores, userScore } = await logic.updateScoring(user.id, place.id, newScore)

                expect(scoring).to.equal(5)
                expect(scores).to.deep.equal([5])
                expect(userScore).to.deep.equal(5)
                expect(visitors).to.equal(1)

                const _place = await Place.findById(place.id)

                expect(_place.name).to.equal(place.name)
                expect(_place.latitude).to.equal(place.latitude)
                expect(_place.longitud).to.equal(place.longitud)
                expect(_place.address).to.equal(place.address)
                expect(_place.breakfast).to.equal(place.breakfast)
                expect(_place.lunch).to.equal(place.lunch)
                expect(_place.dinner).to.equal(place.dinner)
                expect(_place.coffee).to.equal(place.coffee)
                expect(_place.nigthLife).to.equal(place.nigthLife)
                expect(_place.thingsToDo).to.equal(place.thingsToDo)
                expect(_place.voters[0].userId.toString()).to.equal(userId)
                expect(_place.voters[0].score).to.equal(newScore)
            })

            it('should succed on correct data', async () => {
                place = new Place({ name: placeName, location, address, userId, breakfast, lunch, dinner, coffee, nightLife, thingsToDo })

                await place.save()

                newScore = 5

                const { scoring, visitors, scores, userScore } = await logic.updateScoring(user.id, place.id, newScore)

                expect(scoring).to.equal(5)
                expect(scores).to.deep.equal([5])
                expect(userScore).to.deep.equal(5)
                expect(visitors).to.equal(1)

                const _place = await Place.findById(place.id)

                expect(_place.name).to.equal(place.name)
                expect(_place.latitude).to.equal(place.latitude)
                expect(_place.longitud).to.equal(place.longitud)
                expect(_place.address).to.equal(place.address)
                expect(_place.breakfast).to.equal(place.breakfast)
                expect(_place.lunch).to.equal(place.lunch)
                expect(_place.dinner).to.equal(place.dinner)
                expect(_place.coffee).to.equal(place.coffee)
                expect(_place.nigthLife).to.equal(place.nigthLife)
                expect(_place.thingsToDo).to.equal(place.thingsToDo)
                expect(_place.voters[0].userId.toString()).to.equal(userId)
                expect(_place.voters[0].score).to.equal(newScore)
            })

            it('should fail on non existing user', async () => {
                const id = user.id

                await User.deleteMany()

                try {
                    const res = await logic.updateScoring(id, place.id, newScore)

                    expect(true).to.be.false

                } catch (error) {
                    expect(error).to.be.instanceof(NotFoundError)

                    expect(error.message).to.equal(`user does not exist`)
                }
            })

            it('should fail on non existing place', async () => {
                const id = place.id

                await Place.deleteMany()

                try {
                    const res = await logic.updateScoring(user.id, id, newScore)

                    expect(true).to.be.false

                } catch (error) {
                    expect(error).to.be.instanceof(NotFoundError)

                    expect(error.message).to.equal(`place does not exist`)
                }
            })

            it('should fail on undefined user id', async () => {
                expect(() => logic.updateScoring(undefined, place.id, newScore)).to.throw(TypeError, `undefined is not a string`)
            })

            it('should fail on undefined place id', async () => {
                expect(() => logic.updateScoring(user.id, undefined, newScore)).to.throw(TypeError, `undefined is not a string`)
            })

            it('should fail on undefined new score', async () => {
                expect(() => logic.updateScoring(user.id, place.id, undefined)).to.throw(TypeError, `undefined is not a number`)
            })

            it('should fail on empty user id', async () => {
                expect(() => logic.updateScoring('', place.id, newScore)).to.throw(ValueError, `userId is empty or blank`)
            })

            it('should fail on empty place id', async () => {
                expect(() => logic.updateScoring(user.id, '', newScore)).to.throw(ValueError, `placeId is empty or blank`)
            })

            it('should fail on blank user id', async () => {
                expect(() => logic.updateScoring('   ', place.id, newScore)).to.throw(ValueError, `userId is empty or blank`)
            })

            it('should fail on blank place id', async () => {
                expect(() => logic.updateScoring(user.id, '   ', newScore)).to.throw(ValueError, `placeId is empty or blank`)
            })

            it('should fail on non-string user id(object)', () => {
                expect(() => logic.updateScoring({}, place.id, newScore)).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string place id(object)', () => {
                expect(() => logic.updateScoring(user.id, {}, newScore)).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string new score(object)', () => {
                expect(() => logic.updateScoring(user.id, place.id, {})).to.throw(TypeError, '[object Object] is not a number')
            })

            it('should fail on non-string user id(boolean)', () => {
                expect(() => logic.updateScoring(true, place.id, newScore)).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on non-string place id(boolean)', () => {
                expect(() => logic.updateScoring(user.id, false, newScore)).to.throw(TypeError, 'false is not a string')
            })

            it('should fail on non-string new score(boolean)', () => {
                expect(() => logic.updateScoring(user.id, place.id, false)).to.throw(TypeError, 'false is not a number')
            })

            it('should fail on non-string user id(array)', () => {
                expect(() => logic.updateScoring([], place.id, newScore)).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string place id(array)', () => {
                expect(() => logic.updateScoring(user.id, [], newScore)).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string new score(array)', () => {
                expect(() => logic.updateScoring(user.id, place.id, [])).to.throw(TypeError, ' is not a number')
            })

            it('should fail on non-string user id(number)', () => {
                let id = Math.random()

                expect(() => logic.updateScoring(id, place.id, newScore)).to.throw(TypeError, `${id} is not a string`)
            })

            it('should fail on non-string place id(number)', () => {
                let id = Math.random()

                expect(() => logic.updateScoring(user.id, id, newScore)).to.throw(TypeError, `${id} is not a string`)
            })

            it('should fail on string new score(number)', () => {
                let score = `Math.random()`

                expect(() => logic.updateScoring(user.id, place.id, score)).to.throw(TypeError, `${score} is not a number`)
            })
        })
    })

    describe('pictures', () => {
        let place, user

        beforeEach(async () => {
            let name = 'John'
            let surname = 'Doe'
            let email = `jd-${Math.random()}@example.com`
            let password = `jd-${Math.random()}`
            let birthday = '20/02/2002'
            let gender = 'Male'
            let phone = `jdPhone-${Math.random()}`

            user = await new User({ name, surname, email, password, birthday, gender, phone }).save()

            let placeName = 'Costa Dorada'
            let latitude = 41.398469
            let longitude = 2.199943
            let address = "Street st, 43, Barcelona"
            let userId = user.id
            let breakfast = true
            let lunch = false
            let dinner = true
            let coffee = false
            let nightLife = true
            let thingsToDo = false

            let location = {
                type: "Point",
                coordinates: [longitude, latitude]
            }

            place = await new Place({ name: placeName, location, address, userId, breakfast, lunch, dinner, coffee, nightLife, thingsToDo }).save()
        })

        describe('add place pictures ', () => {
            let file
            beforeEach(async () => {
                const image = './data/test-images/default-place-pic.png'

                file = fs.createReadStream(image)
            })

            it('should succed on correct data', async () => {
                const url = await logic.addPlacePicture(user.id, place.id, file)

                expect(url).to.be.a('string')

                const pictures = await Picture.find()

                expect(pictures.length).to.be.equal(1)


                const [picture] = pictures

                expect(picture.id).to.be.a('string')
                expect(picture.url).to.be.a('string')
                expect(picture.public_id).to.be.a('string')
                expect(picture.userId.toString()).to.equal(user.id)
                expect(picture.placeId.toString()).to.equal(place.id)

                cloudinary.uploader.destroy(picture.public_id, (result) => { });
            })

            it('should fail on non existing user', async () => {
                const id = user.id

                await User.deleteMany()

                try {
                    const res = await logic.addPlacePicture(id, place.id, file)

                    expect(true).to.be.false

                } catch (error) {
                    expect(error).to.be.instanceof(NotFoundError)

                    expect(error.message).to.equal(`user does not exist`)
                }
            })

            it('should fail on non existing place', async () => {
                const id = place.id

                await Place.deleteMany()

                try {
                    const res = await logic.addPlacePicture(user.id, id, file)

                    expect(true).to.be.false

                } catch (error) {
                    expect(error).to.be.instanceof(NotFoundError)

                    expect(error.message).to.equal(`place does not exist`)
                }
            })

            it('should fail on undefined user id', async () => {
                expect(() => logic.addPlacePicture(undefined, place.id, file)).to.throw(TypeError, `undefined is not a string`)
            })

            it('should fail on undefined place id', async () => {
                expect(() => logic.addPlacePicture(user.id, undefined, file)).to.throw(TypeError, `undefined is not a string`)
            })

            it('should fail on empty user id', async () => {
                expect(() => logic.addPlacePicture('', place.id, file)).to.throw(ValueError, `userId is empty or blank`)
            })

            it('should fail on empty place id', async () => {
                expect(() => logic.addPlacePicture(user.id, '', file)).to.throw(ValueError, `placeId is empty or blank`)
            })

            it('should fail on blank user id', async () => {
                expect(() => logic.addPlacePicture('   ', place.id, file)).to.throw(ValueError, `userId is empty or blank`)
            })

            it('should fail on blank place id', async () => {
                expect(() => logic.addPlacePicture(user.id, '   ', file)).to.throw(ValueError, `placeId is empty or blank`)
            })

            it('should fail on non-string user id(object)', () => {
                expect(() => logic.addPlacePicture({}, place.id, file)).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string place id(object)', () => {
                expect(() => logic.addPlacePicture(user.id, {}, file)).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string user id(boolean)', () => {
                expect(() => logic.addPlacePicture(true, place.id, file)).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on non-string place id(boolean)', () => {
                expect(() => logic.addPlacePicture(user.id, false, file)).to.throw(TypeError, 'false is not a string')
            })

            it('should fail on non-string user id(array)', () => {
                expect(() => logic.addPlacePicture([], place.id, file)).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string place id(array)', () => {
                expect(() => logic.addPlacePicture(user.id, [], file)).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string user id(number)', () => {
                let id = Math.random()

                expect(() => logic.addPlacePicture(id, place.id, file)).to.throw(TypeError, `${id} is not a string`)
            })

            it('should fail on non-string place id(number)', () => {
                let id = Math.random()

                expect(() => logic.addPlacePicture(user.id, id, file)).to.throw(TypeError, `${id} is not a string`)
            })

        })

        describe('list place pictures', () => {
            let picture
            beforeEach(async () => {
                let url = 'http://res.cloudinary.com/dancing890/image/upload/v1542718364/h7nnejboqjyirdyq5tfo.png'

                picture = new Picture({ url, userId: user.id, public_id: 'h7nnejboqjyirdyq5tfo', placeId: place.id })

                await picture.save()
            })

            it('should succed on correct data', async () => {
                const pictureUrls = await logic.listPlacePictures(place.id)

                expect(pictureUrls.length).to.equal(1)

                const [pictureUrl] = pictureUrls
                expect(pictureUrl).to.be.a('string')
                expect(pictureUrl).to.equal(picture.url)

                const _pictures = await Picture.find({ placeId: place.id })

                expect(_pictures.length).to.equal(1)

                const [_picture] = _pictures
                expect(_picture.url).to.be.equal(pictureUrl)
            })

            it('should fail on non existing place', async () => {
                const id = place.id

                await Place.deleteMany()

                try {
                    const res = await logic.listPlacePictures(id)

                    expect(true).to.be.false

                } catch (error) {
                    expect(error).to.be.instanceof(NotFoundError)

                    expect(error.message).to.equal(`place does not exist`)
                }
            })

            it('should fail on undefined place id', async () => {
                expect(() => logic.listPlacePictures(undefined)).to.throw(TypeError, `undefined is not a string`)
            })

            it('should fail on empty place id', async () => {
                expect(() => logic.listPlacePictures('')).to.throw(ValueError, `placeId is empty or blank`)
            })

            it('should fail on blank place id', async () => {
                expect(() => logic.listPlacePictures('   ')).to.throw(ValueError, `placeId is empty or blank`)
            })

            it('should fail on non-string place id(object)', () => {
                expect(() => logic.listPlacePictures({})).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string place id(boolean)', () => {
                expect(() => logic.listPlacePictures(false)).to.throw(TypeError, 'false is not a string')
            })

            it('should fail on non-string place id(array)', () => {
                expect(() => logic.listPlacePictures([])).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string place id(number)', () => {
                let id = Math.random()

                expect(() => logic.listPlacePictures(id)).to.throw(TypeError, `${id} is not a string`)
            })

        })

        describe('list user pictures', () => {
            let picture

            beforeEach(async () => {
                let url = 'http://res.cloudinary.com/dancing890/image/upload/v1542718364/h7nnejboqjyirdyq5tfo.png'

                picture = new Picture({ url, userId: user.id, public_id: 'h7nnejboqjyirdyq5tfo', placeId: place.id })

                await user.save()
                await place.save()
                await picture.save()
            })

            it('should succed on correct data', async () => {
                const pictureUrls = await logic.listUserPictures(user.id)

                expect(pictureUrls.length).to.equal(1)

                const [pictureUrl] = pictureUrls
                expect(pictureUrl).to.be.a('string')
                expect(pictureUrl).to.equal(picture.url)

                const _pictures = await Picture.find({ userId: user.id })

                expect(_pictures.length).to.equal(1)

                const [_picture] = _pictures
                expect(_picture.url).to.be.equal(pictureUrl)
            })

            it('should fail on non existing user', async () => {
                const id = user.id

                await User.deleteMany()

                try {
                    const res = await logic.listUserPictures(id)

                    expect(true).to.be.false

                } catch (error) {
                    expect(error).to.be.instanceof(NotFoundError)

                    expect(error.message).to.equal(`user does not exist`)
                }
            })

            it('should fail on undefined user id', async () => {
                expect(() => logic.listUserPictures(undefined)).to.throw(TypeError, `undefined is not a string`)
            })

            it('should fail on empty user id', async () => {
                expect(() => logic.listUserPictures('')).to.throw(ValueError, `userId is empty or blank`)
            })

            it('should fail on blank user id', async () => {
                expect(() => logic.listUserPictures('   ')).to.throw(ValueError, `userId is empty or blank`)
            })

            it('should fail on non-string user id(object)', () => {
                expect(() => logic.listUserPictures({})).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string user id(boolean)', () => {
                expect(() => logic.listUserPictures(true)).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on non-string user id(array)', () => {
                expect(() => logic.listUserPictures([])).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string user id(number)', () => {
                let id = Math.random()

                expect(() => logic.listUserPictures(id)).to.throw(TypeError, `${id} is not a string`)
            })

        })

    })

    !false && describe('tips', () => {
        let user, place, text

        beforeEach(async () => {
            let name = 'John'
            let surname = 'Doe'
            let email = `jd-${Math.random()}@example.com`
            let password = `jd-${Math.random()}`
            let birthday = '20/02/2002'
            let gender = 'Male'
            let phone = `jdPhone-${Math.random()}`

            user = new User({ name, surname, email, password, birthday, gender, phone })

            let placeName = 'Costa Dorada'
            let latitude = 41.398469
            let longitude = 2.199943
            let userId = user.id
            let breakfast = true
            let lunch = false
            let dinner = true
            let coffee = false
            let nightLife = true
            let thingsToDo = false

            const location = {
                type: "Point",
                coordinates: [longitude, latitude]
            }

            place = new Place({ name: placeName, location, userId, breakfast, lunch, dinner, coffee, nightLife, thingsToDo })

            await user.save()
            await place.save()

            text = `text-${Math.random()}`

        })

        describe('add tips', () => {
            it('should succed on correct data', async () => {
                const res = await logic.addTip(user.id, place.id, text)

                expect(res.userPicture).to.equal(user.profilePicture)
                expect(res.userName).to.equal(user.name)
                expect(res.userSurname).to.equal(user.surname)
                expect(res.text).to.equal(text)
                expect(res.time).to.be.a('string')

                const tips = await Tip.find()

                expect(tips.length).to.equal(1)

                const [tip] = tips

                expect(tip.id).to.be.a('string')
                expect(tip.userId.toString()).to.equal(user.id)
                expect(tip.placeId.toString()).to.equal(place.id)
                expect(tip.time).to.be.a('string')
            })

            it('should fail on non existing user', async () => {
                const id = user.id

                await User.deleteMany()

                try {
                    const res = await logic.addTip(id, place.id, text)

                    expect(true).to.be.false

                } catch (error) {
                    expect(error).to.be.instanceof(NotFoundError)

                    expect(error.message).to.equal(`user does not exist`)
                }
            })

            it('should fail on non existing place', async () => {
                const id = place.id

                await Place.deleteMany()

                try {
                    const res = await logic.addTip(user.id, id, text)

                    expect(true).to.be.false

                } catch (error) {
                    expect(error).to.be.instanceof(NotFoundError)

                    expect(error.message).to.equal(`place does not exist`)
                }
            })

            it('should fail on undefined user id', async () => {
                expect(() => logic.addTip(undefined, place.id, text)).to.throw(TypeError, `undefined is not a string`)
            })

            it('should fail on undefined place id', async () => {
                expect(() => logic.addTip(user.id, undefined, text)).to.throw(TypeError, `undefined is not a string`)
            })
            it('should fail on undefined text', async () => {
                expect(() => logic.addTip(user.id, place.id, undefined)).to.throw(TypeError, `undefined is not a string`)
            })

            it('should fail on empty user id', async () => {
                expect(() => logic.addTip('', place.id, text)).to.throw(ValueError, `userId is empty or blank`)
            })

            it('should fail on empty place id', async () => {
                expect(() => logic.addTip(user.id, '', text)).to.throw(ValueError, `placeId is empty or blank`)
            })

            it('should fail on empty text', async () => {
                expect(() => logic.addTip(user.id, place.id, '')).to.throw(ValueError, `text is empty or blank`)
            })

            it('should fail on blank user id', async () => {
                expect(() => logic.addTip('   ', place.id, text)).to.throw(ValueError, `userId is empty or blank`)
            })

            it('should fail on blank place id', async () => {
                expect(() => logic.addTip(user.id, '   ', text)).to.throw(ValueError, `placeId is empty or blank`)
            })

            it('should fail on blank text', async () => {
                expect(() => logic.addTip(user.id, place.id, '  ')).to.throw(ValueError, `text is empty or blank`)
            })

            it('should fail on non-string user id(object)', () => {
                expect(() => logic.addTip({}, place.id, text)).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string place id(object)', () => {
                expect(() => logic.addTip(user.id, {}, text)).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string text(object)', () => {
                expect(() => logic.addTip(user.id, place.id, {})).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string user id(boolean)', () => {
                expect(() => logic.addTip(true, place.id, text)).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on non-string place id(boolean)', () => {
                expect(() => logic.addTip(user.id, false, text)).to.throw(TypeError, 'false is not a string')
            })

            it('should fail on non-string text(boolean)', () => {
                expect(() => logic.addTip(user.id, place.id, false)).to.throw(TypeError, 'false is not a string')
            })

            it('should fail on non-string user id(array)', () => {
                expect(() => logic.addTip([], place.id, text)).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string place id(array)', () => {
                expect(() => logic.addTip(user.id, [], text)).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string text(array)', () => {
                expect(() => logic.addTip(user.id, place.id, [])).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string user id(number)', () => {
                let id = Math.random()

                expect(() => logic.addTip(id, place.id, text)).to.throw(TypeError, `${id} is not a string`)
            })

            it('should fail on non-string place id(number)', () => {
                let id = Math.random()

                expect(() => logic.addTip(user.id, id, text)).to.throw(TypeError, `${id} is not a string`)
            })

            it('should fail on non-string place id(number)', () => {
                let text = Math.random()

                expect(() => logic.addTip(user.id, place.id, text)).to.throw(TypeError, `${text} is not a string`)
            })
        })

        describe('list tips by place Id', () => {
            let tip

            beforeEach(async () => {
                let text = `text-${Math.random()}`

                const time = moment().format('D MMMM YYYY')

                tip = new Tip({ userId: user.id, placeId: place.id, text, time })

                await tip.save()
            })

            it('should succced on correct data', async () => {
                const tips = await logic.listPlaceTips(place.id)

                expect(tips.length).to.equal(1)

                const [_tip] = tips

                expect(_tip.id).to.be.a('string')
                expect(_tip.id).to.equal(tip.id)
                expect(_tip.text).to.equal(tip.text)
                expect(_tip.userPicture).to.equal(user.profilePicture)
                expect(_tip.userName).to.equal(user.name)
                expect(_tip.userSurname).to.equal(user.surname)
                expect(_tip.time).to.equal(tip.time)
            })

            it('should fail on non existing place', async () => {
                const id = place.id

                await Place.deleteMany()

                try {
                    const res = await logic.listPlaceTips(id)

                    expect(true).to.be.false

                } catch (error) {
                    expect(error).to.be.instanceof(NotFoundError)

                    expect(error.message).to.equal(`place does not exist`)
                }
            })

            it('should fail on undefined place id', async () => {
                expect(() => logic.listPlaceTips(undefined)).to.throw(TypeError, `undefined is not a string`)
            })

            it('should fail on empty place id', async () => {
                expect(() => logic.listPlaceTips('')).to.throw(ValueError, `placeId is empty or blank`)
            })

            it('should fail on blank place id', async () => {
                expect(() => logic.listPlaceTips('   ')).to.throw(ValueError, `placeId is empty or blank`)
            })

            it('should fail on non-string place id(object)', () => {
                expect(() => logic.listPlaceTips({})).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string place id(boolean)', () => {
                expect(() => logic.listPlaceTips(false)).to.throw(TypeError, 'false is not a string')
            })

            it('should fail on non-string place id(array)', () => {
                expect(() => logic.listPlaceTips([])).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string place id(number)', () => {
                let id = Math.random()

                expect(() => logic.listPlaceTips(id)).to.throw(TypeError, `${id} is not a string`)
            })
        })

        describe('list tips by user Id', () => {
            let tip
            beforeEach(async () => {
                let text = `text-${Math.random()}`

                const time = moment().format('D MMMM YYYY')

                tip = new Tip({ userId: user.id, placeId: place.id, text, time })

                await tip.save()
            })

            it('should succced on correct data', async () => {
                const tips = await logic.listUserTips(user.id)

                expect(tips.length).to.equal(1)

                const [_tip] = tips

                expect(_tip.id).to.be.a('string')
                expect(_tip.id).to.equal(tip.id)
                expect(_tip.text).to.equal(tip.text)
                expect(_tip.placeId.toString()).to.equal(place._id.toString())
                expect(_tip.picture).to.be.a('string')
                expect(_tip.placeName).to.equal(place.name)
                expect(_tip.scoring).to.equal('?')
                expect(_tip.time).to.equal(tip.time)
            })

            it('should fail on non existing user', async () => {
                const id = user.id

                await User.deleteMany()

                try {
                    const __user = await logic.listUserTips(id)

                    expect(true).to.be.false
                } catch (error) {
                    expect(error).to.be.instanceof(NotFoundError)

                    expect(error.message).to.equal(`user does not exist`)
                }
            })

            it('should fail on undefined id', async () => {
                expect(() => logic.listUserTips(undefined)).to.throw(TypeError, `undefined is not a string`)
            })

            it('should fail on empty id', async () => {
                expect(() => logic.listUserTips('')).to.throw(ValueError, `userId is empty or blank`)
            })

            it('should fail on blank id', async () => {
                expect(() => logic.listUserTips('        ')).to.throw(ValueError, `userId is empty or blank`)
            })

            it('should fail on non-string id(object)', () => {
                expect(() => logic.listUserTips({})).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string id(boolean)', () => {
                expect(() => logic.listUserTips(true)).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on non-string id(array)', () => {
                expect(() => logic.listUserTips([])).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string id(number)', () => {
                let id = Math.random()
                expect(() => logic.listUserTips(id)).to.throw(TypeError, `${id} is not a string`)
            })
        })
    })



    after(() => mongoose.disconnect())
})