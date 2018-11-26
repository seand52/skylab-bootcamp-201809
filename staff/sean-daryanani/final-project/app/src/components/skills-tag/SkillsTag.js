import React from 'react'
import './skillstag.css'
const SkillsTag = props => {
    const { skill, searchTag } = props

    if (skill) {
        return (
                <button onClick={() => searchTag(skill)} className="skills-tag" type="button">{skill}</button>
        )
    } else return null


}

export default SkillsTag