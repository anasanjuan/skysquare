import React, { Component } from 'react'
import logic from '../logic'
import Swal from 'sweetalert2'
import Error from './Error'

class Pictures extends Component {
    state = { error: null, pictures: [], picture: null, previewPicture: null, showUpload: false }

    componentDidMount() {
        try {
            logic.listPictures(this.props.id)
                .then(pictures => {
                    if (pictures.length === 0) {
                        this.setState({ error: 'No pictures yet! Be the first to add one!' })
                    } else {
                        this.setState({ pictures, error: null })
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
        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    handlePictureSelect = event => {
        event.preventDefault()

        this.setState({
            previewPicture: URL.createObjectURL(event.target.files[0]),
            picture: event.target.files[0],
            showUpload: true
        })
    }

    handlePictureLoad = event => {
        event.preventDefault()

        try {
            logic.uploadPicture(this.props.id, this.state.picture)
                .then(res => {
                    const prevPictures = this.state.pictures

                    this.setState({ previewPicture: null, pictures: [...prevPictures, res], error: null, showUpload: false })
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
        return (<div className='pictures'>
            <form encType="multipart/form-data" onSubmit={this.handlePictureLoad}>
                <div className='add__pic__container'>
                    <div className='buttons__container'>
                        <p>Add a new picture</p>
                        <input className="input__hidden" type="file" name="file" id="file" accept="image/*" onChange={this.handlePictureSelect}></input>
                        <label className={!this.state.showUpload ? "choose__label choose__label--show" : "choose__label"} htmlFor="file">Choose a file</label>
                        <button type='submit' className={this.state.showUpload ? "upload__pic__button upload__pic__button--show" : "upload__pic__button"}>Load Picture</button>
                    </div>
                    <div className='preview__container'>
                        <img src={this.state.previewPicture} alt='' className='picture__preview' />
                    </div>
                </div>
            </form>
            <main className='pictures__main'>
                {this.state.error && <Error className='error__tips' containerClass='containerClass' message={this.state.error} />}
                {this.state.pictures.map((picture, index) => <img key={index} className='picture__item' src={`${picture.replace('http:', 'https:')}`} alt='#'></img>)}
            </main>
        </div>)
    }
}

export default Pictures