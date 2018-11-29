// import React, { Component } from 'react'
// import "./searchbar.css";
// import { withRouter } from 'react-router-dom'
// import {Input} from 'mdbreact'

// class Searchbar extends Component {
//     state = {
//         query: ''
//     }

//     handleSubmit = event => {
//         event.preventDefault()

//         // const {query} = this.state
        
//         //  this.props.history.push(`/explore/${query}`)
//     }

//     onQueryChange = event => {
//         const query = event.target.value
//         this.props.searchQuery(query)
//         this.setState({query})
//     }




//     render() {
//         return (
//             <form  onSubmit={this.handleSubmit}>
//             <div className="explore-search-form">
//             <label className="explore-search-form__label">
//                 <input onChange={this.onQueryChange} className="explore-searchbar" type="text" placeholder="Search" aria-label="Search" />
//                 <b>Search by project name!</b>
//                 </label>
//                 </div>
//             </form>

//         )
//     }

// }

// export default withRouter(Searchbar)