import React, { Component } from 'react'
import * as ReactDOM from 'react-dom';
import './chatpage.css'
import logic from '../../logic'
class ChatPage extends Component {

    state = {
        message: '',
        receiverName: '',
        messages: false
    }

    componentDidMount() {
        if (this.props.id && this.props.receiverId) {
            return logic.findConversation(this.props.receiverId)
                .then(res => {
                    const receiver = res.members.find(item => item.id !== this.props.userId)
                    this.setState({ receiverName: receiver.username })
                })
                .then(() => logic.listMessages(this.props.receiverId))
                .then(res => {
                    this.setState({ messages: [...res] }, () => this.scrollToBottom())
                })

        }
    }

    componentDidUpdate() {


        this.scrollToBottom();


    }

    handleSendMessage = (event) => {
        event.preventDefault()

        return logic.sendMessage(this.props.userId, this.props.receiverId, this.state.message)
            .then(() => logic.listMessages(this.props.receiverId))
            .then(res => this.setState({ messages: res, message: '' }))
    }


    scrollToBottom = () => {
        const { messageList } = this.refs;
        const scrollHeight = messageList.scrollHeight;
        const height = messageList.clientHeight;
        const maxScrollTop = scrollHeight - height;
        ReactDOM.findDOMNode(messageList).scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }

    onMessageChange = (event) => {
        const message = event.target.value

        this.setState({ message })
    }

    render() {
        const { messages } = this.state
        return <div className="container">
            <div className="title">
                <h2>Chat with {this.state.receiverName}</h2>
            </div>
            <div id="messages" ref="messageList">
                {messages && messages.map((message, index) => {
                    if (message.sender.id !== this.props.userId) {
                        return <div className="msg-left">
                            {message.text}
                        </div>
                    } else {
                        return <div className="msg-right">
                            {message.text}
                        </div>
                    }
                }
                )}
            </div>
            <div className="chatbox">
                <form onSubmit={this.handleSendMessage}>
                    <input onChange={this.onMessageChange} value={this.state.message} placeholder="Type something here..." id="chat-input" />
                </form>
            </div>
        </div>

    }

}

export default ChatPage

