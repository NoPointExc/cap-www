import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Pagination from 'react-bootstrap/Pagination';

const allId = [1,2,3];


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



function getRow(id, videoTitle, transcript, autoUpload, status, isSelected, onSelectOne) {
    let uploadSign = <p style={{ color: "red" }}>x</p>;
    if (autoUpload) {
        uploadSign = <p style={{ color: "green" }}>✓</p>;
    }
    const onCheckboxChange = (event)=> {
        onSelectOne(id, event);
    };

    return <div>
        <Row>
            <Col xs={1}>
                <Form.Check inline name="group1" type="checkbox" id={"#" + id} checked={isSelected} onChange={onCheckboxChange}/>
            </Col>
            <Col>{videoTitle}</Col>
            <Col className="d-flex align-items-center justify-content-center"><a href="https://www.example.com" target="_blank">{transcript}</a></Col>
            <Col className="d-flex align-items-center justify-content-center">{uploadSign}</Col>
            <Col className="d-flex align-items-center justify-content-center">{status}</Col>
        </Row>
        <br/>
    </div>
}

function Transcripts(props) {
    const [selected, setSelected] = useState(new Set());

    let onSelectOne = (id ,event) => {
        if (event.target.checked) {
            const newSelected = new Set(selected);
            newSelected.add(id);
            setSelected(newSelected);
        } else {
            const newSelected = new Set(selected);
            newSelected.delete(id);
            setSelected(newSelected);
        }
    }

    let onSelectAll = (event) => {
        if (event.target.checked) {
            const newSelected = new Set([...selected, ...allId]);
            setSelected(newSelected);
        } else {
            const newSelected = new Set();
            setSelected(newSelected);
        }
    }

    

    return (
        <Form>
            <div class="transcripts-form">
                <Container>
                    <Row>
                        <Col xs={1}>
                            <Form.Check inline name="group1" type="checkbox" id="#selectAll" onChange={onSelectAll}/>
                        </Col>
                        <Col className="d-flex align-items-center justify-content-center">Video</Col>
                        <Col className="d-flex align-items-center justify-content-center">Transcripts</Col>
                        <Col className="d-flex align-items-center justify-content-center">Auto-Uploaded</Col>
                        <Col className="d-flex align-items-center justify-content-center">Status</Col>
                    </Row>
                    {getRow(1, "挑酒像在看天书？秒懂威士忌酒标的速成指南", ".srt", false, "done", selected.has(1), onSelectOne)}
                    {getRow(2, "在家也能调酒？只要十瓶就能开张！手把手教你打造家庭吧台", ".srt", false, "done", selected.has(2), onSelectOne)}
                    {getRow(3, "调酒很难吗？三分钟一杯！家庭调酒之金酒篇 | Best Gin-Based Cocktails To Make At Home | Sophia1.5", ".srt", false, "done", selected.has(3), onSelectOne)}
                </Container>
            </div>
            <br/>
            <Pagination size="sm">{getPageItems(3, 2)}</Pagination>
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