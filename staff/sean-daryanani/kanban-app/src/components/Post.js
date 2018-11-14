import React, { Component } from 'react'
import logic from '../logic'
import Dropwdown from './Dropdown';
import Error from './Error'
import Popup from "reactjs-popup";
class Post extends Component {
    state = {
        text: this.props.text,
        status: '',
        blankPostit: this.props.blankError,
        friends: [],
        owner: ''
    }


    handleChange = event => {
        const text = event.target.value

        this.setState({ text })
    }

    handleBlur = () => {
        this.props.onUpdatePost(this.props.id, this.state.text, this.props.defaultStatus)
    }


    componentDidMount() {
        const id = sessionStorage.getItem('userId')
        return logic.listPostits()
            .then(res => {
                const postit = res.find(item => item.id === this.props.id)

                const { status } = postit

                this.setState({ status }, () => logic.retrieveFriends(id)
                .then(res => {
                    const friendArray = [...res]
                    this.setState({friends: friendArray})
                }))




            })
    }

    handleStatus = () => {

    }


    render() {
        return <article className="postit" draggable='true' className='post' draggable onDragStart={this.props.onDragStart}>
            {this.props.isAssigned ? null :<button className="postit__delete" onClick={() => this.props.onDeletePost(this.props.id)}><i className="fas fa-times"></i></button>}
            <div>
                <textarea className='postit__input' defaultValue={this.state.text} onChange={this.handleChange} onBlur={this.handleBlur} />
            </div>
            <div>
                {this.props.isAssigned ? null : <Dropwdown postitId={this.props.id} friends={this.state.friends} />}
            </div>
        </article>
    }
}

export default Post