import React, { Component } from 'react'
import './home.css'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import logic from '../../logic'
import ProjectCard from '../project-card/ProjectCard'
import CreateProject from '../create-project/CreateProject'
import { withRouter, Link } from 'react-router-dom'

class Home extends Component {
    state = {
        tabIndex: 0,
        collabProjects: null,
        ownProjects: null,
        savedProjects: null,
        user: false,

    }

    componentDidMount() {

        logic.listOwnProjects()
            .then(res => this.setState({ ownProjects: res }))
            .then(() => logic.retrieveUserProfile(this.props.userId))
            .then(res => this.setState({ user: res }))
    }

    sendToMyProjects = () => {
        return logic.listOwnProjects()
            .then(res => this.setState({ ownProjects: res, tabIndex: 0 }))

    }

    handleTabChange = tabIndex => {

        switch (tabIndex) {
            case 0:
                logic.listOwnProjects()
                    .then(res => this.setState({ ownProjects: res, tabIndex }))
                    window.scrollTo(0, 0)
                break
            case 1:
                logic.listCollaboratingProjects()
                    .then(res => this.setState({ collabProjects: res, tabIndex }))
                    window.scrollTo(0, 0)
                break
            case 2:
                logic.listSavedProjects()
                    .then(res => this.setState({ savedProjects: res, tabIndex }))
                    window.scrollTo(0, 0)
                break
            case 3:
                this.setState({ tabIndex })
                window.scrollTo(0, 0)
                break
            default:

        }
    }

    handleSearchTag = (query) => {

        const searchQuery = `q=&f=${query}`
        this.props.history.push(`/explore/${searchQuery}`)
    }


    render() {
        const { collabProjects, ownProjects, savedProjects, user } = this.state
        return <div className="home-page-container">
            <Tabs selectedIndex={this.state.tabIndex} onSelect={this.handleTabChange}>

                <TabList>
                    <Tab>My Projects</Tab>
                    <Tab>My Collaborations </Tab>
                    <Tab>Saved Projects</Tab>
                    <Tab>Create a project</Tab>
                </TabList>

                <TabPanel>
                    <div className="home-myprojects-display">
                        {ownProjects && (ownProjects.length ? ownProjects.map((project, index) => <ProjectCard  userId={this.props.userId} searchTag={this.handleSearchTag} key={index} project={project} />) : <p className="no-projects-text">You don't have any projects. Start searching <Link to='/explore'>now</Link></p>)}
                    </div>
                </TabPanel>

                <TabPanel>
                    <div className="home-collaborations-display">
                        {collabProjects && (collabProjects.length ? collabProjects.map((project, index) => <ProjectCard userId={this.props.userId} savedProjects={user.savedProjects} searchTag={this.handleSearchTag} key={index} project={project} />) : <p className="no-projects-text">You don't have any projects. Start searching <Link to='/explore'>now</Link></p>)}
                    </div>
                </TabPanel>

                <TabPanel>
                    <div className="home-savedprojects-display">
                        {savedProjects && (savedProjects.length ? savedProjects.map((project, index) => <ProjectCard userId={this.props.userId} searchTag={this.handleSearchTag} key={index} project={project} />) : <p className="no-projects-text">You don't have any projects. Start searching <Link to='/explore'>now</Link></p>)}
                    </div>
                </TabPanel>

                <TabPanel>
                    <CreateProject backToMyProject={this.sendToMyProjects} />
                </TabPanel>
            </Tabs>
        </div>
    }

}

export default withRouter(Home)