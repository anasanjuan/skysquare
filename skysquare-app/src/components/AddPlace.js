import React, { Component } from 'react'
import AddMap from './AddMap'
import { Link } from 'react-router-dom'

class AddPlace extends Component {
    state = { name: '', address: '', latitude: 0, longitude: 0, breakfast: false, lunch: false, dinner: false, coffee: false, nightLife: false, thingsToDo: false }

    getBoolean(target) {
        let option
        if (target === 'on') {
            return option = true

        } else {
            return option = false
        }
    }

    handleMapClick = (latitude, longitude) => {
        this.setState({ latitude, longitude })
    }

    handleOnChangeName = event => {
        const name = event.target.value

        this.setState({ name })
    }

    handleOnChangeAddress = event => {
        const address = event.target.value

        this.setState({ address })
    }

    handleOnChangeBreakfast = event => {
        const target = event.target.value

        let option = this.getBoolean(target)

        this.setState({ breakfast: option })
    }

    handleOnChangeLunch = event => {
        const target = event.target.value

        let option = this.getBoolean(target)

        this.setState({ lunch: option })
    }
    handleOnChangeDinner = event => {
        const target = event.target.value

        let option = this.getBoolean(target)

        this.setState({ dinner: option })
    }
    handleOnChangeCoffee = event => {
        const target = event.target.value

        let option = this.getBoolean(target)

        this.setState({ coffee: option })
    }
    handleOnChangeNightLife = event => {
        const target = event.target.value

        let option = this.getBoolean(target)

        this.setState({ nightLife: option })
    }
    handleOnChangeThingsToDo = event => {
        const target = event.target.value

        let option = this.getBoolean(target)

        this.setState({ thingsToDo: option })
    }
    handleSubmit = event => {
        event.preventDefault()

        const { name, address, latitude, longitude, breakfast, lunch, dinner, coffee, nightLife, thingsToDo } = this.state

        this.props.onAddPlace(name, address, latitude, longitude, breakfast, lunch, dinner, coffee, nightLife, thingsToDo)
    }

    render() {
        return <div className='add__place'>
            <header className='add__place__header'>
                <Link to={'/home/profile'}><i className="fas fa-arrow-left arrow" onClick={this.props.OnGoBack}></i></Link>
                <h1>Add a new place</h1>
            </header>
            <main className='add__place__main'>
                <form onSubmit={this.handleSubmit}>
                    <h6 className='text__label' >Name</h6>
                    <input className='text__input' type='text' placeholder='Add name' onChange={this.handleOnChangeName}></input><br />
                    <h6 className='text__label' >Address</h6>
                    <input className='text__input' type='text' placeholder='Add address' onChange={this.handleOnChangeAddress}></input><br />
                    <h6 className='text__label' >Add a marker in the map</h6>
                    <AddMap className='add__place__map' onMapClick={this.handleMapClick} />
                    <section className='fields'>
                        <h6 className='checkboxes__label' >This place is good for:</h6>
                        <section className='checkboxes'>
                            <div>
                                <label><input type='checkbox' className='checkboxes__input' name='Breakfast' onChange={this.handleOnChangeBreakfast}></input>Breakfast</label>
                                <label><input type='checkbox' className='checkboxes__input' name='Coffee' onChange={this.handleOnChangeCoffee}></input>Coffee</label>
                            </div>
                            <div>
                                <label><input type='checkbox' className='checkboxes__input' name='Lunch' onChange={this.handleOnChangeLunch}></input>Lunch</label>
                                <label><input type='checkbox' className='checkboxes__input' name='NightLife' onChange={this.handleOnChangeNightLife}></input>NigthLife</label>
                            </div>
                            <div>
                                <label><input type='checkbox' className='checkboxes__input' name='Dinner' onChange={this.handleOnChangeDinner}></input>Dinner</label>
                                <label><input type='checkbox' className='checkboxes__input' name='ThingsToDo' onChange={this.handleOnChangeThingsToDo}></input>ThingsToDo</label>
                            </div>
                        </section>
                    </section>
                    <section className='save__button'><button type='submit'>Save</button></section>
                </form>
            </main>
        </div>
    }
}

export default AddPlace