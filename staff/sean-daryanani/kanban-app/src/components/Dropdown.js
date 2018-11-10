import React, { Component } from 'react'
import logic from '../logic'

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
        let todo = false
        let doing = false
        let review = false
        let done = false

        switch (this.state.status) {
            case 'TODO':
                todo = true
                break
            case 'DOING':
                doing = true
                break
            case 'REVIEW':
                review = true
                break
            case 'DONE':
                done = true
                break
        }
        return <select onChange={this.dropDownChange}>
            <option selected={todo ? 'selected' : null} value="TODO">To do</option>
            <option selected={doing ? 'selected' : null} value="DOING">Doing</option>
            <option selected={review ? 'selected' : null} value="REVIEW">Review</option>
            <option selected={done ? 'selected' : null} value="DONE">Done</option>
        </select>
    }
}

export default Dropwdown