import React, { Component } from 'react'
import logic from './logic'
import Landing from './components/Landing'
import Register from './components/Register'
import LogIn from './components/LogIn'
import Search from './components/Search'
import Favourites from './components/Favourites'
import History from './components/History'
import ListPlaces from './components/ListPlaces'
import Info from './components/Info'
import AddPlace from './components/AddPlace'
import Pictures from './components/Pictures'
import Tips from './components/Tips'
import Error from './components/Error'
import Footer from './components/Footer'
import Profile from './components/Profile'
import PlaceHeader from './components/PlaceHeader'
import { Route, withRouter, Redirect } from 'react-router-dom'

logic.url = process.env.REACT_APP_API_URL 

class App extends Component {
    state = { errorLogIn: null, errorRegister: null, placesByName: [], error: null }

    handleRegisterClick = () => this.props.history.push('/register')

    handleLogInClick = () => this.props.history.push('/logIn')


    handleRegisterGoBack = () => {
        this.setState({ errorLogIn: null, errorRegister: null, error: null}, () => this.props.history.push('/'))
    }

    handleLogInGoBack = () => {
        this.setState({ errorLogIn: null, errorRegister: null, error: null}, () => this.props.history.push('/register'))
    }

    handleLogoutClick = () => {
        logic.logOut()

        this.setState({ errorLogIn: null, errorRegister: null, error: null}, () => this.props.history.push('/'))

    }

    handleAddPlaceClick = () => {
        this.setState({ errorLogIn: null, errorRegister: null, error: null}, () => this.props.history.push('/home/add-place'))

    }

