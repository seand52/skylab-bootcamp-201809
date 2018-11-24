import React, { Component } from 'react'
import { Button } from 'mdbreact'
import Checkbox from '../checkbox/Checkbox'
import logic from '../../logic'

const skills = [
    'Java',
    'Javascript',
    'C#',
    'C++',
    'Python',
    'PHP',
    'React',
    'Angular',
    'Vue'
]

class CreateProject extends Component {

    state = {
        name: '',
        description: '',
        maxMembers: '',
        error: false,
        toggleSuccess: false,
    }


    handleSubmit = (event) => {
        event.preventDefault()

        let skillsArray = []

        for (const checkbox of this.selectedCheckboxes) {

            skillsArray.push(checkbox)

        }

        const { name, description, maxMembers } = this.state

        try {
            logic.addNewProject(name, description, skillsArray, 'true', maxMembers)
                .then(() => {
                    this.setState({ error: false, toggleSuccess: !this.state.toggleSuccess })
                })
        } catch(err) {
            this.setState({error: true})
        }

        //TODO error handling

    }

    componentWillMount = () => {

        this.selectedCheckboxes = new Set();

    }

    toggleCheckbox = label => {

        if (this.selectedCheckboxes.has(label)) {

            this.selectedCheckboxes.delete(label);

        } else {

            this.selectedCheckboxes.add(label);
        }
    }

    onProjectNameChange = event => {
        const name = event.target.value

        this.setState({ name })
    }

    onProjectDescriptionChange = event => {
        const description = event.target.value

        this.setState({ description })
    }

    onMaxMembersChange = event => {
        const maxMembers = event.target.value

        this.setState({ maxMembers })
    }



    render() {
        return <div className="newproject-container">
            <section className="create-project-form">
                <form onSubmit={this.handleSubmit}>
                    <label>What will your project's name be?</label>

                    <input onChange={this.onProjectNameChange} type="text" id="exampleForm2" className="form-control" /><br />

                    <label>Describe who should join, and what you aim to achieve</label>

                    <textarea onChange={this.onProjectDescriptionChange} className="form-control rounded-0" id="exampleFormControlTextarea2" rows="3"></textarea>

                    <label>What is the maximum amount of members you would like to allow?</label>

                    <select onChange={this.onMaxMembersChange} name="agent" id="agent">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select> <br />

                    {/* <label>Check the box if your project is beginner friendly</label>

                    <input type="checkbox" value={'beginner-friendly'} onChange={this.onBeginnerFriendlySelect}/> <br/> */}

                    <label>What technologies will your project include?</label>

                    {skills.map(skill => <Checkbox label={skill} handleCheckboxChange={this.toggleCheckbox} key={skill} selected={this.selectedCheckboxes} />)}

                    <Button type="submit" color="primary">Save changes</Button>
                </form>
                {this.state.error ? <p>You must complete all the fields</p> : null}
                
                {this.state.toggleSuccess ? <p>Project added</p> : null}
            </section>
            <aside className="rules">
                <p>Remember to keep in mind the following:</p>
                <ul>
                    <li>Arrange real, in-person sessions</li>
                    <li>Have open and honest intentions</li>
                    <li>Always be safe and respectful</li>
                    <li>Put your members first</li>
                </ul>
            </aside>

        </div>

    }

}

export default CreateProject