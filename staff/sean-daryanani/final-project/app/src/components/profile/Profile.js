import React, { Component } from 'react'
import './profile.css'
import logic from '../../logic'
import { Badge } from 'mdbreact'
import ProfileCard from '../profile-card/ProfileCard'
import ProjectCard from '../project-card/ProjectCard'
import Modalpage from '../modal/Modalpage'
import SkillsTag from '../skills-tag/SkillsTag'
import { withRouter, Link } from 'react-router-dom'


import Meetings from '../meetings/Meetings'

class Profile extends Component {

    state = {
        user: null,
        ownProjects: false,
        collabProjects: false,
        upComingMeetings: false,
        showProjects: 'my projects',
        image: false
    }

    componentDidMount() {
        const { id } = this.props
        Promise.all([logic.retrieveUserProfile(id), logic.retrievePendingCollaboratorProjects(id), logic.listOwnProjects(id), logic.retrieveProfileImage(id)])
            .then(res => {
                this.setState({ user: res[0], collabProjects: res[1], ownProjects: res[2], image: res[3] })
            })
    }

    componentWillReceiveProps(props) {

        const { id } = props
        Promise.all([logic.retrieveUserProfile(id), logic.retrievePendingCollaboratorProjects(id), logic.listOwnProjects(id)])
            .then(res => {
                this.setState({ user: res[0], collabProjects: res[1], ownProjects: res[2] })
            })
    }

    sendProfileUpdate = (city, github, bio, skills) => {
        const { id } = this.props
        debugger
        return logic.updateProfile(id, city, github, bio, skills)
            .then(() => logic.retrieveUserProfile(id))
            .then(res => {
                this.setState({ user: res })
            })
    }

    handleShowCollabProjects = () => {
        const { id } = this.props
        return logic.retrievePendingCollaboratorProjects(id)
            .then(res => this.setState({ collabProjects: res, showProjects: 'collab projects' }))
    }

    handleshowOwnProjects = () => {
        const { id } = this.props
        return logic.listOwnProjects(id)
            .then(res => this.setState({ ownProjects: res, showProjects: 'my projects' }))
    }

    handleUpComingMeetings = (id) => {

        return logic.userUpcomingMeetings(id)
            .then(result => this.setState({ upComingMeetings: result, showProjects: 'meetings' }))
    }

    renderTitle = () => {

        const { user, showProjects } = this.state

        if (user) {
            if (showProjects === 'my projects') {
                return <h1>{user.name}'s projects</h1>
            }
            else if (showProjects === 'collab projects') {
                return <h1>Projects with pending collaborators</h1>
            } else {
                return <h1>Upcoming Meetings</h1>
            }
        }
    }

    goToMeetingProject = () => {

    }

    handleSearchTag = (query) => {

        const searchQuery = `q=&f=${query}`
        this.props.history.push(`/explore/${searchQuery}`)
    }

    handleUpload = event => {

        return logic.addProfileImage(event.target.files[0])
            .then(image => {

                return logic.retrieveUserProfile(this.props.id)
                    .then(res => {

                        debugger
                        this.setState({user: res})}, () => console.log('finished setstate'))
            })
    }

    render() {


        const { state: { user, ownProjects, collabProjects, showProjects, image, upComingMeetings }, props: { id, userId } } = this


        return <div className="profile-page-container">
            <div className="row">
                <section className="profile-top-area  col-4">
                    <ProfileCard uploadImage={this.handleUpload} showCollabProjects={this.handleShowCollabProjects} user={user} myProjects={ownProjects} projectsStarted={this.handleshowOwnProjects} collabProjects={collabProjects} userId={userId} profileImage={image} meetings={this.handleUpComingMeetings} numberOfMeetings={upComingMeetings.length} />

                    <section className="bio col-12">
                        <div className="bio__extra-info col-12">
                            <p><span>Bio</span>:{user && user.bio}</p>
                            <p><span>Github:</span> <a href="https://github.com">{user && user.githubProfile}</a></p>
                            <div className="bio__interests">
                                <h2>Interests</h2>
                                <div className="skills-tag-container">
                                    {user && user.skills.map((skill, index) => <SkillsTag searchTag={this.handleSearchTag} skill={skill} key={index} />)}
                                </div>
                            </div>
                            {user && (user.id === userId) && <Modalpage className="testt" user={user} updateProfile={this.sendProfileUpdate} />}
                        </div>
                    </section>

                </section>

                <section className="main-area col-7">
                    <div className="main-area__title">
                        {this.renderTitle()}

                    </div>
                    <div className="main-area__projects">
                        {ownProjects && (showProjects === 'my projects') && ownProjects.map((project, index) => <ProjectCard searchTag={this.handleSearchTag} key={index} project={project} />)}
                        {collabProjects && (showProjects === 'collab projects') && collabProjects.map((project, index) => <ProjectCard searchTag={this.handleSearchTag} key={index} project={project} />)}
                        {upComingMeetings && (showProjects === 'meetings') && upComingMeetings.map((meeting, index) => {
                            return (<div className="profile-meetup-card col-md-8" key={index}>
                                <p><b>Description</b>: {meeting.description}</p>
                                <p><b>Project: </b><Link to={`/project/${meeting.project.id}`}>{meeting.project.name}</Link></p>
                                <p><b>Location</b>: {meeting.location}</p>
                                <p><b>Date</b>: {meeting.realDate.toString()}</p>
                                <p>Attending: {meeting.attending.length}</p>

                            </div>)
                        })}

                    </div>
                </section>
            </div>
        </div>
    }

}

export default withRouter(Profile)