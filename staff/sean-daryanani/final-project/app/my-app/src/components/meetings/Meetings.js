import React from 'react'
import { Button } from 'mdbreact'

const Meetings = props => {

    const { meeting, project, userId, deleteMeeting, attendMeeting, unAttendMeeting } = props
    if (meeting && project) {
        return (
            <div>
                <p>Date: {meeting.date}</p>

                <p>Location: {meeting.location}</p>

                {project && (!(userId === project.owner.id)) && (!meeting.attending.includes(userId)) ? <Button type="button" onClick={() => attendMeeting(meeting.id)}>Attend</Button> : null}


                {project && (!(userId === project.owner.id)) && (meeting.attending.includes(userId)) ? (
                    <div>
                        <p>You have already signed up. Can't attend the meeting? Click here </p>
                        <Button onClick={() => unAttendMeeting(meeting.id)} type="button">Can't go</Button>
                    </div>
                ) : null}

                {project && (userId === project.owner.id) ? <Button onClick={() => deleteMeeting(meeting.id)}>Delete event</Button> : null}

            </div>
        )
    }
    else return null
}

export default Meetings