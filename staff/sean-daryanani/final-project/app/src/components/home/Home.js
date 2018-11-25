import React, { Component } from 'react'
import './home.css'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import logic from '../../logic'
import ProjectCard from '../project-card/ProjectCard'
import CreateProject from '../create-project/CreateProject'

class Home extends Component {
    state = {
        tabIndex: 0,
        collabProjects: null,
        ownProjects: null,
        savedProjects: null,

    }

    componentDidMount() {
        logic.listOwnProjects()
            .then(res => this.setState({ ownProjects: res }))
    }

    handleTabChange = tabIndex => {

        switch (tabIndex) {
            case 0:
                logic.listOwnProjects()
                    .then(res => this.setState({ ownProjects: res, tabIndex }))
                break
            case 1:
                logic.listCollaboratingProjects()
                    .then(res => this.setState({ collabProjects: res, tabIndex }))
                break
            case 2:
                logic.listSavedProjects()
                    .then(res => this.setState({ savedProjects: res, tabIndex }))
                break
            case 3:
                this.setState({ tabIndex })
                break
            default:

        }


    }

    render() {
        const { collabProjects, ownProjects, savedProjects } = this.state
        return <div>
            <Tabs selectedIndex={this.state.tabIndex} onSelect={this.handleTabChange}>

                <TabList>
                    <Tab>My Projects</Tab>
                    <Tab>My Collaborations </Tab>
                    <Tab>Saved Projects</Tab>
                    <Tab>Create a project</Tab>
                </TabList>

                <TabPanel>
                    <div className="home-myprojects-display">
                        {ownProjects && ownProjects.map((project, index) => <ProjectCard key={index} project={project} />)}
                    </div>
                </TabPanel>

                <TabPanel>
                    <div className="home-collaborations-display">
                        {collabProjects && collabProjects.map((project, index) => <ProjectCard key={index} project={project} />)}
                    </div>
                </TabPanel>

                <TabPanel>
                    <div className="home-savedprojects-display">
                        {savedProjects && savedProjects.map((project, index) => <ProjectCard key={index} project={project} />)}
                    </div>
                </TabPanel>

                <TabPanel>
                    <CreateProject/>
                </TabPanel>
            </Tabs>
        </div>
    }

}

export default Home