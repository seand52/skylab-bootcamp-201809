import React from 'react'
import './profile-card.css'

const ProfileCard = props => {
    const { user, myProjects, collabProjects, showCollabProjects, projectsStarted, uploadImage, userId, profileImage, meetings, numberOfMeetings } = props

    if (user) {
        const { name, joinDate, city, githubProfile, skills } = user

        return (
            <div className='profile-card-container'>
                <div className='top-area'>
                    <div className='basic-info'>
                        <p><span>Name</span>: {name}</p>
                        <p><span>Joined</span>: {joinDate}</p>
                        <p><span>Location</span>: {city}</p>
                    </div>
                    <div className='profile-img-container'>
                        <img src={user.profileImage}/>
                    </div>
                    {(userId===user.id) && <form encType="multipart/form-data" onSubmit={uploadImage}>
                        <input type="file" name="avatar" onChange={uploadImage} />
                    </form>}
                </div>
                <div className='bottom-area'>
                    <button onClick={projectsStarted} type="button" className="btn btn-primary">
                        Projects started <span className="badge badge-light">{myProjects ? myProjects.length : 0}</span>
                    </button>
                    {(userId===user.id) && <button onClick={showCollabProjects} type="button" className="btn btn-primary">
                        Collaborations <span className="badge badge-light">{collabProjects ? collabProjects.length : 0}</span>
                    </button>}
                    <button onClick={() => meetings(user.id)} type="button" className="btn btn-primary">
                        Upcoming Meetings <span className="badge badge-light">{numberOfMeetings ? numberOfMeetings : 0}</span>
                    </button>

                </div>
            </div>
        )
    } else return null


}



export default ProfileCard