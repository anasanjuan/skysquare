import React from 'react'
import { Link } from 'react-router-dom'

function UserTip(props) {
    return <section className='tip'>
        <Link to={`/home/place/${props.placeId}`}>
            <div className='tip__top'>
                <div className='tip__top__img'>
                    <img className='usertip__img' src={props.picture.replace('http:', 'https:')} alt='#'></img>
                </div>
                <div className='tip__info'>
                    <h5 className= 'usertip__name'>{props.placeName}</h5>
                    <h6>{props.time}</h6>
                </div>
                <div >
                    <div className='score'>{props.scoring}</div>
                </div>
            </div>

            <p className='tip__text'>{props.text}</p>
        </Link>
    </section>
}
export default UserTip

