import React, { Component } from 'react'
import logic from '../logic'

class Dropwdown extends Component {

    state = {
        status: this.props.defaultStatus
    }

    dropDownChange =(event) => {
        event.preventDefault()

        const val = event.target.value

        this.setState({status: val}, () =>  this.props.onUpdatePost(this.props.id, this.props.text, val))        
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
        return <select  className="select" defaultValue={this.state.status} onChange={this.dropDownChange}>
            <option  value="TODO">To do</option>
            <option  value="DOING">Doing</option>
            <option  value="REVIEW">Review</option>
            <option  value="DONE">Done</option>
        </select>
    }
}

export default Dropwdown