import React, { Component } from 'react'
import logic from '../../logic'
class MeetingAttendees extends Component {
    state = {
        meeting: null
    }

    componentWillReceiveProps(props) {
        logic.retrieveMeetingInfo(props.meetingId)
        .then(res => this.setState({meeting: res}))
    }

    componentDidMount() {
        logic.retrieveMeetingInfo(this.props.meetingId)
        .then(res => this.setState({meeting: res}))
    }

    render() {
        const {meeting} = this.state
        return <div>
        {meeting && meeting.attending.map((attendee, index) => <p key={index}>{attendee.name}</p>)}
        </div>
    }
}

export default MeetingAttendees