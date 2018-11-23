import React, { Component } from 'react'
import Navbarpage from '../navbar/Navbar'
import Searchbar from '../searchbar/Searchbar'
import Checkbox from '../checkbox/Checkbox'
import { Button } from 'mdbreact'
import './explore.css'
import logic from '../../logic'
import { withRouter } from 'react-router-dom'
import ProjectCard from '../project-card/ProjectCard'


const skills = [
    'Java',
    'Javascript',
    'C#',
    'C++',
    'Python',
    'PHP',
    'React',
    'Angular',
    'Vue'
]

class Explore extends Component {
    state = {
        searchResults: null
    }
    componentWillMount = () => {

        this.selectedCheckboxes = new Set();

    }

    componentDidMount() {
        if (this.props.query && !this.props.query.includes('+')) {
            logic.searchProjects(this.props.query)
                .then(res => {
                    this.setState({ searchResults: res })

                })
        }
    }

    componentWillReceiveProps(props) {

        if (this.props.query && !props.query.includes('+')) {
            logic.searchProjects(props.query)
                .then(res => {
                    this.setState({ searchResults: res })

                })
        } else {
            logic.filterProjects(props.query)
                .then(res => this.setState({ searchResults: res }))
        }
    }

    toggleCheckbox = label => {

        if (this.selectedCheckboxes.has(label)) {

            this.selectedCheckboxes.delete(label);

        } else {

            this.selectedCheckboxes.add(label);
        }
    }

    handleSubmit = event => {

        event.preventDefault()

        let skillsArray = []

        for (const checkbox of this.selectedCheckboxes) {

            skillsArray.push(checkbox)
        }

        const query = skillsArray.join('+')

        this.props.history.push(`/explore/${query}`)

    }
    render() {
        return <div>
            <Navbarpage />
            <div className="explore-container">
                <div className="filters">
                    <h1>What are you looking to learn?</h1>
                    <div className='filter-skills'>
                        <form onSubmit={this.handleSubmit}>
                            {skills.map(skill => <Checkbox label={skill} handleCheckboxChange={this.toggleCheckbox} key={skill} selected={this.selectedCheckboxes} />)}
                            <Button type="submit" color="primary">Search now</Button>
                        </form>
                    </div>
                </div>
                <div className="search-area">
                    <div>
                        <Searchbar />
                    </div>
                    <div className="search-results">
                        {this.state.searchResults && this.state.searchResults.map((project, index) => <ProjectCard key={index} project={project} />)}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default withRouter(Explore)