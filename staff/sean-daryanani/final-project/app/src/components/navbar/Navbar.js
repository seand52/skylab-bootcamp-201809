import React from "react";
import { Navbar, NavbarBrand, NavbarNav, NavItem, NavbarToggler, Collapse } from "mdbreact";
import { withRouter } from 'react-router-dom'
import logic from '../../logic'
import './navbar.css'

class Navbarpage extends React.Component {
    state = {
        isOpen: false,
    };


    onLogoClick = () => this.props.history.push('/home')

    onHomeClick = () => this.props.history.push('/home')

    onExploreClick = () => this.props.history.push('/explore')

    onProfileClick = () => this.props.history.push(`/profile/${this.props.userId}`)

    handleLogout = () => {
        logic.logout()

        this.props.history.push('/')
    }

    toggleCollapse = () => this.setState({ isOpen: !this.state.isOpen })

    render() {
        return (

            <Navbar color="indigo" dark expand="md">
                <NavbarBrand>
                    <button className="navbar__button" onClick={this.onLogoClick}><strong className="white-text">SocialDev</strong></button>
                </NavbarBrand>
                <NavbarToggler
                    onClick={this.toggleCollapse}
                />
                <Collapse
                    id="navbarCollapse3"
                    isOpen={this.state.isOpen}
                    navbar
                >
                    <NavbarNav>
                        <NavItem>
                            <button onClick={this.onHomeClick} className="navbar__button" type="button">Home</button>
                        </NavItem>
                        <NavItem >
                            <button onClick={this.onExploreClick} className="navbar__button" type="button">Explore</button>
                        </NavItem>
                        <NavItem >
                            <button onClick={this.onProfileClick} className="navbar__button" type="button">Profile</button>
                        </NavItem>
                    </NavbarNav>
                    <NavbarNav right>
                        <button onClick={this.handleLogout} className="navbar__button" type="button">Logout</button>
                    </NavbarNav>
                </Collapse>
            </Navbar>
        );
    }
}

export default withRouter(Navbarpage);