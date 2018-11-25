import React from 'react'
import './skillstag.css'
const SkillsTag = props => {
    const { skill } = props

    if (skill) {
        return (
                <button className="skills-tag" type="button">{skill}</button>
        )
    } else return null


}

export default SkillsTag