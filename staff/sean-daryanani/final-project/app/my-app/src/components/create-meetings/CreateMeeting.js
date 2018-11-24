import React, { Component } from 'react'
import Navbarpage from '../navbar/Navbar'

class CreateMeeting extends Component {
    state = {

    }

    render() {
        return <div>
            <Navbarpage />
            <form onSubmit={this.handleSubmit}>
                <label>Add a description. What will you do in this meeting?</label>

                <textarea onChange={this.onDescriptionChange} type="text" id="exampleForm2" className="form-control" />

                <label>Location: Where will this event take place?</label>

                <input onChange={this.onLocationChange} type="text" id="exampleForm2" className="form-control" />


            </form>
        </div>
    }

}

export default CreateMeeting