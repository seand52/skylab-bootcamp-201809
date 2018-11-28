import React, { Component } from 'react'
import logic from '../../logic'
import './projectpage.css'
import { Badge, Button } from 'mdbreact'
import Modalpage from '../modal/Modalpage'
import Collapsible from '../collapse/Collapse'
import Meetings from '../meetings/Meetings'
import CollaboratorCard from '../collaborator-card/CollaboratorCard'
import { withRouter } from 'react-router-dom'
import SkillsTag from '../skills-tag/SkillsTag'
import MeetingAttendeesModal from '../meet-attendees-modal/MeetingAttendeesModal'

class ProjectPage extends Component {
    state = {
        project: null,
        meetings: null,
        user: null,
        projectImage: null
    }
    componentDidMount() {
        debugger
        return logic.retrieveProjectInfo(this.props.id)
            .then(res => this.setState({ project: res }))
            .then(() => logic.listProjectMeetings(this.props.id))
            .then(res => this.setState({ meetings: res }))
            .then(() => logic.retrieveUserProfile(this.state.project.owner.id))
            .then(res => this.setState({ user: res }))
            .then(() => logic.retrieveProjectImage(this.props.userId, this.props.id))
            .then(res => this.setState({ projectImage: res }))
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

    handleSaveProject = () => {
        const { id, userId } = this.props
        return logic.saveProject(id, userId)
            .then(() => logic.retrieveUserProfile(userId))
            .then(res => this.setState({ user: res }))
    }

    handleUnFollowProjects = () => {
        const { id, userId } = this.props
        return logic.removeSavedProject(id, userId)
            .then(() => logic.retrieveUserProfile(userId))
            .then(res => this.setState({ user: res }))
    }


    handleSearchTag = (query) => {

        const searchQuery = `q=&f=${query}`
        this.props.history.push(`/explore/${searchQuery}`)
    }

    handleRemoveCollaborator = (collaboratorId) => {
        return logic.removeCollaborator(collaboratorId, this.props.id)
            .then(() => logic.retrieveProjectInfo(this.props.id))
            .then(res => this.setState({ project: res }))
    }


    renderCollabButtons = () => {

        const { state: { project }, props: { userId } } = this
        if (project) {

            if (project.collaborators.some(item => item.id === userId)) {
                return (< div className="project-page-new-meeting">
                    <p>Would you like to leave this project?</p>
                    <Button onClick={this.handleLeaveProject}>Leave project</Button>
                </div>)
            } else if (!project.collaborators.some(item => item.id === userId) && !(project.pendingCollaborators.some(item => item.id === userId))) {
                return (
                    < div className="project-page-new-meeting">
                        <p>Would you like to collaborate?</p>
                        <Button onClick={this.handleRequestCollaboration}>Collaborate now</Button>
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

    clickProfileName = (event, id) => {

        if (!id) this.props.history.push(`/profile/${this.state.user.id}`)
        else this.props.history.push(`/profile/${id}`)

    }

    calculateCommonInterests = () => {
        const { project, user } = this.state
        if (user && project) {

            const res = project.skills.filter(value => -1 !== user.skills.indexOf(value));
            if (res.length) return `Matches with ${(res.length / user.skills.length).toFixed(2) * 100}% of your interests`
            else return 'does not match with any of your interests :('

        }


    }

    uploadImage = event => {

        return logic.addProjectImage(event.target.files[0], this.props.id)
            .then(() => logic.retrieveProjectImage(this.props.userId, this.props.id))
            .then(projectImage => {

                this.setState({ projectImage })}, () => console.log('uploaded'))
    }

    renderFavouritesButtons = () => {
        const { state: { user, project }, props: { userId, id } } = this

        if (user) {
            if (user.savedProjects.includes(id) && !project.collaborators.some(item => item.id === userId)) {
                return (<div className="project-page-new-meeting">
                    <p>You have saved this project. Click to unfollow</p>
                    <Button onClick={this.handleUnFollowProjects}>Unfollow</Button>
                </div>)
            } else if (!(user.savedProjects.includes(id)) && !project.collaborators.some(item => item.id === userId)) {
                return (< div className="project-page-new-meeting">
                    <p>Save the project to view later</p>
                    <Button onClick={this.handleSaveProject}>Save Project</Button>
                </div>)
            }
        }
    }

    getImageId = () => {
        if (this.state.project) return this.state.project.projectImage
    }

    handleAddNewEvent = () => {

        this.props.history.push(`/create-event/${this.props.id}`)
    }

    render() {
        const { project, meetings, user, projectImage } = this.state
        console.log(projectImage)
        return <div>
            <h1>{project && project.name}</h1>
            <header className="project-top-section">
                <div className="project-image-container">
                    <img src={projectImage ? projectImage : null} />
                </div>
                <div className="top-section__extrainfo">

                    <div className="project-page-header-additional-info">
                        <div className="extrainfo-image-container">
                            <img className="extrainfo__image-profile" src={user && user.profileImage} alt="profile" />
                            <form encType="multipart/form-data" onSubmit={this.uploadImage}>
                                <input type="file" name="avatar" onChange={this.uploadImage} />
                            </form>
                        </div>
                        <span>Hosted by</span><p className="project-page-header-additional-info__user-link" onClick={this.clickProfileName}>{project && project.owner.name}</p>
                        <span>Host email:</span>{project && project.owner.email}
                    </div>

                    {project && (!(this.props.userId === project.owner.id)) && this.renderCollabButtons()}
                    {project && (!(this.props.userId === project.owner.id)) && this.renderFavouritesButtons()}


                    {project && (this.props.userId === project.owner.id) ? < div className="project-page-new-meeting">
                        <p>Would you like to create a new event?</p>
                        <Button onClick={this.handleAddNewEvent}>Add a new event</Button>
                    </div> : null}

                    {project && (this.props.userId === project.owner.id) ? < div className="project-page-new-meeting">
                        <p>Would you like to delete this project?</p>
                        <Button onClick={this.handleDeleteProject}>Delete project</Button>
                    </div> : null}

                </div>

            </header>
            <section className="project-page-info-container">
                <section className="project-page-project-info">
                    <h2>Information</h2>
                    <p>Beginner Friendly: {(project && project.beginnerFriendly === 'true') ? 'yes' : 'no'}</p>
                    <h3>Description</h3>
                    <p>{project && project.description}</p>
                    <h3>Tech stack used</h3>
                    {project && project.skills.map((skill, index) => <SkillsTag searchTag={this.handleSearchTag} key={index} skill={skill} />)}
                    <p>{this.calculateCommonInterests()}</p>
                </section>
                <section className="project-page-meetings">
                    <h2>Upcoming Meetings</h2>
                    {meetings && meetings.sort((a, b) => a.realDate - b.realDate).map((meeting, index) => {
                        return (
                            <div className="individual-meeting-container" key={index}>
                                <Meetings unAttendMeeting={this.handleUnAttendMeeting} attendMeeting={this.handleAttendMeeting} deleteMeeting={this.handleDeleteMeeting} userId={this.props.userId} key={index} meeting={meeting} project={project} />
                                <MeetingAttendeesModal clickName={this.clickProfileName} meetingId={meeting.id} />
                            </div>)
                    })}
                </section>
            </section>


            <section className="project-page-collaborators">
                <h1>Current Collaborators</h1>
                <div className="project-page-collaborators-display">
                    {project && project.collaborators.map((collaborator, index) => <CollaboratorCard clickName={this.clickProfileName} collaborator={collaborator} key={index} userId={this.props.userId} ownerId={project.owner.id} removeCollaborator={this.handleRemoveCollaborator} />)}
                </div>
            </section>
            {project && (this.props.userId === project.owner.id) ? <section className="project-page-pending-collaborators">
                <Collapsible clickName={this.clickProfileName} accept={this.acceptCollabHandle} reject={this.rejectCollabHandle} pendingCollabs={project.pendingCollaborators} />
            </section> : null}

        </div >
    }
}

export default withRouter(ProjectPage)