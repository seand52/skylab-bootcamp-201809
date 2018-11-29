import React from 'react'
import './profile-card.css'

const ProfileCard = props => {
    const { user, myProjects, collabProjects, showCollabProjects, projectsStarted, uploadImage, userId, profileImage, meetings, numberOfMeetings } = props

    if (user) {
        const { name, joinDate, city, githubProfile, skills } = user

        return (
            <div className="col-12 profile-card-container">
            <div className="general-info-container">
                <div className='top-area'>
                <div className='top-area-left-section'>
                    <div className='basic-info'>
                        <p><span>Name</span>: {name}</p>
                        <p><span>Joined</span>: {joinDate}</p>
                        <p><span>Location</span>: {city}</p>
                    </div>
                    {(userId === user.id) && <form  encType="multipart/form-data" onSubmit={uploadImage}>
                        <label className="profileImage-upload">
                            <input type="file" className="uploadImage-input" name="avatar" onChange={uploadImage} />
                            Upload image
                        </label>
                    </form>}
                    </div>
                    <div className='profile-img-container'>
                        <img src={user.profileImage} />
                    </div>
                    </div>

                </div>
                <div className='bottom-area'>
                    <button onClick={projectsStarted} type="button" className="profile-card-button" id="first-button" >
                        Projects started <span className="projects-badge">{myProjects ? myProjects.length : 0}</span>
                    </button>
                    {(userId===user.id) && <button onClick={showCollabProjects} type="button" className="profile-card-button" >
                        Collaborations <span className="projects-badge">{collabProjects ? collabProjects.length : 0}</span>
                    </button>}
                    <button onClick={() => meetings(user.id)} type="button" className="profile-card-button" id="last-button" >
                        Upcoming Meetings <span className="projects-badge">{numberOfMeetings ? numberOfMeetings : 0}</span>
                    </button>

                </div>
            </div>
        )
    } else return null


}



export default ProfileCard