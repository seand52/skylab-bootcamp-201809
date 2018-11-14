import React, { Component } from 'react'
import logic from '../logic'

class Dropwdown extends Component {

    state = {
        status: this.props.defaultStatus,
        friends: this.props.friends
    }

    dropDownChange =(event) => {
        event.preventDefault()

        const id = sessionStorage.getItem('userId')

        const username = event.target.value

        const postitId = this.props.postitId

        return logic.assignPostit(id, postitId, username)
            .then(() => logic.retrieveFriends(id))
            .then(res => {
                const friendArray = [...res]
                this.setState({friends: friendArray})
            })

    }

    componentDidMount () {
        const id = sessionStorage.getItem('userId')

        return logic.retrieveFriends(id) 
            .then(res =>{
                const friendArray = [...res]
                this.setState({friends: friendArray})
            })
    }

    render() {
        return <select className="select" onChange={this.dropDownChange}>
        <option selected>Select a friend</option>
        {this.state.friends.map((item, index) => <option key={index} value={item}>{item}</option>)}
        </select>
    }
}

export default Dropwdown