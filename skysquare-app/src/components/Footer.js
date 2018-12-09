import React from 'react';
import { Link } from 'react-router-dom'

function Footer(props) {
    return <footer className="footer" >
        <nav className="footer__nav">
            <ul>
                <Link to={'/home'} className="nav-item">
                    <li>
                        <i className="fas fa-search icon"></i>
                        <h5>Search</h5>
                    </li>
                </Link>
                <Link to={'/home/history'} className="nav-item">
                    <li >
                        <i className="fas fa-history icon"></i>
                        <h5>History</h5>
                    </li>
                </Link>
                <Link to={'/home/favourites'} className="nav-item">
                    <li >
                        <i className="fas fa-star icon"></i>
                        <h5>Favourites</h5>
                    </li>
                </Link>
                
                <Link to={'/home/profile'} className="nav-item">
                    <li >
                        <i className="far fa-user icon"></i>
                        <h5>Profile</h5>
                    </li>
                </Link>
            </ul>
        </nav>
    </footer>
}


export default Footer