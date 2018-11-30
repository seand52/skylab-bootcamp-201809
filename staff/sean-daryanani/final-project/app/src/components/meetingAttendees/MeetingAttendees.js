import React, { Component } from 'react'
import logic from '../../logic'
import './meeting-attendees.css'
class MeetingAttendees extends Component {
    state = {
        meeting: null
    }

    componentWillReceiveProps(props) {
        try {

            logic.retrieveMeetingInfo(props.meetingId)
            .then(res => this.setState({meeting: res}))
        } catch(err) {
            console.error(err)
        }
    }

    componentDidMount() {
        try {

            logic.retrieveMeetingInfo(this.props.meetingId)
            .then(res => this.setState({meeting: res}))
        } catch(err) {
            console.error(err)
        }
    }

    render() {
        const {meeting} = this.state
        return <div className="attendees-list">
        {meeting && meeting.attending.map((attendee, index) => <p onClick={this.props.clickName} key={index}>{attendee.name}</p>)}
        </div>
    }
}

export default MeetingAttendees