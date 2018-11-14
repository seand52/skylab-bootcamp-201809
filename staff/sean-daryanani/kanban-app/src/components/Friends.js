import React, { Component } from 'react'
import logic from '../logic'
import Navbar from './Navbar'

class Friends extends Component {
    state = {
        text: '',
        friends: []
    }

    handleInput = event => {
        const text = event.target.value

        this.setState({ text })
    }

    handleSubmit = event => {

        event.preventDefault()

        const username = this.state.text

        const id = sessionStorage.getItem('userId')

        return logic.addFriends(id, username)
            .then(() => {
                this.setState({text:''})

                return logic.retrieveFriends(id)
                .then(res => {    
                    const friendArray = [...res]
                    this.setState({friends: friendArray})
                })
            })
    }

    componentDidMount() {
        const id = sessionStorage.getItem('userId')

        return logic.retrieveFriends(id)
            .then(res => {

                const friendArray = [...res]
                this.setState({friends: friendArray})
            })

    }


    render() {
        return <section>
            <Navbar />
            <form onSubmit={this.handleSubmit}>
                <label>Add friend
                <input type="text" value={this.state.text} onChange={this.handleInput} className="" />
                </label>
            </form>
            <ul>
            {this.state.friends.map(item => <li>{item}</li>)}
            </ul>

        </section>
    }
}

export default Friends