    handleOnAddPlaceSubmit = (name, address, latitude, longitude, breakfast, lunch, dinner, coffee, nightLife, thingsToDo) => {
        try {
            logic.addPlace(name, address, latitude, longitude, breakfast, lunch, dinner, coffee, nightLife, thingsToDo)
                .then(() => {
                    this.setState({ errorLogIn: null, errorRegister: null, error: null}, () => this.props.history.push('/home/profile'))
                })
                .catch(error => this.setState({ error: error.message }))

        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    
    handleRegister = (name, surname, email, password, birthday, gender, phone) => {
        try {
            logic.register(name, surname, email, password, birthday, gender ? gender : null, phone ? phone : null)
                .then(() => {
                    this.setState({ errorLogIn: null, errorRegister: null, error: null }, () => this.props.history.push('/logIn'))
                })
                .catch(error => {
                    if (error.message === `${email} already exist`
                        || error.message === `${name} is not a string` || error.message === `${name} is empty or blank`
                        || error.message === `${surname} is not a string` || error.message === `${surname} is empty or blank`
                        || error.message === `${email} is not a string` || error.message === `${email} is empty or blank`
                        || error.message === `${password} is not a string` || error.message === `${password} is empty or blank`
                        || error.message === `${birthday} is not a string` || error.message === `${birthday} is empty or blank`
                        || error.message === `${gender} is not a string` || error.message === `${gender} is empty or blank`
                        || error.message === `${phone} is not a string` || error.message === `${phone} is empty or blank`) {
                        
                        debugger
                        this.setState({ errorRegister: error.message })
                    } else {
                        this.setState({ errorRegister: 'Oops! Something went wrong! Try later!' })
                    }
                })
        } catch (err) {
            this.setState({ errorRegister: err.message })
        }
    }

    handleErrorRegisterClick = event => {
        this.setState({ errorRegister: null })
    }

    handleLogIn = (email, password) => {
        try {
            logic.logIn(email, password)
                .then(() => this.setState({ errorLogIn: null, errorRegister: null, error: null}, () => this.props.history.push('/home')))
                .catch(error => {
                    debugger
                    if (error.message === `user not found` || error.message === `incorrect user or password`
                        || error.message === `${email} is not a string` || error.message === `${email} is empty or blank`
                        || error.message === `${password} is not a string` || error.message === `${password} is empty or blank`) {

                        this.setState({ errorLogIn: error.message })
                    } else {
                        this.setState({ errorLogIn: 'Oops! Something went wrong! Try later!' })
                    }
                })
        } catch (err) {
            this.setState({ errorLogIn: err.message })
        }
    }

    handleErrorLogInClick = event => {
        this.setState({ errorLogIn: null })
    }

    handleSearchSubmit = name => {
        this.setState({ errorLogIn: null, errorRegister: null, error: null}, () => this.props.history.push(`/home/name/${name}`))
    }

    
    renderPlace(placeId) {
        return (<div>
            <PlaceHeader id={placeId} />
            <Route exact path='/home/place/:id' render={props => logic.loggedIn ? <Info id={props.match.params.id} /> : <Redirect to="/logIn" />} />
            <Route path='/home/place/:id/pictures' render={props => logic.loggedIn ? <Pictures key={props.match.params.id} id={props.match.params.id} /> : <Redirect to="/logIn" />} />
            <Route path='/home/place/:id/tips' render={props => logic.loggedIn ? <Tips id={props.match.params.id} /> : <Redirect to="/logIn" />} />
        </div>)

    }
    renderHome() {
        return (<div className='home'>
            {this.state.error && <Error className='error__home' message={this.state.error} />}
            <div className='main'>
                <Route exact path='/home' render={() => logic.loggedIn ? <Search onSearchSubmit={this.handleSearchSubmit} /> : <Redirect to="/logIn" />} />
                <Route path='/home/filter/:filter' render={props => logic.loggedIn ? <ListPlaces type={'filter'} filter={props.match.params.filter} onSearchSubmit={this.handleSearchSubmit} /> : <Redirect to="/logIn" />} />
                <Route path='/home/name/:name' render={props => logic.loggedIn ? <ListPlaces type={'name'} name={props.match.params.name} onSearchSubmit={this.handleSearchSubmit} /> : <Redirect to="/logIn" />} />
                <Route path='/home/place/:id' render={props => logic.loggedIn ? this.renderPlace(props.match.params.id) : <Redirect to="/logIn" />} />
                <Route path='/home/favourites' render={() => logic.loggedIn ? <Favourites /> : <Redirect to="/logIn" />} />
                <Route path='/home/history' render={() => logic.loggedIn ? <History /> : <Redirect to="/logIn" />} />
                <Route path='/home/profile' render={() => logic.loggedIn ? <Profile onAddPlaceClick={this.handleAddPlaceClick} onLogOutClick={this.handleLogoutClick} /> : <Redirect to="/logIn" />} />
                <Route path='/home/add-place' render={() => logic.loggedIn ? <AddPlace onAddPlace={this.handleOnAddPlaceSubmit} /> : <Redirect to="/logIn" />} />
            </div>
            <Footer />
        </div>)
    }
    render() {
        return (<div>
                    
            {this.state.errorRegister && <Error className='error__register' onErrorOkClick={this.handleErrorRegisterClick} message={this.state.errorRegister} />}
            <Route exact path='/' render={() => !logic.loggedIn ? <Landing onRegisterClick={this.handleRegisterClick} onLogInClick={this.handleLogInClick} /> : <Redirect to="/home" />} />
            <Route path='/register' render={() => !logic.loggedIn ? <Register onRegister={this.handleRegister} OnGoBack={this.handleRegisterGoBack} onLogInClick={this.handleLogInClick} /> : <Redirect to="/home" />} />
            <Route path='/logIn' render={() => !logic.loggedIn ? <LogIn onLogIn={this.handleLogIn} OnGoBack={this.handleLogInGoBack} /> : <Redirect to="/home" />} />
            <Route path='/home' render={() => logic.loggedIn ? this.renderHome() : <Redirect to="/logIn" />} />
            <div className='error__container'>
                {this.state.errorLogIn && <Error className='error__login' onErrorOkClick={this.handleErrorLogInClick} message={this.state.errorLogIn} />}
            </div>
        </div>
        );
    }
}

export default withRouter(App)
