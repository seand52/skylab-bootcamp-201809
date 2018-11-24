import React, { Component } from 'react'
import Navbarpage from '../navbar/Navbar'
import './profile.css'
import logic from '../../logic'
import { Badge } from 'mdbreact'
import ProfileCard from '../profile-card/ProfileCard'
import ProjectCard from '../project-card/ProjectCard'
import Modalpage from '../modal/Modalpage'


class Profile extends Component {

    state = {
        user: null,
        ownProjects: false,
        collabProjects: false
    }

    componentDidMount() {
        Promise.all([logic.retrieveUserProfile(), logic.listCollaboratingProjects(), logic.listOwnProjects()])
            .then(res => {
                this.setState({ user: res[0], collabProjects: res[1], ownProjects: res[2] })
            })
    }

    sendProfileUpdate = (city, github, bio, skills) => {

        return logic.updateProfile(city, github, bio, skills)
            .then(() => logic.retrieveUserProfile())
            .then(res => {
                this.setState({ user: res })
            })
    }


    render() {


        const { user, ownProjects, collabProjects } = this.state


        return <div>

            <Navbarpage />

            <ProfileCard user={user} myProjects={ownProjects} collabProjects={collabProjects} />

            <Modalpage user={user} updateProfile={this.sendProfileUpdate} render={'profile update'} />

            <section className="main-area">
                {ownProjects && ownProjects.map((project, index) => <ProjectCard key={index} project={project} /> )}
                

                <div className="right-section">

                    <section className="bio">
                        <h2>Bio</h2>
                        <p>{user && user.bio}</p>
                    </section>
                    <section className="interests">
                        <h2>Interests</h2>
                        {user && user.skills.map((skill, index) => <Badge color="light-blue" key={index} pill>{skill}</Badge>)}
                    </section>
                </div>
            </section>
        </div>
    }

}

export default Profile