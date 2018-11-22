import React, { Component } from 'react'
import './profile-card.css'
import logic from '../../logic'

const ProfileCard = props => {

    const {name, joinDate, city, githubProfile, skills, profileImage} = props.user

    return (
        <div className='profile-card-container'>
            <div className='top-area'>
                <div className='basic-info'>
                    <p>Name: {name}</p>
                    <p>Joined: {joinDate}</p>
                    <p>Location: {city}</p>
                    <span>Github:</span> <a href="#">{githubProfile}</a>
                </div>
                <div className='profile-img-container'>
                    <img src={profileImage} width='150' />
                </div>
            </div>
            <div className='bottom-area'>
                <button type="button" className="btn btn-primary">
                    Projects started <span className="badge badge-light">{props.myProjects.length ? 'number' : 0}</span>
                </button>
                <button type="button" className="btn btn-primary">
                    Collaborations <span className="badge badge-light">{props.myProjects.length ? 'number' : 0}</span>
                </button>
                <button type="button" className="btn btn-primary">
                    Interests <span className="badge badge-light">{skills && skills.length}</span>
                </button>

            </div>

        </div>

    )
}



export default ProfileCard