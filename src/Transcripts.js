import { DOMAIN } from "./lib/Config";
import { VIDEO_WORKFLOW_TYPE } from "./lib/Constants";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Pagination from 'react-bootstrap/Pagination';
import React, { useEffect, useState } from "react";
import Row from 'react-bootstrap/Row';

const ALL_ID = [1,2,3];
const NEXT_PAGE = -1;
const PREV_PAGE = 0;
const ROWS_PER_PAGE = 10;


function getPageItems(lastPage, activePage, onPageChange) {
    let items = [];

    if (lastPage == 0) {
        return items;
    }
    
    for (let page = 0; page <= lastPage + 1; page++) {
        let pageKey = page <= lastPage ? page : -1;
        let pageText = page;
        if (pageKey === PREV_PAGE) {
            pageText = "Previous";
        } else if (pageKey === NEXT_PAGE) {
            pageText = "Next";
        }

        let onPageClicked = (_event) => {
            onPageChange(pageKey);
        }

        let item = <Pagination.Item key={pageKey} active={pageKey === activePage} onClick={onPageClicked}>
            {pageText}
        </Pagination.Item>;

        items.push(item);
    }

    return items;
}



function getRow(workflow, selected, onSelectOne) {
    const isSelected = selected.has(workflow.id);
    const videoTitle = workflow.video_uuid ?? "null"; // workflow.video_title
    const transcript = workflow.transcript_fmts.join(",") ?? "empty";

    let uploadSign = <p style={{ color: "red" }}>x</p>;
    if (workflow.auto_upload.toLowerCase() === "true") {
        uploadSign = <p style={{ color: "green" }}>✓</p>;
    }
    const onCheckboxChange = (event)=> {
        onSelectOne(workflow.id, event);
    };


    return <div>
        <Row>
            <Col xs={1}>
                <Form.Check
                    inline name="group1"
                    type="checkbox"
                    id={`#${workflow.id}`}
                    checked={selected.has(workflow.id)}
                    onChange={onCheckboxChange}
                />
            </Col>
            <Col> 
                <a href="https://www.example.com" target="_blank"> {videoTitle}</a>
            </Col>
            <Col className="d-flex align-items-center justify-content-center">
                <a href="https://www.example.com" target="_blank">{transcript}</a>
            </Col>
            <Col className="d-flex align-items-center justify-content-center">
                {uploadSign}
            </Col>
            <Col className="d-flex align-items-center justify-content-center">
                {workflow.status}
            </Col>
        </Row>
        <br/>
    </div>
}

function selectWorkflowByPage(activePage, workflows) {
    let selectedWorkflows = [];
    if (workflows !== null && workflows !== undefined) {
        const startIndex = Math.max(0, activePage * ROWS_PER_PAGE - ROWS_PER_PAGE); //incusive
        const endIndex = Math.min(workflows.length, activePage * ROWS_PER_PAGE); // exclusive
        console.log("start=" + startIndex + " end=" + endIndex);
        selectedWorkflows = workflows.slice(startIndex, endIndex);
    }
    return selectedWorkflows;
}

function getLastPage(workflows) {
    let lastpage = 0;
    if (workflows !== null && workflows !== undefined) {
        lastpage = Math.ceil(workflows.length / ROWS_PER_PAGE);
    }
    return lastpage;
}

function Transcripts(props) {
    const [selected, setSelected] = useState(new Set());
    const [activePage, setActivePage] = useState(1);
    const [workflows, setWorkflows] = useState([]);

    const lastPage = getLastPage(workflows);

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
            const newSelected = new Set((workflows ?? []).map(
                w => w.id
            ));
            setSelected(newSelected);
        } else {
            const newSelected = new Set();
            setSelected(newSelected);
        }
    }

    let onPageChange = (clickedPage) => {
        console.log("clicked page" + clickedPage);
        let newPage = clickedPage;
        if (clickedPage === NEXT_PAGE) {
            newPage = Math.min(activePage + 1, lastPage);
        } else if (clickedPage === PREV_PAGE) {
            newPage = Math.max(activePage -1, 1);
        }

        setActivePage(newPage);
    }

    useEffect(
        () => {
            async function fetchWorkflows() {
                const url = `${DOMAIN}/workflow/list?type=${VIDEO_WORKFLOW_TYPE}`;
                const workflows = await fetch(
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
                        setWorkflows([]);
                });

                setWorkflows(workflows);
            }


            fetchWorkflows()
        },
        [activePage]
    );
    
    return (
        <Form>
            <div id="transcripts-form">
                <Container >
                    <Row>
                        <Col xs={1}>
                            <Form.Check inline name="group1" type="checkbox" id="#selectAll" onChange={onSelectAll}/>
                        </Col>
                        <Col className="d-flex align-items-center justify-content-center">Video</Col>
                        <Col className="d-flex align-items-center justify-content-center">Transcripts</Col>
                        <Col className="d-flex align-items-center justify-content-center">Auto-Uploaded</Col>
                        <Col className="d-flex align-items-center justify-content-center">Status</Col>
                    </Row>
                    {
                        selectWorkflowByPage(activePage, workflows).map((w) => (
                            getRow(w, selected, onSelectOne)
                        ))
                    }
                </Container>
            </div>
            <br/>
            <Pagination size="sm">{getPageItems(lastPage, activePage, onPageChange)}</Pagination>
            <br />
            <div id="submit-form">
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