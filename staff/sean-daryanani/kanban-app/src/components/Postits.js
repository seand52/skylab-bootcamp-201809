import React, { Component } from 'react'
import logic from '../logic'
import InputForm from './InputForm'
import Post from './Post'

class Postits extends Component {
    state = { postits: [] }

    componentDidMount() {
        logic.listPostits()
            .then(postits => { this.setState({ postits }) })

        // TODO error handling!
    }

    handleSubmit = (text, status) => {
        try {
            return logic.addPostit(text, status)
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

    onDragOver = ev => {
        ev.preventDefault();
    }

    onDragStart = (ev, id, text) => {
        ev.dataTransfer.setData('text', text)
        ev.dataTransfer.setData('id', id)

    }

    onDrop = (ev, status) => {
        const text = ev.dataTransfer.getData('text')
        const postitId = ev.dataTransfer.getData('id')


        if (ev.target.classList.contains('drop')) {
            this.handleModifyPostit(postitId, text, status)
        }

    }


    render() {
        return <div className="postits-container">
        <h1>Post-It App <i className="fas fa-sticky-note"></i></h1>
            <div className="postits-display">                
                <section className="drop" onDragOver={this.onDragOver} onDrop={event => this.onDrop(event, 'TODO')}>
                    <h1>To Do</h1> <InputForm status='TODO' onSubmit={this.handleSubmit} />
                    {this.state.postits.filter(postit => postit.status === 'TODO').map(postit => <Post defaultStatus={postit.status} key={postit.id} text={postit.text} id={postit.id} onDeletePost={this.handleRemovePostit} draggable='true' onDragStart={event => this.onDragStart(event, postit.id, postit.text)} onUpdatePost={this.handleModifyPostit} />)}
                </section>

                <section className="drop" onDragOver={this.onDragOver} onDrop={event => this.onDrop(event, 'DOING')}>
                    <h1>Doing</h1><InputForm status='DOING' onSubmit={this.handleSubmit} />
                    {this.state.postits.filter(postit => postit.status === 'DOING').map(postit => <Post defaultStatus={postit.status} key={postit.id} text={postit.text} id={postit.id} onDeletePost={this.handleRemovePostit} draggable='true' onDragStart={event => this.onDragStart(event, postit.id, postit.text)} onUpdatePost={this.handleModifyPostit} />)}
                </section>

                <section className="drop" onDragOver={this.onDragOver} onDrop={event => this.onDrop(event, 'REVIEW')}>
                    <h1>Review</h1><InputForm status='REVIEW' onSubmit={this.handleSubmit} />
                    {this.state.postits.filter(postit => postit.status === 'REVIEW').map(postit => <Post defaultStatus={postit.status} key={postit.id} text={postit.text} id={postit.id} onDeletePost={this.handleRemovePostit} draggable='true' onDragStart={event => this.onDragStart(event, postit.id, postit.text)} onUpdatePost={this.handleModifyPostit} />)}
                </section>

                <section className="drop" onDragOver={this.onDragOver} onDrop={event => this.onDrop(event, 'DONE')}>
                    <h1>Done</h1><InputForm status='DONE' onSubmit={this.handleSubmit} />
                    {this.state.postits.filter(postit => postit.status === 'DONE').map(postit => <Post defaultStatus={postit.status} key={postit.id} text={postit.text} id={postit.id} onDeletePost={this.handleRemovePostit} draggable='true' onDragStart={event => this.onDragStart(event, postit.id, postit.text)} onUpdatePost={this.handleModifyPostit} />)}
                </section>
            </div>
        </div>
    }
}

export default Postits
