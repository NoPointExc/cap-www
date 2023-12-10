import { DOMAIN } from "./lib/Config";
import { VIDEO_WORKFLOW_TYPE } from "./lib/Constants";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import React, { useState } from "react";
import Row from "react-bootstrap/Row";


function Video(props) {
    const [formData, setFormData] = useState(
        {
            video_uuid: null,
            auto_upload: false,
            language: null,
            transcript_fmts: ["srt"],
            promotes: null
        }
    );
    
    const onFormSubmit = async (event) => {
        event.preventDefault(); // Prevents the default form submission behavior

        const arg_json_str = JSON.stringify(formData);
        const url = `${DOMAIN}/workflow/add?type=${VIDEO_WORKFLOW_TYPE}&args=${arg_json_str}`;
        const rsp = await fetch(
            url,
            {
                method: "POST",
                headers: { "accept": "application/json" },
                credentials: "include",
            },
        )
            .then(response => response.json())
            .catch((error) => {
                console.log(`Failed to fetch from ${url} with error: ${error}`);
        });

        console.log(`workflow_id=${rsp.workflow_id} ?? null`);
    };

    const onFormChange = (event) => {
        // Update the form data state when input values change
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    // const onCheckChange = (event) => {
    //     // Update the form data state when input values change
    //     setFormData({
    //         ...formData,
    //         [event.target.name]: event.target.checked,
    //     });
    // };

    return (
        <Form onSubmit={onFormSubmit}>
            <div class="video-url-form">
                <Form.Label>Video Name</Form.Label>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">https://youtube.com/watch?v=</InputGroup.Text>
                    <Form.Control
                        name="video_uuid"
                        value={formData.video_uuid}
                        onChange={onFormChange}
                        placeholder="HXDZ74cGz1g&t=174s"
                        aria-label="video-url"
                        aria-describedby="basic-addon1"
                    />
                </InputGroup>
            </div>
            <br />
            {/* <div className="auto-upload-form">
                <Container>
                    <Row>
                        <Col><Form.Label>Auto Upload</Form.Label></Col>
                        <Col>
                            <Form.Check
                                type="switch"
                                name="auto_upload"
                                checked={formData.auto_upload}
                                onChange={onCheckChange}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Text id="onoffHelp" muted>
                                When on, the transcript will be uploaded to Youtube directly(Permission required)
                            </Form.Text>
                        </Col>
                    </Row>
                </Container>
            </div> */}
            <br/>
            <div class="language-form">
                <Form.Label>Language</Form.Label><br />
                <Form.Select
                    name="language"
                    value={formData.language}
                    onChange={onFormChange}
                >
                    <option selected value={null}>auto-detect</option>
                    <option value="en">English</option>
                    <option value="zh">简体中文</option>
                    <option value="zh-tw">繁體中文</option>
                </Form.Select>
                <br />
                <Form.Text id="language-help" muted>
                    The primary language used in this channel.
                </Form.Text>
            </div>
            <br />
            <div class="output-form">
                <Form.Label>Output File</Form.Label><br />
                <Form.Select
                    name="transcript_fmts"
                    value={formData.transcript_fmts}
                    onChange={onFormChange}
                >
                    <option selected value="srt">srt</option>
                    <option value="json">json</option>
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
                    <Form.Control
                        name="promotes"
                        value={formData.promotes}
                        onChange={onFormChange}
                        as="textarea"
                        aria-label="With textarea"
                    />
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
                    </Row>
                </Container>
            </div>
        </Form>
    );

}

export default Video;