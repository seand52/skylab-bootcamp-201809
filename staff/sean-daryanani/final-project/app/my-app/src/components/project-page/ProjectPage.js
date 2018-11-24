import React, { Component } from 'react'
import logic from '../../logic'
import Navbarpage from '../navbar/Navbar'
import './projectpage.css'
import { Badge, Button } from 'mdbreact'
import Modalpage from '../modal/Modalpage'
import Collapsible from '../collapse/Collapse'
import Meetings from '../meetings/Meetings'
import CollaboratorCard from '../collaborator-card/CollaboratorCard'

class ProjectPage extends Component {
    state = {
        project: null,
        meetings: null
    }
    componentDidMount() {

        return logic.retrieveProjectInfo(this.props.id)
            .then(res => this.setState({ project: res }))
            .then(() => logic.listProjectMeetings(this.props.id))
            .then(res => this.setState({ meetings: res }))
    }

    acceptCollabHandle = (id) => {
        return logic.handleCollaboration(this.state.project.id, 'accept', id)
            .then(() => logic.retrieveProjectInfo(this.props.id))
            .then(res => this.setState({ project: res }))
    }

    rejectCollabHandle = (id) => {
        return logic.handleCollaboration(this.state.project.id, 'reject', id)
            .then(() => logic.retrieveProjectInfo(this.props.id))
            .then(res => this.setState({ project: res }))
    }

    handleDeleteMeeting = (meetingId) => {
        return logic.deleteMeeting(meetingId)
            .then(() => logic.listProjectMeetings(this.props.id))
            .then(res => this.setState({ meetings: res }))
    }

    handleAttendMeeting = (meetingId) => {
        return logic.attendMeeting(meetingId)
            .then(() => logic.listProjectMeetings(this.props.id))
            .then(res => this.setState({ meetings: res }))

    }

    handleUnAttendMeeting = (meetingId) => {
        return logic.unAttendMeeting(meetingId)
            .then(() => logic.listProjectMeetings(this.props.id))
            .then(res => this.setState({ meetings: res }))
    }

    render() {
        const { project, meetings } = this.state
        return <div>
            <Navbarpage />
            <h1>{project && project.name}</h1>
            <header className="project-top-section">
                <img className="projecct-page-project-image" src={project && project.projectImage} />
                <div className="top-section__extrainfo">
                    <div className="extrainfo-image-container">
                        <img className="project-page-profile-image" src={project && project.projectImage} />

                    </div>
                    <div className="project-page-header-additional-info">
                        <p>Attending: {project && project.currentMembers}</p>
                        <p>Hosted by: {project && project.owner.name}</p>
                        <p>Host email: {project && project.owner.email}</p>
                    </div>

                    {project && (!(this.props.userId === project.owner.id)) ? < div className="project-page-request-collaborate">
                        <p>Would you like to collaborate?</p>
                        <button>Collaborate now</button>
                    </div> : null}


                    {project && (this.props.userId === project.owner.id) ? < div className="project-page-new-meeting">
                        <p>Would you like to create a new event?</p>
                        <button>Add a new event</button>
                    </div> : null}
                </div>

            </header>
            <section className="project-page-project-info">
                <h2>Information</h2>
                <p>Beginner Friendly: {(project && project.beginnerFriendly === 'true') ? 'yes' : 'no'}</p>
                <h3>Description</h3>
                <p>{project && project.description}</p>
                <h3>Tech stack used</h3>
                {project && project.skills.map((skill, index) => <Badge color="light-blue" key={index} pill>{skill}</Badge>)}

            </section>
            {project && (this.props.userId === project.owner.id) ? <section className="project-page-pending-collaborators">
                <Collapsible accept={this.acceptCollabHandle} reject={this.rejectCollabHandle} pendingCollabs={project.pendingCollaborators} />
            </section> : null}

            <section className="project-page-meetings">
                {meetings && meetings.map((meeting, index) => {
                    return (
                        <div key={index}>
                            <Meetings unAttendMeeting={this.handleUnAttendMeeting} attendMeeting={this.handleAttendMeeting} deleteMeeting={this.handleDeleteMeeting} userId={this.props.userId} key={index} meeting={meeting} project={project} />
                            <Modalpage meetingId={meeting.id} render={'meeting attendees'}/>
                        </div>)
                })}
            </section>
            <section className="project-page-collaborators">
                {project && project.collaborators.map((collaborator, index) => <CollaboratorCard collaborator={collaborator} key={index} />)}
            </section>
        </div >
    }
}

export default ProjectPage