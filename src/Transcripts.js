import React from "react";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Pagination from 'react-bootstrap/Pagination';



function getPageItems(pageNum, activeId) {
    let items = [];
    items.push(
        <Pagination.Item key={0} active={false}>
            Previous
        </Pagination.Item>,
    );
    
    for (let number = 1; number <= pageNum; number++) {
        items.push(
            <Pagination.Item key={number} active={number === activeId}>
                {number}
            </Pagination.Item>,
        );
    }

    items.push(
        <Pagination.Item key={-1} active={false}>
            Next
        </Pagination.Item>,
    );

    return items;
}



function Transcripts(props) {

    let items = getPageItems(3, 2);

    return (
        <Form>
            <div class="transcripts-form">
                <Container>
                    <Row>
                        <Col xs={1}>
                            <Form.Check inline name="group1" type="checkbox" id='someid'/>
                        </Col>
                        <Col>Video</Col>
                        <Col>Transcripts</Col>
                        <Col>Auto-Uploaded</Col>
                        <Col>Status</Col>
                    </Row>
                    <Row>
                        <Col xs={1}>
                            <Form.Check inline name="group1" type="checkbox" id='someid' />
                        </Col>
                        <Col>一个有趣的标题</Col>
                        <Col><a href="https://www.example.com" target="_blank">中文字幕.srt</a></Col>
                        <Col><p style={{color:"green"}}>✓</p></Col>
                        <Col>  </Col>
                    </Row>
                    <Row>
                        <Col xs={1}>
                            <Form.Check inline name="group1" type="checkbox" id='someid' />
                        </Col>
                        <Col>一个有趣的标题</Col>
                        <Col><a href="https://www.example.com" target="_blank">中文字幕.srt</a></Col>
                        <Col><p style={{ color: "red" }}>x</p></Col>
                        <Col>  </Col>
                    </Row>
                </Container>
            </div>
            <br/>
            <Pagination size="sm">{items}</Pagination>
            <br />
            <div class="submit-form">
                <Container>
                    <Row>
                        <Col>
                            <Button variant="primary" type="submit">
                                Download Selected
                            </Button>
                        </Col>
                        <Col>
                            <Button variant="danger" type="submit">
                                Delete Selected
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </div>
        </Form>

    );

}


export default Transcripts;