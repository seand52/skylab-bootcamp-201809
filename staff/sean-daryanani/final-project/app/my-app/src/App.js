import React, { Component } from 'react';
import './App.css';
import { Route, withRouter, Redirect, Switch } from 'react-router-dom'
import logic from './logic'
import Landing from './components/landing/Landing'
import Register from './components/register/Register'
import Login from './components/login/Login'
import Error from './components/error/Error'
import Home from './components/home/Home'
import Explore from './components/explore/Explore'
import Profile from './components/profile/Profile'
import ProjectPage from './components/project-page/ProjectPage'


logic.url = 'http://localhost:5000/api'

class App extends Component {
  state = {
    error: null
  }

  handleRegisterClick = () => {
    this.props.history.push('/register')
  }

  handleLoginClick = () => {
    this.props.history.push('/login')
  }

  handleSkipToLogin = () => {
    this.props.history.push('login')
  }

  handleSkipToRegister = () => {
    this.props.history.push('/register')
  }

  handleRegister = (name, email, username, password) => {

    try {
      logic.registerUser(name, email, username, password)

        .then(() => this.setState({ error: null }, this.props.history.push('/login')))

        .catch(err => this.setState({ error: err.message }))

    } catch (err) {

      this.setState({ error: err.message })

    }
  }

  handleLogin = (username, password) => {
    try {

      logic.authenticate(username, password)

        .then(() => this.setState({ error: null }, this.props.history.push('/home')))

        .catch(err => this.setState({ error: err.message }))

    } catch (err) {

      this.setState({ error: err.message })

    }
  }

  render() {
    const { error } = this.state
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" render={() => !logic.loggedIn ? <Landing onRegisterClick={this.handleRegisterClick} onLoginClick={this.handleLoginClick} /> : <Redirect to="/home" />} />

          <Route path="/register" render={() => !logic.loggedIn ? <Register onRegister={this.handleRegister} onSkipToLogin={this.handleSkipToLogin} /> : <Redirect to="/home" />} />

          <Route path="/login" render={() => !logic.loggedIn ? <Login onLogin={this.handleLogin} onSkipToRegister={this.handleSkipToRegister} /> : <Redirect to="/home" />} />

          <Route path="/home" render={() => logic.loggedIn ? <Home /> : <Redirect to="/" />} />

          <Route path="/explore/:query" render={props => logic.loggedIn ? <Explore query={props.match.params.query} /> : <Redirect to="/explore" />} />

          <Route path="/explore" render={() => logic.loggedIn ? <Explore /> : <Redirect to="/" />} />

          <Route path="/project/:id" render={props => logic.loggedIn ? <ProjectPage id={props.match.params.id} /> : <Redirect to="/" />} />

          <Route path="/profile" render={ () => logic.loggedIn ? <Profile /> : <Redirect to="/" />} />
        </Switch>
        {error && <Error message={error} />}
      </div>
    );
  }
}

export default withRouter(App);
