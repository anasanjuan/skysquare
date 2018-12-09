import React from 'react'

function Tip(props) {
    return <section className='tip'>
    
        <div className='tip__top'>
            <div className='tip__top__img'>
                <img className='placetip__img' src={props.userPicture.replace('http:', 'https:')} alt='#'></img>
            </div>
            <div className='tip__info'>
                <h5>{`${props.userName} ${props.userSurname}`}</h5>
                <h6>{props.time}</h6>
            </div>
        </div>
        <p className='tip__text'>{props.text}</p>
    </section>
}
export default Tip


