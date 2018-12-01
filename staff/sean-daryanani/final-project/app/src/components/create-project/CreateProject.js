import React, { Component } from 'react'
import { Button, Input } from 'mdbreact'
import Checkbox from '../checkbox/Checkbox'
import logic from '../../logic'
import './create-project.css'

const skills = [
    'Java',
    'Javascript',
    'C-Sharp',
    'Python',
    'PHP',
    'React',
    'Angular',
    'Vue',
    'SQL',
    'Mongoose',
    'Ruby',
    'Swift',
]

class CreateProject extends Component {

    state = {
        name: '',
        description: '',
        maxMembers: '',
        error: false,
        toggleSuccess: false,
        location: ''
    }


    handleSubmit = (event) => {
        event.preventDefault()

        let skillsArray = []

        for (const checkbox of this.selectedCheckboxes) {

            skillsArray.push(checkbox)

        }

        const { name, description, maxMembers, location } = this.state

        try {
            return logic.addNewProject(name, description, skillsArray, maxMembers, location)
                .then(() => this.setState({ error: false, toggleSuccess: !this.state.toggleSuccess }))
                .then(() => this.props.backToMyProject())
        } catch (err) {
            this.setState({ error: true })
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

    onLocationChange = event => {
        const location = event.target.value
        this.setState({ location })
    }

    renderDropDown = () => {
        var members = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

        return members.map((item, index) => <option key={index} disabled={(index===0) ? 'disabled' : false} value={item}>{item}</option>)
    }



    render() {
        return <div className="newproject-container">
            <div className="row">
                <section className="create-project-form-section  col-8 form-group">
                    <form className="create-project-form" onSubmit={this.handleSubmit}>
                        <label className="create-project__name-label">What will your project's name be?</label>

                        <input onChange={this.onProjectNameChange} type="text" id="exampleForm2" className="form-control" /><br />

                        <label className="create-project__description-label" >Describe who should join, and what you aim to achieve</label>

                        <input type="textarea" onChange={this.onProjectDescriptionChange} className="form-control rounded-0" id="exampleFormControlTextarea2" rows="3" />

                        <label className="create-project__select-label">In what city will your meetings be hosted?</label><br />

                        <input onChange={this.onLocationChange} type="text" id="exampleForm2" className="form-control" /><br />


                        <label className="create-project__select-label">What is the maximum amount of members you would like to allow?</label><br />

                        <select className="create-project__select form-control" onChange={this.onMaxMembersChange} name="agent" id="agent">
                            {this.renderDropDown()}
                        </select> <br />

                        {/* <label>Check the box if your project is beginner friendly</label>

                    <input type="checkbox" value={'beginner-friendly'} onChange={this.onBeginnerFriendlySelect}/> <br/> */}

                        <label className="create-project__technologies-label">What technologies will your project include?</label>
                        <div className="create-project__skills-checkboxes">
                            {skills.map(skill => <Checkbox label={skill} handleCheckboxChange={this.toggleCheckbox} key={skill} selected={this.selectedCheckboxes} />)}
                        </div>
                        <Button type="submit" color="primary">Save changes</Button>
                    </form>


                    {this.state.error ? <p>You must complete all the fields</p> : null}

                    {this.state.toggleSuccess ? <p>Project added</p> : null}

                </section>

                <aside className="rules col-4">
                    <p><b>Remember to keep in mind the following:</b></p>
                    <ul className="list-group">
                        <li className="list-group-item">Arrange real, in-person sessions</li>
                        <li className="list-group-item">Have open and honest intentions</li>
                        <li className="list-group-item">Always be safe and respectful</li>
                        <li className="list-group-item">Put your members first</li>
                        <li className="list-group-item">Vestibulum at eros</li>
                    </ul>
                </aside>
            </div>
        </div>

    }

}

export default CreateProject