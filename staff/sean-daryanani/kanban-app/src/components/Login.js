import React, {Component} from 'react'

class Login extends Component {
    state = { username: '', password: '' }

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

        const { username, password } = this.state

        this.props.onLogin(username, password)
    }

    render() {
        return <section className="login-page">
        <div className="login-wrapper">
            <form className="login-form" onSubmit={this.handleSubmit}>
                <label className="field a-field a-field_a1 page__field">
                    <input type="text" onChange={this.handleUsernameChange} className="field__input" placeholder="e.g. jd" required />
                    <span className="field__label-wrap">
                        <span className="field__label">Username</span>
                    </span>
                </label>
                <label className="field a-field a-field_a1 page__field">
                    <input type="text" onChange={this.handlePasswordChange} className="field__input" placeholder="e.g. 123" required />
                    <span className="field__label-wrap">
                        <span className="field__label">Password</span>
                    </span>
                </label>
                <button className="login__button draw-border" type="submit">Login</button> <a href="#" onClick={this.props.onGoBack}>Back to home page</a>
            </form>
        </div>
    </section>    
 
    }
}

export default Login

