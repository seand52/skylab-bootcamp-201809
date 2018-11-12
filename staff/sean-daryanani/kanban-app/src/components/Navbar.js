import React, {Component} from 'react'
import { Route, withRouter, Redirect } from 'react-router-dom'

class Navbar extends Component {

    logout = (event) => {
        event.preventDefault()
        this.props.logout()
    }

    goToProfile = (event) => {
        event.preventDefault()
        this.props.history.push('/profile')
    }

    goToHome = (event) => {
        event.preventDefault()
        this.props.history.push('./postits')
    }
    render() {
        return <div>
            <nav className="navbar">
                <div className="menu">
                    <ul>
                        <li><a onClick={this.goToHome} href="#">Home</a></li>
                        <li><a onClick={this.goToProfile} href="#">Profile</a></li>
                        <li><a href="#" onClick={this.logout}>Logout</a></li>
                    </ul>
                </div>
            </nav>
        </div>
    }
}

export default withRouter(Navbar)