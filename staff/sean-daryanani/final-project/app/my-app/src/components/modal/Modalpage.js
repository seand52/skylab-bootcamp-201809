import React, { Component } from 'react'
import { Container, Button, Modal, ModalBody, ModalHeader, ModalFooter, Input } from 'mdbreact'
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
        city: this.props.user.city,
        githubProfile: '',
        bio: '',
        skills: []
    }


    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }
    //arreglar esta basura
    handleSubmit = event => {

        event.preventDefault()

        const { city, githubProfile, bio } = this.props.user
        
        this.setState({ city, githubProfile, bio }, () => {

            const skillsArray = []

            for (const checkbox of this.selectedCheckboxes) {

                skillsArray.push(checkbox)

            }
            this.props.updateProfile(this.state.city, this.state.githubProfile, this.state.bio, skillsArray)

        })

    }


    onCityChange = event => {
        const city = event.target.value

        this.setState({ city })

    }

    onGithubChange = event => {
        const github = event.target.value

        this.setState({ github })
    }

    onBioChange = event => {
        const bio = event.target.value

        this.setState({ bio })
    }

    componentDidUpdate() {
        console.log('did mount')
        const {city, github, bio} = this.props.user
        this.setState({city, github, bio})
    }

    shouldComponentUpdate(nextProps, nextState) {
        const {city, github, bio} = this.props.user
        this.setState({city, github, bio})
        return true
    }

    componentDidMount() {
        console.log('did mount')
        const {city, github, bio} = this.props.user
        debugger    
        this.setState({city, github, bio})
    }

    componentWillMount = () => {
        console.log('will mount')
        this.selectedCheckboxes = new Set();
        // this.selectedCheckboxes.add('javascript')

    }

    toggleCheckbox = label => {

        if (this.selectedCheckboxes.has(label)) {

            this.selectedCheckboxes.delete(label);

        } else {

            this.selectedCheckboxes.add(label);
        }
    }

    render() {
        const { city, githubProfile, bio } = this.props.user
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