import React from 'react'

function Landing(props) {
    return <section className="landing-page">
        <div className="landing-page__backgroundimage">
            <div className="title-wrapper">
            <h1 className="landing-page__title">Do-It <i className="fas fa-check"></i></h1>
                <h2 className="landing-page__description">Manage your tasks in a simple way!</h2>
            </div>
        </div>
        <div className="landing-page__form">
            <button className="landing-form__button draw-border" onClick={props.onRegisterClick}>Register</button>
            <button className="landing-form__button draw-border" onClick={props.onLoginClick}>Login</button>
        </div>
    </section>
}

export default Landing