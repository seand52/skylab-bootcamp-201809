import React, { Component } from 'react'
import logic from '../logic'
import InputForm from './InputForm'
import Post from './Post'
import Popup from './Popup'
import Profile from './Profile'

class Home extends Component {
    state = {
        showPopup: false,
        postits: [],
        showProfile: false,
        userName: '',
        userSurname: ''
    }

    componentDidMount() {
        const { propUserID, token } = this.props
        logic.listPostits(propUserID, token)
            .then(postits => { this.setState({ postits }) })
    }

    handleSubmit = text => {
        const { propUserID, token } = this.props

        logic.createPostit(text, propUserID, token)
            .then(() => logic.listPostits(propUserID, token))
            .then(postits => this.setState({ postits }))

    }

    handleDeletePost = id => {

        const { propUserID, token } = this.props

        logic.deletePostit(id, propUserID, token)
            .then(() => logic.listPostits(propUserID, token))
            .then(postits => this.setState({ postits }))
    }

    handleLogout = () => {
        this.props.logOut()
    }

    handleUpdatePost = (id, text) => {

        const { propUserID, token } = this.props

        logic.updatePost(id, text, propUserID, token)
            .then(() => logic.listPostits(propUserID, token))
            .then(postits => {
                this.setState({ postits })
                this.togglePopup()
            })
    }

    togglePopup = (id) => {

        this.setState({
            showPopup: !this.state.showPopup,
            clickedID: id
        })
    }

    showProfile = () => {
        const { propUserID, token } = this.props
        logic.retrieveUserInfo(propUserID, token)
            .then(res => {

                this.setState({userName: res.name, userSurname: res.surname, showProfile: !this.state.showProfile })}
                )

    }

    render() {
        return <div className="container">
            <h1>Post it App</h1>
            <button onClick={this.showProfile}>Profile</button>
            {!this.state.showProfile ? <InputForm onSubmit={this.handleSubmit} />: null}

            {!this.state.showProfile ? <div className="test">
                {this.state.postits.map(postit => <Post key={postit.id} text={postit.text} id={postit.id} onDeletePost={this.handleDeletePost} editing={this.state.showPopup} popup={this.togglePopup} />)}
                {this.state.postits.map(postit => (this.state.showPopup && postit.id === this.state.clickedID) ? <Popup onUpdate={this.handleUpdatePost} key={postit.id} id={postit.id} text={postit.text} /> : null)}
            </div>: null}

            <button onClick={this.handleLogout}>Log out</button>
            {this.state.showProfile ? <Profile username={this.state.userName} id={this.props.propUserID} name={this.state.userName} surname={this.state.userSurname} />:null}
        </div>
    }
}


export default Home


