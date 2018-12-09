import React from 'react'

function Landing(props) {
    return (<div>
        <div className="landing">
        <header className="landing__header">
            <section className="title">
                <h1>SkySquare</h1>
                <h2>City Guide</h2>
            </section>
            <section className="landing__subtitle">
                Skysquare knows what you like <br /> and will bring you to places you will love
                </section>
        </header>
        <main className="landing__main">
           
            <button className="landing__register" onClick={props.onRegisterClick}> <i className="fas fa-envelope icon"></i> Register with your email</button>
        </main>
        <footer className="landing__footer">
            <button className="footer__logIn" onClick={props.onLogInClick}>¿Do you already have an account? <b>Log In now</b></button>
        </footer>
        </div>
    </div>
    );


}

export default Landing