import React, { Component } from 'react'
import './profile.css'
import logic from '../../logic'
import { Badge } from 'mdbreact'
import ProfileCard from '../profile-card/ProfileCard'
import ProjectCard from '../project-card/ProjectCard'
import Modalpage from '../modal/Modalpage'
import SkillsTag from '../skills-tag/SkillsTag'
import { withRouter } from 'react-router-dom'

class Profile extends Component {

    state = {
        user: null,
        ownProjects: false,
        collabProjects: false,
        showProjects: 'my projects'
    }

    componentDidMount() {
        const { id } = this.props
        Promise.all([logic.retrieveUserProfile(id), logic.listCollaboratingProjects(id), logic.listOwnProjects(id)])
            .then(res => {
                this.setState({ user: res[0], collabProjects: res[1], ownProjects: res[2] })
            })
    }

    componentWillReceiveProps(props) {

        const { id } = props
        Promise.all([logic.retrieveUserProfile(id), logic.listCollaboratingProjects(id), logic.listOwnProjects(id)])
            .then(res => {
                this.setState({ user: res[0], collabProjects: res[1], ownProjects: res[2] })
            })
    }

    sendProfileUpdate = (city, github, bio, skills) => {
        const { id } = this.props
        return logic.updateProfile(id, city, github, bio, skills)
            .then(() => logic.retrieveUserProfile(id))
            .then(res => {
                this.setState({ user: res })
            })
    }

    // renderModal = () => {

    //     const { state: { user }, props: { userId, id } } = this
    //     if (user) {
    //         if (id === userId) {
    //             return <Modalpage user={user} updateProfile={this.sendProfileUpdate} render={'profile update'} />
    //         } else {
    //             return null
    //         }
    //     }
    // }

    handleShowCollabProjects = () => {

        const { id } = this.props
        return logic.listCollaboratingProjects(id)
            .then(res => this.setState({ collabProjects: res, showProjects: 'collab projects' }))
    }

    handleshowOwnProjects = () => {
        const { id } = this.props
        return logic.listOwnProjects(id)
            .then(res => this.setState({ ownProjects: res, showProjects: 'my projects' }))
    }

    renderTitle = () => {

        const {user, showProjects} = this.state

        if (user) {
            if (showProjects==='my projects') {
                return <h1>{user.name}'s projects</h1>
            } else {
                return <h1>{user.name}'s collaborations</h1>
            }
        }
    }

    handleSearchTag = (query) => {

        const searchQuery = `q=&f=${query}`
        this.props.history.push(`/explore/${searchQuery}`)
    }


    render() {


        const { state: { user, ownProjects, collabProjects, showProjects }, props: { id, userId } } = this


        return <div className="profile-page-container">
            <section className="profile-top-area">

                <ProfileCard showCollabProjects={this.handleShowCollabProjects} user={user} myProjects={ownProjects} projectsStarted={this.handleshowOwnProjects} collabProjects={collabProjects} />

                <section className="bio">
                    <div className="bio__extra-info">
                        <p><span>Bio</span>:{user && user.bio}</p>
                        <span>Github:</span> <a href="https://github.com">{user && user.githubProfile}</a>
                        <Modalpage user={user} updateProfile={this.sendProfileUpdate}/>
                    </div>
                    <div className="bio__interests">
                        <h2>Interests</h2>
                        <div className="skills-tag-container">
                            {user && user.skills.map((skill, index) => <SkillsTag searchTag={this.handleSearchTag} skill={skill} key={index} />)}
                        </div>
                    </div>
                </section>

            </section>

            <section className="main-area">
                <div className="main-area__title">
                    {this.renderTitle()}

                </div>
                <div className="main-area__projects">
                    {ownProjects && (showProjects === 'my projects') && ownProjects.map((project, index) => <ProjectCard searchTag={this.handleSearchTag} key={index} project={project} />)}
                    {collabProjects && (showProjects === 'collab projects') && collabProjects.map((project, index) => <ProjectCard searchTag={this.handleSearchTag} key={index} project={project} />)}

                </div>
            </section>
        </div>
    }

}

export default withRouter(Profile)