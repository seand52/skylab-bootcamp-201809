import React from 'react'
import { Button, Card, CardBody, CardImage, CardTitle, CardText, Col, Badge } from 'mdbreact';
import {withRouter, Link} from 'react-router-dom'
import SkillsTag from '../skills-tag/SkillsTag'


const ProjectCard = props => {
    const { project, searchTag } = props

    if (project) {
        return (

            <Col>
                <Card style={{ width: "16rem" }}>
                    <CardImage
                        className="img-fluid"
                        src={project.projectImage}
                        style={{height: "150px", width:"100%"}}
                        waves
                    />
                    <CardBody>
                        <CardTitle>{project.name}</CardTitle>
                        <CardText>
                        {project.description}
                        </CardText>
                        {project.skills.map((skill, index) => <SkillsTag searchTag={searchTag} key={index} skill={skill} pill/>)}

                        <Link to={`/project/${project.id}`}><Button type="button" >View Project</Button></Link>

                    </CardBody>
                </Card>
            </Col>
        )
    } else return null



}

export default withRouter(ProjectCard)