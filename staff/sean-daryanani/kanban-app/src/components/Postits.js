import React, { Component } from 'react'
import logic from '../logic'
import InputForm from './InputForm'
import Post from './Post'

class Postits extends Component {
    state = { postits: [] }

    componentDidMount() {
        console.log('mounted')
        logic.listPostits()
            .then(postits => { this.setState({ postits }) })

        // TODO error handling!
    }

    handleSubmit = (text, status) => {
        try {
            return logic.addPostit(text, status = 'TODO')
                .then(() => logic.listPostits())
                .then(postits => this.setState({ postits }))
        } catch ({ message }) {
            alert(message) // HORROR! FORBIDDEN! ACHTUNG!
        }
    }

    // TODO error handling!

    handleRemovePostit = id =>
        logic.removePostit(id)
            .then(() => logic.listPostits())
            .then(postits => this.setState({ postits }))

    // TODO error handling!


    handleModifyPostit = (id, text, status) => {
        if (status === undefined) {
            return logic.modifyPostit(id, text, status = 'TODO')
                .then(() => logic.listPostits())

                .then(postits => this.setState({ postits }))

        } else {
            return logic.modifyPostit(id, text, status)
                .then(() => logic.listPostits())

                .then(postits => this.setState({ postits }))
        }
    }
    // TODO error handling!


    render() {
        return <div>
            <h1>Post-It App <i className="fas fa-sticky-note"></i></h1>

            <InputForm onSubmit={this.handleSubmit} />

            <section>
                <h1>To Do</h1>
                {this.state.postits.filter(postit => postit.status === 'TODO').map(postit => <Post key={postit.id} text={postit.text} id={postit.id} onDeletePost={this.handleRemovePostit} onUpdatePost={this.handleModifyPostit} />)}
            </section>

            <section>
                <h1>Doing</h1>
                {this.state.postits.filter(postit => postit.status === 'DOING').map(postit => <Post key={postit.id} text={postit.text} id={postit.id} onDeletePost={this.handleRemovePostit} onUpdatePost={this.handleModifyPostit} />)}
            </section>

            <section>
                <h1>Review</h1>
                {this.state.postits.filter(postit => postit.status === 'REVIEW').map(postit => <Post key={postit.id} text={postit.text} id={postit.id} onDeletePost={this.handleRemovePostit} onUpdatePost={this.handleModifyPostit} />)}
            </section>

            <section>
                <h1>Done</h1>
                {this.state.postits.filter(postit => postit.status === 'DONE').map(postit => <Post key={postit.id} text={postit.text} id={postit.id} onDeletePost={this.handleRemovePostit} onUpdatePost={this.handleModifyPostit} />)}
            </section>
        </div>
    }
}

export default Postits
