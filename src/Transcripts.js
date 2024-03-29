import "./css/dot-spiner.css";

import { DOMAIN } from "./lib/Config";
import { VIDEO_WORKFLOW_TYPE } from "./lib/Constants";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Pagination from 'react-bootstrap/Pagination';
import React, { useEffect, useState } from "react";
import Row from 'react-bootstrap/Row';

import DownloadButton from './transcripts/DownloadButton';
import RetryButton from "./transcripts/RetryButton";
import ReadableTime from "./transcripts/ReadableTime"
import { LoadingIcon, loadingGif2 } from './Icons';

const NEXT_PAGE = -1;
const PREV_PAGE = 0;
const ROWS_PER_PAGE = 10;
const STATUS_MAP = {
    1: "5%", // TODO
    2: "10%", // LOCKED
    3: "15%", // CLAIMED
    4: "50%", // WORKING
    5: "Error", // ERROR
    6: "Failed", //FAILED
    7: "Done", // DONE
    8: "No Enough credits", // NO_CREDIT
    20: "DELETED" // DELETED
};

const ColClassName = "d-flex align-items-center justify-content-center";


function asTwoDigit(num) {
    return num < 10 ? "0" + num : num;
}

function formatDuration(seconds) {
    // hh:mm:ss, example outputs: 1:10, 11:40:46
    let hour = 0;
    let min = 0;
    let formated = "";
    if (seconds >= 3600) {
        //"hh:"
        hour = Math.floor(seconds / 3600);
        seconds = seconds - hour * 3600;
        formated = formated + asTwoDigit(hour) + ":";
    }
    if (seconds >= 60) {
        // "mm:"
        min = Math.floor(seconds / 60);
        seconds = seconds - min * 60;
        formated = formated + asTwoDigit(min) + ":";
    }
    return formated + asTwoDigit(seconds);
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
            pageText = " < ";
        } else if (pageKey === NEXT_PAGE) {
            pageText = " > ";
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
    const uuid = workflow.uuid;
    const title = workflow.snippt.title ?? uuid;

    let transcriptUrls = <div>{LoadingIcon}</div>;
    const transcript = workflow.transcript;
    if (transcript !== null && transcript !== undefined && Object.keys(transcript).length !== 0) {
        let formats = Object.keys(transcript);
        transcriptUrls = formats.map(
            f => <DownloadButton content={transcript[f]} uuid={uuid} format={f}  />
        );
    }
    const duration = workflow.snippt.duration ? formatDuration(workflow.snippt.duration) : <div>{LoadingIcon}</div>;;

    const onCheckboxChange = (event) => {
        onSelectOne(workflow.id, event);
    };


    return <div>
        <Row>
            <Col className={ColClassName}>
                <Form.Check
                    inline name="group1"
                    type="checkbox"
                    id={`#${workflow.id}`}
                    checked={selected.has(workflow.id)}
                    onChange={onCheckboxChange}
                />
            </Col>
            <Col className={ColClassName}>
                <ReadableTime unixtime={workflow.create_at + 1}></ReadableTime>
                {/* <time datetime={create_at}> {create_at}</time> */}
            </Col>
            <Col className={ColClassName}> 
                <a href={"https://www.youtube.com/watch?v=" + uuid} target="_blank">
                    {title}
                </a>
            </Col >
            <Col className={ColClassName}>
                {duration}
            </Col>
            <Col className={ColClassName}>
                {transcriptUrls}
            </Col>
            <Col className={ColClassName}>
                {STATUS_MAP[workflow.status]}
            </Col>
            <Col className={ColClassName}>
                <RetryButton workflow_id={workflow.id}/>
            </Col>
        </Row>
        <br/>
    </div>
}

function selectWorkflowByPage(activePage, workflows) {
    let selectedWorkflows = [];
    if (workflows !== null && workflows !== undefined) {
        const startIndex = Math.max(0, activePage * ROWS_PER_PAGE - ROWS_PER_PAGE); //incusive
        const endIndex = Math.min(workflows.length, activePage * ROWS_PER_PAGE+1); // exclusive
        console.log("start=" + startIndex + " end=" + endIndex + "for " + workflows.length + " workflows");
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
    const [loading, setLoading] = useState(true);

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

    const onDelete = async (event) => {
        event.preventDefault();

        if (selected.size > 0) {
            const toDeleteIds = Array.from(selected);
            const url = `${DOMAIN}/workflow/delete`;
            await fetch(
                url,
                {
                    method: "POST",
                    headers: {
                        "accept": "application/json",
                        "content-type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(toDeleteIds)
                },
            )
            .then(_response => {
                const updatedWorkflows = workflows.filter((w) => !selected.has(w.id));
                setWorkflows(updatedWorkflows);
                setSelected(new Set());
                console.log(`Deleted workflows: ${selected}`);
            })
            .catch((error) => {
                console.log(`Failed to delete workflow with: ${url} and error: ${error}`);
            });
        } else {
            console.log("Nothing to delete");
        }

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
                    setLoading(false);
                }
            }


            fetchWorkflows()

        },
        [activePage]
    );
    
    const workflowRows = selectWorkflowByPage(activePage, workflows).map(
        (w) => (getRow(w, selected, onSelectOne))
    );

    const spiner = <div style={{ marginTop: '50px' }}>
        <section class="dots-container">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </section>
    </div>;

    return (
        <Form onSubmit={onDelete}>
            <div id="transcripts-form">
                <Container >
                    <Row>
                        <Col className={ColClassName}>
                            <Form.Check inline name="group1" type="checkbox" id="#selectAll" onChange={onSelectAll}/>
                        </Col>
                        <Col className={ColClassName}>Created At</Col>
                        <Col className={ColClassName}>Video</Col>
                        <Col className={ColClassName}>Duration</Col>
                        <Col className={ColClassName}>Transcripts</Col>
                        <Col className={ColClassName}>Progress</Col>
                        <Col className={ColClassName}>Retry</Col>
                    </Row>
                    {   
                        loading ? spiner : workflowRows
                    }
                </Container>
            </div>
            <br/>
            <Pagination size="sm">{getPageItems(lastPage, activePage, onPageChange)}</Pagination>
            <br />
            <div class="submit-form">
                <Container>
                    <Row>
                        <Col>
                            <Button variant="danger" type="submit" disabled={selected.size === 0}>
                                Delete {selected.size} transcripts
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </div>
        </Form>

    );

}


export default Transcripts;