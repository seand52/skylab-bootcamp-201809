import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {Button} from 'mdbreact'
import Navbarpage from '../navbar/Navbar'
import logic from '../../logic'
import { withRouter } from 'react-router-dom'

class CreateMeeting extends Component {

    state = {
        startDate: new Date(),
        description: '',
        location: ''

    };

    handleSubmit = event => {
        debugger
        event.preventDefault()
        const {startDate, description, location} = this.state
        return logic.addMeeting(this.props.userId, this.props.id, startDate, location, description)
            .then(() => this.props.history.push('/home'))
    }

    handleChange = date => {
        this.setState({
            startDate: date
        });
    }

    onDescriptionChange = event => {
        event.preventDefault()
        const description = event.target.value
        this.setState({description})
    }

    onLocationChange = event => {
        event.preventDefault()
        const location = event.target.value
        this.setState({location})
    }

    render() {
        return <div>
            <Navbarpage/>
            <form onSubmit={this.handleSubmit}>
                <label>What is the main goal of this meeting?</label>

                <input onChange={this.onDescriptionChange} defaultValue="have fun" type="text" id="exampleForm2" className="form-control" />

                <label>Location</label>

                <input onChange={this.onLocationChange} defaultValue="Skylab Coders Academy" type="text" cid="exampleForm2" className="form-control" />

                <label>Pick a date for your meeting</label> <br/>
                <DatePicker
                    selected={this.state.startDate}
                    onChange={this.handleChange}
                    showTimeSelect
                    dateFormat="Pp"
                />
                <Button type="submit">Create Meeting</Button>
            </form>
        </div >
    }
}

export default withRouter(CreateMeeting)