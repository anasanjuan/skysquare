import React, {Component} from 'react'
import logic from '../logic'
import Swal from 'sweetalert2'


class AddPicture extends Component {
    state={ picture: null, previewPicture: null, error: null}

    handlePictureSelect = event => {
        event.preventDefault()

        this.setState({
            previewPicture: URL.createObjectURL(event.target.files[0]),
            picture: event.target.files[0],
            error: null
          })
        
    }

    handlePictureLoad = event => {
        event.preventDefault()

        try {
            logic.UploadPicture(this.props.placeId, this.state.picture)
            .then(res => {
                this.setState({previewPicture: null, error: null})
            })
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
        return(<div className='addPicture'>
            <form encType="multipart/form-data" onSubmit={this.handlePictureLoad}>
            <input type="file" name="pic" accept="image/*" onChange={this.handlePictureSelect}></input>
            <img src={this.state.previewPicture} alt='' className='picture__preview'/>
            <button type='submit'>Load Picture</button>
            </form>
        </div>

        )
    }

}

export default AddPicture