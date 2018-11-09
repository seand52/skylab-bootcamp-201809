import React, { Component } from 'react'
import Register from './components/Register'
import Login from './components/Login'
import logic from './logic'
import Home from './components/Home'
import Error from './components/Error'

class App extends Component {
    state = {
        register: false, 
        login: false,
        userID: null,
        token: null,
        error: null,
    }

    handleRegister = () => {
        this.setState({register: !this.state.register})

    }
    
    handleLogin = () => {
        this.setState({login: !this.state.login,
        error:null})
    }

    handleLogout = () => {
        this.setState({userID: null, token: null})

        sessionStorage.removeItem('userID')
        sessionStorage.removeItem('token')
    }

    handleHome = () => {
        this.setState({home: !this.state.home,
        login:this.state.login})
    }

    registerSubmit = (name, surname, username, password) => {
        try {
            logic.registerUser(name, surname, username, password)
                .then(() => this.setState({login: true, register: false, error: null}))
                .catch (err => this.setState({error: err.message}))
        } catch(err) {
            this.setState({error: err.message})
        }
    }

    componentDidMount() {
    const userID = sessionStorage.getItem('userId')  
    const token = sessionStorage.getItem('token')

    userID ? this.setState({userID, token}): this.setState({userID: null, token: null})
    }



    loginSubmit = (username, password) => {

        try {
            logic.login(username, password) 
                .then((res) => {
                    sessionStorage.setItem('userId', res.data.id)
                    sessionStorage.setItem('token', res.data.token)
                    this.setState({ userID: res.data.id, token: res.data.token, login: false, register: false, error: null })})
                    .catch(err => this.setState({ error: err.message }))
        }catch(err) {
            this.setState({error: err.message})
        }
        
    }
     
    render() {
        const { register, login, userID, error, token } = this.state
        return <div className="main-container">       
        {!register && !login && !userID &&             
            <section className="landing-section">
            <h1>Welcome to the Postit App!</h1>
            <button className="btn-landing btn btn-primary btn-lg" onClick={this.handleRegister}>Register</button>
            <button className="btn-landing btn btn-primary btn-lg" onClick={this.handleLogin}>Login</button>
            </section>}
        {register && <Register onRegisterClick={this.registerSubmit} backHandle={this.handleRegister}/>}
        {login && <Login onLoginClick={this.loginSubmit} backHandle={this.handleLogin} />} 
        {error && <Error message={error}/>}
        {userID && <Home logOut={this.handleLogout} propUserID={userID} token={token} /> }      
        </div>
    }

}

export default App

