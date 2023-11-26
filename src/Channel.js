import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import React from "react";
import Row from "react-bootstrap/Row";


function Channel(props) {
    return (
        <Form>
            <div class="channel-name-form">
                <Form.Label>Channel Name</Form.Label>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                    <Form.Control
                        placeholder="索菲亚一斤半"
                        aria-label="channelname"
                        aria-describedby="basic-addon1"
                    />
                </InputGroup>
            </div>
            <br />
            <div className="on-off-form">
                <Container>
                    <Row>
                        <Col><Form.Label>On/off</Form.Label></Col>
                        <Col><Form.Check type="switch" id="on-off" /></Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Text muted>
                            When on, caption.io will follow and transcript new videos from this channel.
                            </Form.Text>
                        </Col>
                    </Row>
                </Container>
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
                                When on, caption.io upload transcript to your channel directly(Permission required). When disabled, you need to download it manually.
                            </Form.Text>
                        </Col>
                    </Row>
                </Container>
            </div>
            <br />
            <div class="language-form">
                <Form.Label>Language</Form.Label><br />
                <Form.Select>
                    <option selected>Auto-Detect</option>
                    <option value="1">English</option>
                    <option value="2">简体中文</option>
                    <option value="3">繁體中文</option>
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
                    <option selected>srt</option>
                    <option value="1">srt</option>
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
                        <Col md={9}>
                            <Button variant="primary" type="submit">
                                Save and Follow the Channel
                            </Button>
                        </Col>
                        <Col md={{ span: 2, offset: 1}}>
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

export default Channel;