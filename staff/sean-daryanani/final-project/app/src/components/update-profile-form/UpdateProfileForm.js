import React, { Component } from 'react'
import Checkbox from '../checkbox/Checkbox'
import { Button } from 'mdbreact'

const skills = [
    'Java',
    'Javascript',
    'C-Sharp',
    'Python',
    'PHP',
    'React',
    'Angular',
    'Vue'
]
class UpdateProfileForm extends Component {

    state = {
        city:  '',
        githubProfile: '',
        bio:  '',
        skills: []
    }


    // componentWillReceiveProps(props) {
    //     debugger
    //     if (props.user) {
    //         const { city, githubProfile, bio } = props.user

    //         this.setState({ city, githubProfile, bio })
    //     }
    // }
   
    componentWillMount = () => {

        this.selectedCheckboxes = new Set();

    }    

    handleSubmit = event => {

        event.preventDefault()

        let skillsArray = []
        debugger
        for (const checkbox of this.selectedCheckboxes) {

            skillsArray.push(checkbox)
        }
        const {city, githubProfile, bio} = this.state
        debugger
        this.props.updateProfile(this.state.city, this.state.githubProfile, this.state.bio, skillsArray)

  

    }

    onCityChange = event => {
        const city = event.target.value
        console.log(city)
        this.setState({ city })

    }

    onGithubChange = event => {
        const githubProfile = event.target.value
        console.log(githubProfile)
        this.setState({ githubProfile })
    }

    onBioChange = event => {
        const bio = event.target.value
        console.log(bio)
        this.setState({ bio })
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
        return <div>
            <form onSubmit={this.handleSubmit}>
                <label>City</label>

                <input onChange={this.onCityChange} defaultValue={city} type="text" id="exampleForm2" className="form-control" />

                <label>Github Profile</label>

                <input onChange={this.onGithubChange} defaultValue={githubProfile} type="text" id="exampleForm2" className="form-control" />

                <label>Bio</label>

                <textarea onChange={this.onBioChange} defaultValue={bio} className="form-control rounded-0" id="exampleFormControlTextarea2" rows="3"></textarea>

                {skills.map(skill => <Checkbox label={skill} handleCheckboxChange={this.toggleCheckbox} key={skill} selected={this.selectedCheckboxes} />)}

                <Button onClick={this.props.toggleModal} type="submit" color="primary">Save changes</Button>
            </form>
        </div>
    }

}

export default UpdateProfileForm