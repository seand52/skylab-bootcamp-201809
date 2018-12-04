import React, { Component } from 'react'
import * as ReactDOM from 'react-dom';
import './chatpage.css'
import logic from '../../logic'
import { withRouter, Link } from 'react-router-dom'
class ChatPage extends Component {

    state = {
        message: '',
        receiverName: '',
        messages: false,
        conversations: false,
        totalPendingMessages: 0,
        receiverImage: ''

    }

    componentDidMount() {

        if (this.props.id && this.props.receiverId) {
            logic.findConversation(this.props.receiverId)
                .then(res => {

                    const receiver = res.members.find(item => item.id !== this.props.userId)
                    this.setState({ receiverName: receiver.username, receiverImage: receiver.profileImage })
                })
                .then(() => logic.listMessages(this.props.receiverId))
                .then(res => {

                    this.setState({ messages: [...res.messages] }, () => this.scrollToBottom())
                })

            logic.listConversations()
                .then(res => {
                    let total = 0
                    res.forEach(item => total = item[1].pendingMessages + total)
                    debugger

                    this.setState({ conversations: res })
                })

        }

        // this.interval = setInterval(() => this.refresh(), 2000)
    }

    refresh() {
        // clearInterval(this.interval)

        if (this.props.id && this.props.receiverId) {

            logic.listMessages(this.props.receiverId)
                .then(res => {

                    if (this.state.messages.length !== res.messages.length) this.setState({ messages: [...res.messages] }, () => this.scrollToBottom())
                })
        }
        // this.interval = setInterval(() => this.refresh(), 2000)

    }


    componentWillReceiveProps(props) {
        debugger
        console.log('will receive props')
        if (props.id && props.receiverId) {
            logic.findConversation(props.receiverId)
                .then(res => {
                    const receiver = res.members.find(item => item.id !== props.userId)
                    this.setState({ receiverName: receiver.username, receiverImage: receiver.profileImage })
                })
                .then(() => logic.listMessages(props.receiverId))
                .then(res => {
                    this.setState({ messages: [...res.messages] }, () => this.scrollToBottom())
                })

            logic.listConversations()
                .then(res => {
                    let total = 0

                    res.forEach(item => total = item[1].pendingMessages + total)

                    this.setState({ conversations: res })
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
            .then(res => this.setState({ messages: res.messages, message: '' }))
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

        const { messages, conversations, receiverImage } = this.state
        return <section className="chat">
            <div className="conversation-page-container row">

                <div className="conversations-list col-4">
                    <h2>Chats</h2>
                    {conversations && conversations.sort((a,b) => b[1].pendingMessages - a[1].pendingMessages).map((conversation, index) => {
                        return <div key={index} className={(this.state.receiverName===conversation[0].username) ? "conversation-card-chatroom-test" : "conversation-card-chatroom"}>
                            <img src={conversation[0].profileImage} />
                            <Link to={`/messages/${conversation[1].conversationId}/${conversation[0].id}`}>{conversation[0].username}</Link>
                            <span className="badge badge-primary">{conversation[1].pendingMessages}</span>
                        </div>
                    })}
                </div>
                <div className="container-chat-and-input col-lg-6 col-xs-12">
                    <div className="container-chat">
                        <div className="title">
                            <h2><img className="profile-image-chat" src={receiverImage} /> <Link to={`/profile/${this.props.receiverId}`}>{this.state.receiverName}</Link></h2>
                        </div>
                        <div id="messages" ref="messageList">
                            {messages && messages.map((message, index) => {

                                if (message.sender != this.props.userId) {
                                    return <div key={index} className="msg-left">
                                        {message.text}
                                    </div>
                                } else {
                                    return <div key={index} className="msg-right">
                                        {message.text}
                                    </div>
                                }
                            }
                            )}
                        </div>

                    </div>
                    <div className="chatbox col-12">
                        <form className="chat-input-form" onSubmit={this.handleSendMessage}>
                            <div className="row">
                                <div className="col-9">
                                    <input className="chat-input" onChange={this.onMessageChange} value={this.state.message} placeholder="Type your message and hit enter!" id="chat-input" />
                                </div>
                                <div className="col-3">
                                    <button className="chat-send-button" type="submit">Send</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

            </div>

        </section>
    }

}

export default withRouter(ChatPage)

