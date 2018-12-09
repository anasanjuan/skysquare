import React from 'react'
import { Link } from 'react-router-dom'

function Place(props) {
    return (<div className='place'>
        <Link to={`/home/place/${props.id}`}>
            <header className='place__header'>
                <div className='place__picture'>
                    <img className='picture__img' src={props.picture.replace('http:', 'https:')} alt='' ></img>
                </div>
                <div className='place__info'>
                    <h1>{props.name}</h1>
                    {props.distance? <h4>{props.distance} m</h4>: <h4>{props.address}</h4>}
                </div>
                <div className='place__score'>
                    <div className='score'>{props.scoring}</div>
                </div>
            </header>
            <p>{props.tip}</p>
        </Link>
    </div>)
}

export default Place