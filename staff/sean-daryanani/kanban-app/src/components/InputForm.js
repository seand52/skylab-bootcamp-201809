import React, { Component } from 'react'

class InputForm extends Component {
    state = { text: '' }

    handleInput = event => {
        const text = event.target.value

        this.setState({ text })
    }

    handleSubmit = event => {
        event.preventDefault()

        this.props.onSubmit(this.state.text, this.props.status)

        this.setState({ text: '' })
    }

    render() {
        return <form onSubmit={this.handleSubmit}>
            <label className="field a-field a-field_a1 page__field">
                <input type="text" value={this.state.text} onChange={this.handleInput} className="field__input" placeholder="What is your goal?"/>
            </label>
        </form>
    }
}

export default InputForm