import React, { Component } from 'react'
import logic from '../logic'

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
        this.props.onUpdatePost(this.props.id, this.state.text)
    }

    dropDownChange =(event) => {
        event.preventDefault()

        const val = event.target.value

        this.setState({status: val}, () =>  this.props.onUpdatePost(this.props.id, this.state.text, val))        
    }

    componentDidMount() {
        return logic.listPostits()
            .then(res => {
                const postit = res.find(item => item.id === this.props.id)

                const {status} = postit

                this.setState({status})

            })
    }

    render() {
        let todo = false
        let doing = false
        let review = false
        let done = false

        switch(this.state.status) {
            case 'TODO':
                todo = true
                break
            case 'DOING':
                doing=true
                break
            case 'REVIEW':
                review=true
                break
            case 'DONE':
                done=true
                break
        }
        return <article className="post">
            <textarea defaultValue={this.state.text} onChange={this.handleChange} onBlur={this.handleBlur} />
            <select  onChange={this.dropDownChange}>
                <option selected= {todo ? 'selected': null} value="TODO">To do</option>
                <option selected= {doing ? 'selected': null} value="DOING">Doing</option>
                <option selected= {review ? 'selected': null} value="REVIEW">Review</option>
                <option selected= {done ? 'selected': null} value="DONE">Done</option>
            </select>
            <button onClick={() => this.props.onDeletePost(this.props.id)}><i className="far fa-trash-alt"></i></button>
        </article>
    }
}

export default Post