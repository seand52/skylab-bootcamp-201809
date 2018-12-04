import React, { Component } from 'react'
import { Container, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact'
import logic from '../../logic'
import { withRouter, Link } from 'react-router-dom'
import './chatroom.css'
class ChatRooms extends Component {
    state = {
        modal: false,
        conversations: false
    }

    toggle = () => {
        this.setState({

            modal: !this.state.modal

        });
    }

    componentDidMount() {
        debugger
        return logic.listConversations()
            .then(res => {
                debugger
                this.setState({ conversations: res })
            })
    }


    render() {

        const { state: { modal, conversations }, props: { meetingId }, toggle } = this

        return (
            <Container>
                <Button color="blue" onClick={toggle}>View Active Chats</Button>
                <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle}>Active chats</ModalHeader>
                    <ModalBody>
                        {conversations && conversations.map(conversation => {
                            return <div className="conversation-card">
                                <img src={conversation[0].profileImage} />
                                <Link to={`/messages/${conversation[1].conversationId}/${conversation[0].id}`}><p>{conversation[0].username}</p></Link>
                            </div>
                        })}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggle}>Close</Button>{' '}
                    </ModalFooter>
                </Modal>
            </Container>
        );
    }
}

export default withRouter(ChatRooms)