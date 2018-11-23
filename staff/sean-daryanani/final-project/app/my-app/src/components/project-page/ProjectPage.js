import React, { Component } from 'react'
import logic from '../../logic'
import Navbarpage from '../navbar/Navbar'
import './projectpage.css'
import { Badge } from 'mdbreact'
class ProjectPage extends Component {
    state = {
        project: null
    }
    componentDidMount() {

        logic.retrieveProjectInfo(this.props.id)
            .then(res => this.setState({ project: res }))
    }

    render() {
        const { project } = this.state
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
                        <p>Hosted by: {project && project.owner}</p>
                    </div>
                    <div className="project-page-request-collaborate">
                        <p>Would you like to collaborate?</p>
                        <button>Collaborate now</button>
                    </div>

                    <div className="project-page-new-meeting">
                        <p>Would you like to create a new event?</p>
                        <button>Add a new event</button>
                    </div>
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
            <section className="project-page-pending-collaborators">
                {project && (project.pendingCollaborators.length ?  project.pendingCollaborators.map(collaborator => <p>{collaborator}</p>) : <p>No collaborators pending</p>)}
            </section>
        </div>
    }
}

export default ProjectPage