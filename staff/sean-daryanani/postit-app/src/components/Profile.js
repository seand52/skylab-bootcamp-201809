import React, { Component } from 'react'
import logic from '../logic';

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
        this.setState({username})
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
        const { newPassword, confirmPassword, username, name, surname, password } = this.state

        if (newPassword === confirmPassword) logic.sendUpdatedInfo(this.props.id, name, surname, username, newPassword, password)

        else console.log('error')


    }
    render() {
        return <div>
            <h1>Profile Page</h1>

            <form>
                <label>username</label>
                <input type="text" onChange={this.onUserNameChange} defaultValue={this.props.username}></input>
                <label>Name</label>
                <input type="text" onChange={this.onNameChange} defaultValue={this.props.name}></input>
                <label>Surname</label>
                <input type="text" onChange={this.onSurnameChange} defaultValue={this.props.surname}></input>
                <label>New Password</label>
                <input onChange={this.onNewPasswordChange} type="password"></input>
                <label>Confirm Password</label>
                <input onChange={this.onConfirmPasswordChange} type="password"></input>

                <label>Enter your password to make changes</label>
                <input onChange={this.onPasswordChange} type="password" required></input>
                <button type="submit" onClick={this.handleSubmit}>Submit</button>

            </form>
        </div>
    }
}

export default Profile