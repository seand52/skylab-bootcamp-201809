import React, {Component} from 'react'
import logic from '../logic';

class Profile extends Component {
    state = {
        name: this.props.name,
        surname: this.props.surname,
        password: '',
        newPassword: '',
        confirmPassword: ''
    }

    onNameChange =(event) => {
        const name = event.target.value
        this.setState({name})
    }

    onSurnameChange =(event) => {
        const surname = event.target.value
        this.setState({surname})
    }


    onPassword =(event) => {
        const password = event.target.value
        this.setState({password})
    }

    confirmPassword =(event) => {
        const confirmPassword = event.target.value
        this.setState({confirmPassword})
    }


    onNewPassword =(event) => {
        const newPassword = event.target.value
        this.setState({newPassword})
    }




    handleSubmit = (event) => {
        event.preventDefault()
        const {password, newPassword, name, surname, confirmPassword} = this.state
        console.log(password, newPassword, name, surname, confirmPassword)
        

        if (password===newPassword) logic.sendUpdatedInfo(this.props.id, name, surname, newPassword, confirmPassword)

        else console.log('error')


    }
    render() {
        return <div>
        <h1>Profile Page</h1>

        <form>
            <label>Name</label>
            <input type="text" onChange={this.onNameChange} defaultValue={this.props.name}></input>
            <label>Surname</label>
            <input type="text" onChange={this.onSurnameChange} defaultValue={this.props.surname}></input>
            <label>Password</label>
            <input onChange={this.onPassword} type="password"></input>
            <label>Confirm Password</label>
            <input onChange={this.onNewPassword} type="password"></input>
            
            <label>Enter your password to make changes</label>
            <input onChange={this.confirmPassword} type="password" required></input>
            <button type="submit" onClick={this.handleSubmit}>Submit</button>

        </form>
        </div>
    }
}

export default Profile