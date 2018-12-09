import React, { Component } from 'react'
import logic from '../logic'
import Place from './Place'
import Swal from 'sweetalert2'
import Error from './Error'

class History extends Component {
    state = { error: null, checkins: [] }
    componentDidMount() {
        logic.listCheckIns()
            .then(res => {
                if (res.length === 0) {
                    this.setState({ error: 'No history yet!' })
                } else {
                    this.setState({ checkins: res, error: null })
                }
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
    }

    render() {
        return <div className='history'>
            <header className='blue__header'>
                <h1>My history</h1>
            </header>
            <main className='history__main'>
                {this.state.error && <Error className='error__home' containerClass='containerClass' message={this.state.error} />}
                {this.state.checkins.map(check => <Place key={check.placeId} id={check.placeId} name={check.name} scoring={check.scoring} picture={check.picture} tip={check.tip} address={check.address} />)}
            </main>
        </div>
    }
}

export default History