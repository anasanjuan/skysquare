import React, { Component } from 'react'

class LogIn extends Component {
    state = { email: '', password: ''}

    handleEmailChange = event => {
        const email = event.target.value

        this.setState({ email })
    }

    handlePasswordChange = event => {
        const password = event.target.value

        this.setState({ password })
    }

    handleSubmit = event => {
        event.preventDefault()

        const { email, password } = this.state

        this.props.onLogIn(email, password)
    }

    render() {
        return <div>
            <form onSubmit={this.handleSubmit}>
                <header>
                    <nav className="navbar">
                        <ul className="navbar__ul">
                            <li><i className="fas fa-arrow-left" onClick={this.props.OnGoBack}></i></li>
                            <li><button className="navbar__button">Log In</button></li>
                        </ul>
                    </nav>
                </header>
                <main className="logIn__main">
                    <section className="inputs">
                        <input type='email' className="input_box--logIn" placeholder='Email' onChange={this.handleEmailChange}></input>
                        <input type='password' className="input_box--logIn" placeholder='Password' onChange={this.handlePasswordChange}></input>
                    </section>
                </main>
            </form>
        </div>
    }
}

export default LogIn