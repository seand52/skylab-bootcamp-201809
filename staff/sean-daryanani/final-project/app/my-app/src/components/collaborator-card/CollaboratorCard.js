import React from 'react'

const CollaboratorCard = props => {
    const {collaborator} = props

    if(collaborator) {
        return(
            <div>
                <img src={collaborator.profileImage} />
                <p>{collaborator.name}</p>
            </div>
        )
    } else return null

}

export default CollaboratorCard