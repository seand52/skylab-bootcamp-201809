import React, { Component } from 'react'
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
    'C-Sharp',
    'Python',
    'PHP',
    'React',
    'Angular',
    'Vue'
]

class Explore extends Component {
    state = {
        searchResults: null,
        searchQuery: '',
        cityQuery: '',
    }
    componentWillMount = () => {

        this.selectedCheckboxes = new Set();

    }

    componentDidMount() {
        if (this.props.query !== undefined) {
            logic.filterProjects(this.props.query)
                .then(res => {
                    this.setState({ searchResults: res })

                })
        }
    }

    queryListen = (query) => {
        this.setState({ searchQuery: query })
    }

    componentWillReceiveProps(props) {
        if (props.query !== undefined) {
            logic.filterProjects(props.query)
                .then(res => {
                    this.setState({ searchResults: res })

                })
        }
    }

    toggleCheckbox = label => {

        if (this.selectedCheckboxes.has(label)) {

            this.selectedCheckboxes.delete(label);

        } else {

            this.selectedCheckboxes.add(label);
        }
    }

    onCityFilterChange = event => {
        const city = event.target.value

        this.setState({ cityQuery: city })

    }
    handleSubmit = event => {

        event.preventDefault()
        
        const { searchQuery, cityQuery } = this.state
        let skillsArray = []

        for (const checkbox of this.selectedCheckboxes) {

            skillsArray.push(checkbox)
        }
        // const search = searchQuery

        let query = `q=${searchQuery}&f=${skillsArray.join('+')}&c=${cityQuery}`

        // if (!skillsArray.length) query = `q=${search}`
        // else query = `q=${search}&f=${skillsArray.join('+')}`



        this.props.history.push(`/explore/${query}`)

    }


    handleSearchTag = (query) => {

        const searchQuery = `q=&f=${query}`
        this.props.history.push(`/explore/${searchQuery}`)
    }
    render() {
        return <div>
            <div className="explore-container">
                <div className="filters">
                    <div>
                        <Searchbar searchQuery={this.queryListen} />
                    </div>
                    <h1>What are you looking to learn?</h1>
                    <div className='filter-skills'>
                        <form onSubmit={this.handleSubmit}>
                            {skills.map(skill => <Checkbox label={skill} handleCheckboxChange={this.toggleCheckbox} key={skill} selected={this.selectedCheckboxes} />)}
                            <h1>Filter by city</h1>
                            <input onChange={this.onCityFilterChange} type="text" />
                            <Button type="submit" color="primary">Search now</Button>
                        </form>
                    </div>

                </div>
                <div className="search-area">
                    {/* <div className="search-results"> */}
                    {this.state.searchResults && this.state.searchResults.map((project, index) => <ProjectCard searchTag={this.handleSearchTag} key={index} project={project} />)}
                    {/* </div> */}
                </div>
            </div>
        </div>
    }
}

export default withRouter(Explore)