import React, { Component } from 'react'

class Register extends Component {
    state = { error: null, name: '', surname: '', email: '', password: '', birthday: '', gender: '', phone: '' }

    handleNameChange = event => {
        const name = event.target.value

        this.setState({ name })
    }

    handleSurnameChange = event => {
        const surname = event.target.value

        this.setState({ surname })
    }

    handleEmailChange = event => {
        const email = event.target.value

        this.setState({ email })
    }

    handlePasswordChange = event => {
        const password = event.target.value

        this.setState({ password })
    }

    handleBirthdayChange = event => {
        const birthday = event.target.value

        this.setState({ birthday })
    }

    handleGenderChange = event => {
        const gender = event.target.value

        this.setState({ gender })
    }

    handlePhoneChange = event => {
        const phone = event.target.value

        this.setState({ phone })
    }

    handleSubmit = event => {
        event.preventDefault()

        const { name, surname, email, password, birthday, gender, phone } = this.state

        this.props.onRegister(name, surname, email, password, birthday, gender ? gender : null, phone ? phone : null)

    }

    render() {
        return (<div className="register">
            <form onSubmit={this.handleSubmit}>
                <header className="register__header">
                    <nav className="navbar">
                        <ul className='navbar__ul'>
                            <li><i className="fas fa-arrow-left" onClick={this.props.OnGoBack}></i></li>
                            <li>Register</li>
                            <li><button type="submit" className="navbar__button">OK</button></li>
                        </ul>
                    </nav>
                </header>
                <main className="register__main">
                    <section className="add_picture">
                    </section>
                    <section>
                        <div className="fullname">
                            <input className="input_box input_box--half" placeholder="Name" onChange={this.handleNameChange}></input>
                            <input className="input_box input_box--half" placeholder="Surname" onChange={this.handleSurnameChange}></input>
                        </div>
                        <input type='email' className="input_box" placeholder="Email" onChange={this.handleEmailChange}></input>
                        <input type='password' className="input_box" placeholder="Password" onChange={this.handlePasswordChange}></input>
                        <input type='text' className="input_box" placeholder="Birthday(DD/MM/YYYY)" onChange={this.handleBirthdayChange}></input>
                        <select className=" input_box input_box--opt input_box--opt--gender" onChange={this.handleGenderChange} default="Gender">
                            <option value="Gender">Gender(optional)</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="I prefer not to say it">I prefer not to say it</option>
                        </select>
                        <input className="input_box input_box--opt" placeholder="Phone number(optional)" onChange={this.handlePhoneChange}></input>
                    </section>
                </main>
                <footer className="register__footer">
                    <button onClick={this.props.onLogInClick}>Do you already have an account? Log In now</button>
                </footer>
            </form>
        </div>

        )
    }
}

export default Register