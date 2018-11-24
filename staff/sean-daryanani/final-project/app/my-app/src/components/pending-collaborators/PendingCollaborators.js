import React from 'react'
import { Button } from 'mdbreact'


const PendingCollaborators = props => {
    const { pendingCollaborators } = props

    if (pendingCollaborators) {
        return (
            
            <section className="pending-collaborator-card">

                <img src={pendingCollaborators.profileImage} />

                <p>{pendingCollaborators.name}</p>

                <Button type="button" onClick={() => props.accept(pendingCollaborators.id)}>Accept</Button>

                <Button type="button" onClick={() => props.reject(pendingCollaborators.id)}>Reject</Button>

            </section >
        )
    } else return null

}

export default PendingCollaborators