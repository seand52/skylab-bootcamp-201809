import React from 'react'
import './collabcard.css'
import { Button } from 'mdbreact'
const CollaboratorCard = props => {
    const { collaborator, clickName, userId, ownerId, removeCollaborator } = props

    if (collaborator) {
        return (
            <div className="collab-card">
                <img src={collaborator.profileImage} alt="profile" />
                <p onClick={clickName}>{collaborator.name}</p>
                {(userId === ownerId) && <Button onClick={() => removeCollaborator(collaborator.id)}>Remove Collaborator</Button>}
            </div>
        )
    } else return null

}

export default CollaboratorCard