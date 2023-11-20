import React from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';


function Channel(props) {
    return (
        <Form>
            <Form.Label>Channel Name</Form.Label>
            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                <Form.Control
                    placeholder="索菲亚一斤半"
                    aria-label="channelname"
                    aria-describedby="basic-addon1"
                />
            </InputGroup>
            <Form.Check
                type="switch"
                id="on-off"
                label="On/Off"
            />
            <Form.Text id="onoffHelp" muted>
                When on, caption.io will follow and transcript new videos from this channel.
            </Form.Text>
            <Form.Check
                type="switch"
                id="auto-upload"
                label="Auto-upload"
            />
            <Form.Text id="onoffHelp" muted>
                When on, caption.io upload transcript to your channel directly(Permission required). When disabled, you need to download it manually.
            </Form.Text>

            <Form.Label>Language</Form.Label><br/>
            <select class="form-select">
                <option selected>auto-detect</option>
                <option value="1">English</option>
                <option value="2">简体中文</option>
                <option value="3">繁体中文</option>
            </select>
            <br/>
            <Form.Text id="language-help" muted>
                The primary language used in this channel.
            </Form.Text>

            <Form.Label>Output File</Form.Label><br />
            <select class="form-select">
                <option selected>srt</option>
                <option value="1">srt</option>
                <option value="2">json</option>
            </select>
            <br />

            <Form.Label>Promotes</Form.Label>
            <Form.Text id="promotes-help" muted>
                Some context of your channel and help AI transcript better(e.g common words, names, topics in this channel.)
            </Form.Text>
            <InputGroup>
                <Form.Control as="textarea" aria-label="With textarea" />
            </InputGroup>
            
            <br/>
            <Button variant="primary" type="submit">
                Save
            </Button>
            <Button variant="danger" type="submit">
                Delete
            </Button>
        </Form>
    );
}

export default Channel;