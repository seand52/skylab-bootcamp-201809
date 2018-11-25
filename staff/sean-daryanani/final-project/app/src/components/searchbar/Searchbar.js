import React, { Component } from 'react'
import "./searchbar.css";
import { withRouter } from 'react-router-dom'

class Searchbar extends Component {
    state = {
        query: ''
    }

    handleSubmit = event => {
        event.preventDefault()

        const {query} = this.state
        
         this.props.history.push(`/explore/${query}`)
    }

    onQueryChange = event => {
        const query = event.target.value

        this.setState({query})
    }


    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input onChange={this.onQueryChange} className="explore-searchbar" type="text" placeholder="Search" aria-label="Search" />
                <button  type="submit">Search</button>
            </form>

        )
    }

}

export default withRouter(Searchbar)