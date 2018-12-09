import React, { Component } from 'react'
import logic from '../logic'
import Swal from 'sweetalert2'


class AddProfilePicture extends Component {
    state = { error: null, profilePicture: this.props.profilePicture, previewPicture: null, editPictureOpen: false, uploadPictureOpen: false }


    componentWillReceiveProps(props) {
        this.setState({ ...props })
    }

    handleEditPictureClick = () => {
        this.setState({ editPictureOpen: !this.state.editPictureOpen })
    }

    handlePictureSelect = event => {
        event.preventDefault()

        this.setState({
            previewPicture: URL.createObjectURL(event.target.files[0]),
            profilePicture: event.target.files[0],
            error: null
        })
        this.setState({ uploadPictureOpen: true })

    }

    handlePictureLoad = event => {
        event.preventDefault()

        try {
            logic.uploadProfilePicture(this.state.profilePicture)
                .then(res => this.setState({ previewPicture: null, profilePicture: res, editPictureOpen: !this.state.editPictureOpen, error: null, uploadPictureOpen: false }))
                .catch(err =>
                    Swal({
                        title: 'Oops...',
                        html: "Something went wrong!" +
                            " Try again later",
                        customClass: 'swal-wide',
                        showCancelButton: false,
                        showConfirmButton:false,
                        showCloseButton: true,
                        animation: false
                    }))
        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    render() {
        return (<div className='add__profile__picture'>
            <div className='pic__container'>
                <img onClick={this.handleEditPictureClick} src={this.state.previewPicture ? this.state.previewPicture : this.state.profilePicture} alt=''></img>
            </div>
            <form onSubmit={this.handlePictureLoad} className={this.state.editPictureOpen ? "profilePicture__edit profilePicture__edit--open" : "profilePicture__edit"} encType="multipart/form-data" >
                <div className='button__container' >
                    <div className={!this.state.uploadPictureOpen ? "input__container" : "input__container input__container--close"} onClick={this.handleSelectImageClick}>
                        <input className="input__hidden" type="file" name="file" id="file" accept="image/*" onChange={this.handlePictureSelect}></input>
                        <label htmlFor="file">Select new pic</label>
                    </div>
                    <button className={this.state.uploadPictureOpen ? "upload__button upload__button--open" : "upload__button"} type='submit'>Load Picture</button>
                </div>
            </form>
        </div>

        )
    }

}

export default AddProfilePicture