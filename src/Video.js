import React from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function Video(props) {

    return (
        <Form>
            <div class="video-url-form">
                <Form.Label>Video Name</Form.Label>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">https://youtube.com/watch?v=</InputGroup.Text>
                    <Form.Control
                        placeholder="HXDZ74cGz1g&t=174s"
                        aria-label="video-url"
                        aria-describedby="basic-addon1"
                    />
                </InputGroup>
            </div>
            <br />
            <div className="auto-upload-form">
                <Container>
                    <Row>
                        <Col><Form.Label>Auto Upload</Form.Label></Col>
                        <Col><Form.Check type="switch" id="auto-upload" /></Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Text id="onoffHelp" muted>
                                When on, the transcript will be uploaded to Youtube directly(Permission required)
                            </Form.Text>
                        </Col>
                    </Row>
                </Container>
            </div>
            <br/>
            <div class="language-form">
                <Form.Label>Language</Form.Label><br />
                <Form.Select>
                    <option selected>auto-detect</option>
                    <option value="1">English</option>
                    <option value="2">简体中文</option>
                    <option value="3">繁体中文</option>
                </Form.Select>
                <br />
                <Form.Text id="language-help" muted>
                    The primary language used in this channel.
                </Form.Text>
            </div>
            <br />
            <div class="output-form">
                <Form.Label>Output File</Form.Label><br />
                <Form.Select>
                    <option selected value="1">srt</option>
                    <option value="2">json</option>
                </Form.Select>
                <br />
            </div>
            <br />
            <div class="promotes-form">
                <Form.Label>Promotes</Form.Label>
                <br />
                <Form.Text id="promotes-help" muted>
                    Give AI some context about this video so AI could transcript better(e.g common terms, people name, topics.)
                </Form.Text>
                <InputGroup>
                    <Form.Control as="textarea" aria-label="With textarea" />
                </InputGroup>
            </div>
            <br />
            <div class="submit-form">
                <Container>
                    <Row>
                        <Col md={6}>
                            <Button variant="success" type="submit">
                                Transcript Now
                            </Button>
                        </Col>
                        <Col md={{ span: 3, offset: 3 }}>
                            <Button variant="danger" type="submit">
                                Delete
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </div>
        </Form>
    );

}

export default Video;