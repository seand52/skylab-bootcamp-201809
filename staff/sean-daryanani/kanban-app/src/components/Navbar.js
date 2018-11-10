import React, {Component} from 'react'


class Navbar extends Component {

    logout = () => {
        this.props.logout()
    }
    render() {
        return <div>
            <nav className="navbar">
                <div className="menu">
                    <ul>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">Profile</a></li>
                        <li><a href="#" onClick={this.logout}>Logout</a></li>
                    </ul>
                </div>
            </nav>
        </div>
    }
}

export default Navbar