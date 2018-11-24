import React, { Component } from 'react'
import { Container, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact'
import './modalpage.css'
import UpdateProfileForm from '../update-profile-form/UpdateProfileForm'
import meetingAttendees from '../meetingAttendees/MeetingAttendees'
import MeetingAttendees from '../meetingAttendees/MeetingAttendees';


class Modalpage extends Component {
    state = {
        modal: false,
        profileUpdate: false,
        meetingAttendees: false


    }

    toggle = () => {
        this.setState({

            modal: !this.state.modal

        });
    }

    componentWillReceiveProps(props) {

        if (props.render === 'profile update') this.setState({ profileUpdate: !this.state.profileUpdate })
        if (props.render === 'meeting attendees') this.setState({ meetingAttendees: !this.state.meetingAttendees })
    }

    componentDidMount() {

        if (this.props.render === 'meeting attendees') this.setState({ meetingAttendees: !this.state.meetingAttendees })
    }


    render() {

        const { state: { modal, profileUpdate, meetingAttendees }, props: { user, updateProfile }, toggle } = this
        
        return (
            <Container>
                <Button onClick={toggle}>Modal</Button>
                <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle}>Modal title</ModalHeader>
                    <ModalBody>
                        {profileUpdate ? <UpdateProfileForm user={user} updateProfile={updateProfile} toggle={toggle} /> : null}
                        {meetingAttendees ? <MeetingAttendees meetingId={this.props.meetingId}/> : null }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggle}>Close</Button>{' '}
                    </ModalFooter>
                </Modal>
            </Container>
        );
    }
}

export default Modalpage