import React, { Component } from 'react'
import logic from '../logic';
import Navbar from './Navbar';

class Profile extends Component {
    state = {
        name: this.props.name,
        surname: this.props.surname,
        password: '',
        newPassword: '',
        confirmPassword: '',
        username: ''
    }

    onNameChange = (event) => {
        const name = event.target.value
        this.setState({ name })
    }

    onSurnameChange = (event) => {
        const surname = event.target.value
        this.setState({ surname })
    }

    onUserNameChange = (event) => {

        const username = event.target.value
        this.setState({ username })
    }


    onNewPasswordChange = (event) => {
        const newPassword = event.target.value
        this.setState({ newPassword })
    }

    onConfirmPasswordChange = (event) => {
        const confirmPassword = event.target.value
        this.setState({ confirmPassword })
    }


    onPasswordChange = (event) => {
        const password = event.target.value
        this.setState({ password })
    }


    handleSubmit = (event) => {

        event.preventDefault()
        debugger
        const { newPassword, confirmPassword, username, name, surname, password } = this.state

        if (newPassword === confirmPassword) logic.sendUpdatedInfo(name, surname, username, newPassword, password)

        else console.log('error')


    }
    render() {
        return <div className="profile-page">
            <Navbar />
            <h1 className="profile__title">Profile Page</h1>

            <form>
                <div className="profile-wrapper">
                    <form className="profile-form" onSubmit={this.handleSubmit}>
                        <label className="field a-field a-field_a1 page__field">
                            <input type="text" onChange={this.onUserNameChange} className="field__input" placeholder="e.g. John" required />
                            <span className="field__label-wrap">
                                <span className="field__label">Username</span>
                            </span>
                        </label>
                        <label className="field a-field a-field_a1 page__field">
                            <input type="text" onChange={this.onNameChange} className="field__input" placeholder="e.g. Doe" required />
                            <span className="field__label-wrap">
                                <span className="field__label">Name</span>
                            </span>
                        </label>
                        <label className="field a-field a-field_a1 page__field">
                            <input onChange={this.onSurnameChange} type="text" className="field__input" placeholder="e.g. jd" required />
                            <span className="field__label-wrap">
                                <span className="field__label">Surname</span>
                            </span>
                        </label>
                        <label className="field a-field a-field_a1 page__field">
                            <input onChange={this.onNewPasswordChange} type="password" className="field__input" placeholder="e.g. 123" required />
                            <span className="field__label-wrap">
                                <span className="field__label">New Password</span>
                            </span>
                        </label>
                        <label className="field a-field a-field_a1 page__field">
                            <input onChange={this.onConfirmPasswordChange} type="password" className="field__input" placeholder="e.g. 123" required />
                            <span className="field__label-wrap">
                                <span className="field__label">Confirm Password</span>
                            </span>
                        </label>
                        <label className="field a-field a-field_a1 page__field">
                            <input onChange={this.onPasswordChange} type="password" className="field__input" placeholder="e.g. 123" required />
                            <span className="field__label-wrap">
                                <span className="field__label">Enter password to make changes</span>
                            </span>
                        </label>
                        <button className="profile__button draw-border" type="submit">Submit</button> 
                    </form>
                </div>
            </form>
        </div>
    }
}

export default Profile
