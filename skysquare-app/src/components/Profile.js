import React, { Component } from 'react'
import AddProfilePicture from './AddProfilePicture'
import UserTip from './UserTip'
import logic from '../logic'
import Swal from 'sweetalert2'
import Error from './Error'


class Profile extends Component {
    state = { tipError: null, picError: null, user: { profilePicture: '' }, open: false, pictures: [], tips: [], listPictures: false }

    componentDidMount() {
        logic.retrieveUser()
            .then(user => this.setState({ user }))
            .then(() => logic.listUserTips(this.state.user.id))
            .then(tips => {
                if (tips.length === 0) {
                    this.setState({ tipError: "You don't have any tip yet!" })
                } else {
                    this.setState({ tips, tipError: null, picError: null, })
                }
            })
            .then(() => logic.listUserPictures(this.state.user.id))
            .then(pictures => {
                if (pictures.length === 0) {
                    this.setState({ picError: "You don't have any picture yet!" })
                } else {
                    this.setState({ pictures, picError: null, tipError: null })
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

    handleListTips = () => {
        this.setState({ listPictures: false })
    }

    handleListPictures = () => {
        this.setState({ listPictures: true })
    }

    render() {
        return <div className="profile">
            <header className='profile__header'>
                <div className='profile__top'>
                    <button onClick={this.props.onLogOutClick}>Log Out</button>
                    <h1>{`${this.state.user.name} ${this.state.user.surname}`}</h1>

                </div>
                <section className='profile__info'>
                    <AddProfilePicture profilePicture={this.state.user.profilePicture.replace('http:', 'https:')} />
                    <div className='profile__info__tips' onClick={this.handleListTips}>
                        <h5>{this.state.tips.length}</h5>
                        <h4>Tips</h4>
                    </div>
                    <div className='profile__info__pictures' onClick={this.handleListPictures}>
                        <h5>{this.state.pictures.length}</h5>
                        <h4>Pictures</h4>
                    </div>
                </section>
                <button className='addPlace__button' onClick={this.props.onAddPlaceClick}>Add New Place</button>
            </header>
            <main className='profile__main'>
                <section className='profile__list'>
                    {this.state.listPictures && this.state.picError && <Error className='error__tips' containerClass='containerClass' message={this.state.picError} />}
                    {!this.state.listPictures && this.state.tipError && <Error className='error__tips' containerClass='containerClass' message={this.state.tipError} />}
                    {!this.state.listPictures && this.state.tips.map(tip => <UserTip key={tip.id} placeId={tip.placeId} text={tip.text} picture={tip.picture} placeName={tip.placeName} time={tip.time} scoring={tip.scoring} />)}
                    {this.state.listPictures && this.state.pictures.map((picture, index) => <img key={index} className='picture__item' src={`${picture.replace('http:', 'https:')}`} alt='#'></img>)}
                </section>
            </main>
        </div>
    }
}

export default Profile