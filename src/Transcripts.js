import { DOMAIN } from "./lib/Config";
import { VIDEO_WORKFLOW_TYPE } from "./lib/Constants";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Pagination from 'react-bootstrap/Pagination';
import React, { useEffect, useState } from "react";
import Row from 'react-bootstrap/Row';

const NEXT_PAGE = -1;
const PREV_PAGE = 0;
const ROWS_PER_PAGE = 10;
const STATUS_MAP = {
    1: "5%", // TODO
    2: "10%", // LOCKED
    3: "15%",// CLAIMED
    4: "50%", // WORKING
    5: "Error",   // ERROR
    6: "Failed", //FAILED
    7: "Done",    // DONE
};


function formatTime(unixtime) {
    const now = new Date();
    const time = new Date(unixtime * 1000);
    const ONE_HOUR_IN_MS = 3600 * 1000;
    const ONE_DAY_IN_MS = 24 * ONE_HOUR_IN_MS;
    const ONE_WEEK_IN_MS = 7 * ONE_DAY_IN_MS;
    const ONE_YEAR_IN_MS = 365 * ONE_DAY_IN_MS;

    let descriptive = Math.ceil((now.getTime() - unixtime * 1000) / ONE_YEAR_IN_MS) + " years ago";
    if (time.getDate() === now.getDate() && time.getMonth() === now.getMonth()) {
        // same day, return a time.
        return time.toLocaleTimeString();
    } else if (now.getTime() - unixtime * 1000 <= ONE_DAY_IN_MS + 1000) {
        return Math.ceil((now.getTime() - unixtime * 1000) / ONE_HOUR_IN_MS) + " hours ago";
    } else if (now.getTime() - unixtime * 1000 <= ONE_WEEK_IN_MS + 1000) {
        return Math.ceil((now.getTime() - unixtime * 1000) / ONE_DAY_IN_MS) + " days ago";
    } else if (now.getTime() - unixtime * 1000 <= ONE_YEAR_IN_MS + 1000) {
        return Math.ceil((now.getTime() - unixtime * 1000) / ONE_WEEK_IN_MS) + " weeks ago";
    }
    // TODO have a hints which show actual time when hover over it.

    return descriptive;
}


function getPageItems(lastPage, activePage, onPageChange) {
    let items = [];

    if (lastPage === 0) {
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
    const videoTitle = workflow.video_uuid ?? "null"; // workflow.video_title
    // Better time format.
    // const create_at = new Date(workflow.create_at * 1000).toLocaleString();
    const create_at = formatTime(workflow.create_at);
    const transcript = workflow.transcript_fmts.join(",") ?? "empty";

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
            <Col className="d-flex align-items-center justify-content-center">
                <time datetime={create_at}> {create_at}</time>
            </Col>
            <Col className="d-flex align-items-center justify-content-center"> 
                <a href={"https://www.youtube.com/watch?v=" + workflow.video_uuid} target="_blank">
                    {videoTitle}
                </a>
            </Col >
            <Col className="d-flex align-items-center justify-content-center">
                <a href="https://www.example.com" target="_blank">{transcript}</a>
            </Col>
            <Col className="d-flex align-items-center justify-content-center">
                {STATUS_MAP[workflow.status]}
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
                if (workflows) {
                    workflows.sort((w1, w2) => w2.create_at - w1.create_at);
                    setWorkflows(workflows);
                }
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
                        <Col className="d-flex align-items-center justify-content-center">Created At</Col>
                        <Col className="d-flex align-items-center justify-content-center">Video</Col>
                        <Col className="d-flex align-items-center justify-content-center">Transcripts</Col>
                        <Col className="d-flex align-items-center justify-content-center">Progress</Col>
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