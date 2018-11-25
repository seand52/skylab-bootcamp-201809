import React from 'react'
import './profile-card.css'

const ProfileCard = props => {
    const { user, myProjects, collabProjects, showCollabProjects, projectsStarted } = props

    if (user) {
        const { name, joinDate, city, githubProfile, skills, profileImage } = user

        return (
            <div className='profile-card-container'>
                <div className='top-area'>
                    <div className='basic-info'>
                        <p><span>Name</span>: {name}</p>
                        <p><span>Joined</span>: {joinDate}</p>
                        <p><span>Location</span>: {city}</p>
                    </div>
                    <div className='profile-img-container'>
                        <img src={profileImage} width='150' alt='project' />
                    </div>
                </div>
                <div className='bottom-area'>
                    <button onClick={projectsStarted} type="button" className="btn btn-primary">
                        Projects started <span className="badge badge-light">{myProjects ? myProjects.length : 0}</span>
                    </button>
                    <button onClick={showCollabProjects} type="button" className="btn btn-primary">
                        Collaborations <span className="badge badge-light">{collabProjects ? collabProjects.length : 0}</span>
                    </button>
                    <button type="button" className="btn btn-primary">
                        Interests <span className="badge badge-light">{skills && skills.length}</span>
                    </button>

                </div>
            </div>
        )
    } else return null


}



export default ProfileCard