import React, { Component } from 'react'
import logic from '../../logic'
import './meeting-attendees.css'
import {withRouter, Link} from 'react-router-dom'
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
        {meeting && meeting.attending.map((attendee, index) => <Link to={`/profile/${attendee.id}`}> <p onClick={this.props.clickName} key={index}>{attendee.name}</p></Link>)}
        </div>
    }
}

export default withRouter(MeetingAttendees)