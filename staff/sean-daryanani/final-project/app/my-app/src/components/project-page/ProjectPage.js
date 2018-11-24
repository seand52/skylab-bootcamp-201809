import React, { Component } from 'react'
import logic from '../../logic'
import Navbarpage from '../navbar/Navbar'
import './projectpage.css'
import { Badge, Button } from 'mdbreact'
import Modalpage from '../modal/Modalpage'
import Collapsible from '../collapse/Collapse'
import Meetings from '../meetings/Meetings'
import CollaboratorCard from '../collaborator-card/CollaboratorCard'
import { withRouter } from 'react-router-dom'

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

    handleDeleteProject = () => {
        const { userId, id } = this.props
        return logic.deleteProject(userId, id)
            .then(() => this.props.history.push('/home'))
    }

    handleLeaveProject = () => {
        const { id } = this.props
        return logic.leaveProject(id)
            .then(() => logic.retrieveProjectInfo(this.props.id))
            .then(res => this.setState({ project: res }))
    }

    handleRequestCollaboration = () => {
        const { id, userId } = this.props
        return logic.requestCollaboration(id, userId)
            .then(() => logic.retrieveProjectInfo(this.props.id))
            .then(res => this.setState({ project: res }))
    }

    renderCollabButtons = () => {

        const { state: { project }, props: { userId } } = this
        if (project) {

            if (project.collaborators.some(item => item.id === userId)) {
                return (< div className="project-page-new-meeting">
                    <p>Would you like to leave this project?</p>
                    <button onClick={this.handleLeaveProject}>Leave project</button>
                </div>)
            } else if (!project.collaborators.some(item => item.id === userId) && !(project.pendingCollaborators.some(item => item.id === userId))) {
                return (
                    < div className="project-page-request-collaborate">
                        <p>Would you like to collaborate?</p>
                        <button onClick={this.handleRequestCollaboration}>Collaborate now</button>
                    </div>
                )
            } else {
                return (
                    < div className="project-page-request-collaborate">
                        <p>Your collaboration request is pending</p>
                    </div>
                )
            }
        }
    }

    handleAddNewEvent = () => {
        this.props.history.push('/create-event')
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

                    {project && (!(this.props.userId === project.owner.id)) && this.renderCollabButtons()}

                    {project && (this.props.userId === project.owner.id) ? < div className="project-page-new-meeting">
                        <p>Would you like to create a new event?</p>
                        <button onClick={this.handleAddNewEvent}>Add a new event</button>
                    </div> : null}

                    {project && (this.props.userId === project.owner.id) ? < div className="project-page-new-meeting">
                        <p>Would you like to delete this project?</p>
                        <button onClick={this.handleDeleteProject}>Delete project</button>
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
                            <Modalpage meetingId={meeting.id} render={'meeting attendees'} />
                        </div>)
                })}
            </section>
            <section className="project-page-collaborators">
                <h1>Current Collaborators</h1>
                {project && project.collaborators.map((collaborator, index) => <CollaboratorCard collaborator={collaborator} key={index} />)}
            </section>
        </div >
    }
}

export default withRouter(ProjectPage)