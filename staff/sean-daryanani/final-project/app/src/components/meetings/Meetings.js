import React from 'react'
import { Button } from 'mdbreact'

const Meetings = props => {



    const { meeting, project, userId, deleteMeeting, attendMeeting, unAttendMeeting } = props
    if (meeting && project) {
        return (
            <div className="meeting-actions row">
                <div className="meeting-details col-8">
                    <p><span>Date</span>: {meeting.listDate}</p>

                    <p><span>Description</span>: {meeting.description}</p>

                    <p><span>Location</span>: {meeting.location}</p>
                </div>
                <div className="meeting-buttons col-3">
                    {project && (!(userId === project.owner.id)) && (!meeting.attending.includes(userId)) && (project.collaborators.find(item => item.id===userId)!==undefined) ? <Button type="button" onClick={() => attendMeeting(meeting.id)}>Attend</Button> : null}


                    {project && (!(userId === project.owner.id)) && (meeting.attending.includes(userId)) ? (
                        <div>
                            <p>You have already signed up. Can't attend the meeting? Click here </p>
                            <Button onClick={() => unAttendMeeting(meeting.id)} type="button">Can't go</Button>
                        </div>
                    ) : null}
                    {project && (userId === project.owner.id) ? <button className="delete-meeting-button" onClick={() => deleteMeeting(meeting.id)}><i className="fa fa-remove" aria-hidden="true"></i></button> : null}
                </div>

            </div>
        )
    }
    else return null
}

export default Meetings