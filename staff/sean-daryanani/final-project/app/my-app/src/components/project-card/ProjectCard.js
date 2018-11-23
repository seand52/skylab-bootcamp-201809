import React from 'react'
import { Button, Card, CardBody, CardImage, CardTitle, CardText, Col, Badge } from 'mdbreact';
import {withRouter, Link} from 'react-router-dom'


const ProjectCard = props => {
    const { project } = props

    if (project) {
        return (

            <Col>
                <Card style={{ width: "16rem" }}>
                    <CardImage
                        className="img-fluid"
                        src={project.projectImage}
                        waves
                    />
                    <CardBody>
                        <CardTitle>{project.name}</CardTitle>
                        <CardText>
                        {project.description}
                        </CardText>
                        {project.skills.map((skill, index) => <Badge color="light-blue" key={index} pill>{skill}</Badge>)}

                        <Link to={`/project/${project.id}`}><Button type="button" >View Project</Button></Link>

                    </CardBody>
                </Card>
            </Col>
        )
    } else return null



}

export default withRouter(ProjectCard)