import React from 'react'
import { Button, Card, CardBody, CardImage, CardTitle, CardText, Col } from 'mdbreact';

const ProjectCard = props => {

    return (

        <Col>
            <Card style={{ width: "16rem" }}>
                <CardImage
                    className="img-fluid"
                    src="https://mdbootstrap.com/img/Photos/Others/images/43.jpg"
                    waves
                />
                <CardBody>
                    <CardTitle>Card title</CardTitle>
                    <CardText>
                        Some quick example text to build on the card title and make
                        up the bulk of the card&apos;s content.
            </CardText>
                    <Button type="button" >Button</Button>
                </CardBody>
            </Card>
        </Col>

    )

}

export default ProjectCard