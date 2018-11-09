import React, { Component } from 'react'

class Dropwdown extends Component {

    state = {
        status: 'TODO'
    }

    dropDownChange =(event) => {
        event.preventDefault()

        const val = event.target.value

        this.setState({status: val}, () =>  this.props.onUpdatePost(this.props.id, this.props.text, val))        
    }

    render() {
        return <select onChange={this.dropDownChange}>
            <option value="TODO">To do</option>
            <option value="DOING">Doing</option>
            <option value="REVIEW">Review</option>
            <option value="DONE">Done</option>
        </select>
    }
}

export default Dropwdown