import React, { Component } from 'react'
import logic from '../logic'
import Dropwdown from './Dropdown';

class Post extends Component {
    state = {
        text: this.props.text,
        status: ''
    }


    handleChange = event => {
        const text = event.target.value

        this.setState({ text })
    }

    handleBlur = () => {
        this.props.onUpdatePost(this.props.id, this.state.text, this.props.defaultStatus)
    }


    componentDidMount() {
        return logic.listPostits()
            .then(res => {
                const postit = res.find(item => item.id === this.props.id)

                const { status } = postit

                this.setState({ status })

            })
    }

    handleStatus = () => {

    }


    render() {
        return <article className="postit" draggable='true' className="post" draggable onDragStart={this.props.onDragStart}>
            <textarea className='postit__input' defaultValue={this.state.text} onChange={this.handleChange} onBlur={this.handleBlur} />
            <Dropwdown defaultStatus={this.props.defaultStatus} getStatus={this.handleStatus} onUpdatePost={this.props.onUpdatePost} text={this.state.text} id={this.props.id} />
            <button onClick={() => this.props.onDeletePost(this.props.id)}><i className="far fa-trash-alt"></i></button>
        </article>
    }
}

export default Post