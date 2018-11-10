import React, { Component } from 'react'

class Register extends Component {
    state = { name: '', surname: '', username: '', password: '' }

    handleNameChange = event => {
        const name = event.target.value

        this.setState({ name })
    }

    handleSurnameChange = event => {
        const surname = event.target.value

        this.setState({ surname })
    }

    handleUsernameChange = event => {
        const username = event.target.value

        this.setState({ username })
    }

    handlePasswordChange = event => {
        const password = event.target.value

        this.setState({ password })
    }

    handleSubmit = event => {
        event.preventDefault()

        const { name, surname, username, password } = this.state

        this.props.onRegister(name, surname, username, password)
    }

    render() {
        return <section className="register-page">
            <div className="register-wrapper">
                <form className="register-form" onSubmit={this.handleSubmit}>
                    <label className="field a-field a-field_a1 page__field">
                        <input type="text" onChange={this.handleNameChange} className="field__input" placeholder="e.g. John" required />
                        <span className="field__label-wrap">
                            <span className="field__label">First name</span>
                        </span>
                    </label>
                    <label className="field a-field a-field_a1 page__field">
                        <input type="text" onChange={this.handleSurnameChange} className="field__input" placeholder="e.g. Doe" required />
                        <span className="field__label-wrap">
                            <span className="field__label">Last name</span>
                        </span>
                    </label>
                    <label className="field a-field a-field_a1 page__field">
                        <input onChange={this.handleUsernameChange} type="text" className="field__input" placeholder="e.g. jd" required />
                        <span className="field__label-wrap">
                            <span className="field__label">Username</span>
                        </span>
                    </label>
                    <label className="field a-field a-field_a1 page__field">
                        <input onChange={this.handlePasswordChange} type="password" className="field__input" placeholder="e.g. 123" required />
                        <span className="field__label-wrap">
                            <span className="field__label">Password</span>
                        </span>
                    </label>
                    <button className="register__button draw-border" type="submit">Register</button> <a href="#" onClick={this.props.onGoBack}>Back to home page</a>
                </form>
            </div>
        </section>
    }
}

export default Register