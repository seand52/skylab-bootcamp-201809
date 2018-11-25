import React from 'react'
import './collabcard.css'
const CollaboratorCard = props => {
    const {collaborator, clickName} = props

    if(collaborator) {
        return(
            <div className="collab-card">
                <img src={collaborator.profileImage} alt="profile" />
                <p onClick={clickName}>{collaborator.name}</p>
            </div>
        )
    } else return null

}

export default CollaboratorCard