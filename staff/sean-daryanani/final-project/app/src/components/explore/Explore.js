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
    'Vue',
    'SQL',
    'Mongoose',
    'Ruby',
    'Swift',
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

    onSearchNameQueryChange = event => {
        const searchQuery = event.target.value
        this.setState({searchQuery})
    }

    handleSubmit = event => {
        debugger
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
        return <div className="explore-container">
            <header className="explore-header col-12">
                <div className="searchbar-container col-6">
                    <div className="explore-search-form">
                    <form onSubmit={this.handleSubmit}>
                        <label className="explore-search-form__label">
                            <input onChange={this.onSearchNameQueryChange} className="input-group-text explore-searchbar" type="text" placeholder="Search by project name" aria-label="Search" />
                            <button type="submit" className="explore-search-button">Search</button>
                        </label>
                        </form>
                    </div>
                </div>
            </header>
            <div className="main-explore-area row">
                <div className="filters col-3">

                    <h1>What are you looking to learn?</h1>
                    <div className='filter-skills'>
                        
                            {skills.map(skill => <Checkbox label={skill} handleCheckboxChange={this.toggleCheckbox} key={skill} selected={this.selectedCheckboxes} />)}
                            <h1>Filter by city</h1>
                            <input className="search-city-input" onChange={this.onCityFilterChange} type="text" />
                    </div>

                </div>
                <div className="search-area col-8">
                    {/* <div className="search-results"> */}
                    {this.state.searchResults && this.state.searchResults.map((project, index) => <ProjectCard searchTag={this.handleSearchTag} key={index} project={project} />)}
                    {/* </div> */}
                </div>
            </div>
        </div>

    }
}

export default withRouter(Explore)