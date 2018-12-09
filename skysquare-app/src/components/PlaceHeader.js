import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import logic from '../logic'
import Swal from 'sweetalert2'

class PlaceHeader extends Component {
    state = { error: null, place: { picture: '' } }

    componentDidMount() {
        try {
            logic.retrievePlace(this.props.id)
                .then(place => {
                    this.setState({ place, error: null })
                })
                .catch(err =>
                    Swal({
                        title: 'Oops...',
                        html: "Something went wrong!" +
                            " Try again later",
                        customClass: 'swal-wide',
                        showCancelButton: false,
                        showConfirmButton: false,
                        showCloseButton: true,
                        animation: false
                    }))
        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    render() {
        // return <header className='place-header'>
        return <header className='place-header' style={{ backgroundImage: `url(${this.state.place.picture.replace('http:', 'https:')})` }}>
            <section className='place-header__main'>
                <Link to={'/home'}><i className="fas fa-arrow-left arrow" onClick={this.props.OnGoBack}></i></Link>
                <h1>{this.state.place.name}</h1>
                <nav className="place-header__nav">
                    <ul>
                        <Link to={`/home/place/${this.state.place.id}`}><li>Info</li></Link>
                        <Link to={`/home/place/${this.state.place.id}/pictures`}><li>Pictures</li></Link>
                        <Link to={`/home/place/${this.state.place.id}/tips`}><li>Tips</li></Link>
                    </ul>
                </nav>
            </section>
        </header>
    }
}

export default PlaceHeader

