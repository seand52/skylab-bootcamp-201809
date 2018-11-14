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
        // let todo = false
        // let doing = false
        // let review = false
        // let done = false

        // switch (this.state.status) {
        //     case 'TODO':
        //         todo = true
        //         break
        //     case 'DOING':
        //         doing = true
        //         break
        //     case 'REVIEW':
        //         review = true
        //         break
        //     case 'DONE':
        //         done = true
        //         break
        // }
        return <select className="select" onChange={this.dropDownChange}>
        <option selected>Select a friend</option>
        {this.state.friends.map((item, index) => <option key={index} value={item}>{item}</option>)}
            {/* <option  value="TODO">To do</option>
            <option  value="DOING">Doing</option>
            <option  value="REVIEW">Review</option>
            <option  value="DONE">Done</option> */}
        </select>
    }
}

export default Dropwdown