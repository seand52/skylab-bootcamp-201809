import React, { Component } from 'react'
import { Container, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact'
import './modalpage.css'
import UpdateProfileForm from '../update-profile-form/UpdateProfileForm'
import MeetingAttendees from '../meetingAttendees/MeetingAttendees'


class Modalpage extends Component {
    state = {
        modal: false,



    }

    toggle = () => {    
        debugger
        this.setState({

            modal: !this.state.modal

        });
    }


    render() {

        const { state: { modal }, props: { user, updateProfile }, toggle } = this

        return (
            <Container>
                <Button onClick={toggle}>Edit Profile</Button>
                <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle}>Edit Profile</ModalHeader>
                    <ModalBody>
                        <UpdateProfileForm toggleModal={this.toggle} user={user} updateProfile={updateProfile} />
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