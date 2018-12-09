import React, { Component } from 'react'
import logic from '../logic'
import Place from './Place'
import Swal from 'sweetalert2'
import Error from './Error'

class Favourites extends Component {
    state = { error: null, favourites: [] }

    componentDidMount() {
        try {
            logic.listFavourites()
                .then(res => {
                    if (res.length === 0) {
                        this.setState({ error: 'No favourites yet!' })
                    } else {
                        this.setState({ favourites: res, error: null })
                    }
                })
                .catch(err => Swal({
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
        return <div className='favourites'>
            <header className='blue__header'>
                <h1>My favourite places</h1>
            </header>
            <main className='favourites__main'>
                {this.state.error && <Error className='error__home' containerClass='containerClass' message={this.state.error} />}
                {this.state.favourites.map(fav => <Place key={fav.placeId} id={fav.placeId} name={fav.name} scoring={fav.scoring} picture={fav.picture} tip={fav.tip} address={fav.address} />)}
            </main>
        </div>
    }
}

export default Favourites