import React, { Component } from 'react'
import { Container, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact'
import './modalpage.css'
import Checkbox from '../checkbox/Checkbox'

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

class Modalpage extends Component {
    state = {
        modal: false,
        city: this.props.user ? this.props.user.city : '',
        githubProfile: this.props.user ? this.props.user.githubProfile : '',
        bio: this.props.user ? this.props.user.bio : '',
        skills: []
    }


    toggle = () => {
        this.setState({

            modal: !this.state.modal

        });
    }

    handleSubmit = event => {

        event.preventDefault()

        let skillsArray = []

        for (const checkbox of this.selectedCheckboxes) {

            skillsArray.push(checkbox)
        }

        this.props.updateProfile(this.state.city, this.state.githubProfile, this.state.bio, skillsArray)


    }

    componentWillReceiveProps(props) {
        if (props.user) {
            const { city, githubProfile, bio } = props.user

            this.setState({ city, githubProfile, bio })
        }
    }


    onCityChange = event => {
        const city = event.target.value

        this.setState({ city })

    }

    onGithubChange = event => {
        const githubProfile = event.target.value

        this.setState({ githubProfile })
    }

    onBioChange = event => {
        const bio = event.target.value

        this.setState({ bio })
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

    render() {
        const { state: { city, githubProfile, bio } } = this

        return (
            <Container>
                <Button onClick={this.toggle}>Modal</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
                    <ModalBody>
                        <form onSubmit={this.handleSubmit}>
                            <label>City</label>

                            <input onChange={this.onCityChange} defaultValue={city} type="text" id="exampleForm2" className="form-control" />

                            <label>Github Profile</label>

                            <input onChange={this.onGithubChange} defaultValue={githubProfile} type="text" id="exampleForm2" className="form-control" />

                            <label>Bio</label>

                            <textarea onChange={this.onBioChange} defaultValue={bio} className="form-control rounded-0" id="exampleFormControlTextarea2" rows="3"></textarea>

                            {skills.map(skill => <Checkbox label={skill} handleCheckboxChange={this.toggleCheckbox} key={skill} selected={this.selectedCheckboxes} />)}

                            <Button onClick={this.toggle} type="submit" color="primary">Save changes</Button>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>Close</Button>{' '}
                    </ModalFooter>
                </Modal>
            </Container>
        );
    }
}

export default Modalpage