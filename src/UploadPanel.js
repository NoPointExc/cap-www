import React from "react";
import Button from "react-bootstrap/Button";
import ProgressBar from 'react-bootstrap/ProgressBar'
import S3 from "./lib/S3";
import { Dropzone, FileItem } from "dropzone-ui";

const SUBTITLE_JOB_REFRESH_TIME_MS = 2000;
// Accepted By AWS transcript service
const ACCEPTED_FILE = ".mp3, .mp4, ogg, .webm, .amr, .wav, .flac";

// Stages of the uploading and processing.
const STAGE_STARTING = "STARTING";
const STAGE_UPLOADING = "Uploading video to server.";
const STAGE_PROCESSING = "Speech-to-text Running.";
const STAGE_RESULT_READY = "Speech-to-text Completed.";
const STAGE_ERROR_UPLOAD_FAILED = "Error: Uploading failed.";
const STAGE_ERROR_SPEECH_2_TEXT = "Error: Failed to speech to test process failed";
const STAGE_ERROR_TIMEOUT = "Error: Speech to text job timeout."
const RESUMABLE_STAGES = [STAGE_PROCESSING, STAGE_RESULT_READY];


export default class UploadPanel  extends React.Component {
    constructor(props) {
        super(props);

        this.onTranscriptJSONReady = props.onTranscriptJSONReady;

        const stage = sessionStorage.getItem("stage") || STAGE_STARTING;
        this.state = {
            stage: stage,
            progress: 0,
            videoFile: null,
            showUploadZone: !RESUMABLE_STAGES.includes(stage),
        };

        this.updateFile = this.updateFile.bind(this);
        this.onStart = this.onStart.bind(this);
        this.onRestart = this.onRestart.bind(this);
        this.onResume = this.onResume.bind(this);
        this.getSubtitleResult = this.getSubtitleResult.bind(this);
        this.fileInput = React.createRef();

        // TODO: checks how long it takes for a 1h video
        // wait for at most 30mins
        this.subtitleJobTimeout = 30 * 60 * 1000;
        this.s3 = new S3();
        // Set after reset is invoked.
        this.restart = false;
        if (RESUMABLE_STAGES.includes(stage)) {
            this.onResume();
        }
    }

    async onStart() {
        this.restart = false;
        if (this.state.videoFile === null) {
            alert("Video/Audio File required.");
            return;
        }

        const videoFile = this.state.videoFile;

        // TODO If file size larger then 2GB(Required by AWS transcribe).
        const videoURL = URL.createObjectURL(videoFile);
        sessionStorage.setItem("videoURL", videoURL);
        this.props.onUpload(videoURL);

        this.setState({
            stage: STAGE_UPLOADING,
            progress: 20,
            showUploadZone: false,
        });

        try {
            // 1. Upload to AWS S3
            const path_to_file = await this.uploadToS3(videoFile);
            console.log(`Uploaded to S3 path=${path_to_file}`);
            if (path_to_file === null) {
                console.log("Path to file is null after attempt to upload to s3");
                throw STAGE_ERROR_UPLOAD_FAILED;
            }

            // 2. Invoke queue_get_subtitle_job
            const subtitleJobId = await this.startSubtitleJob(path_to_file);
            console.log(`Started subtitle job with id ${subtitleJobId}`);
            if (subtitleJobId === null) {
                this.setState({stage: STAGE_ERROR_SPEECH_2_TEXT});
                return;
            }

            // 3. Pull speech to text job status with get_subtitle_result
            console.log(`Getting subtitle result for job id: ${subtitleJobId}`);
            await this.getSubtitleResult(subtitleJobId);

        } catch (error) {
            console.log(`Failed to upload to from Computer with error: ${error}`);
            // TODO alert here for errors
            this.setState({
                stage: STAGE_ERROR_UPLOAD_FAILED,
                progress: 20,
                showUploadZone: true,
            });
        }

    }

    onRestart(){
        this.setState({
            stage: STAGE_STARTING,
            progress: 0,
            videoFile: null,
            showUploadZone: true,
        });
        sessionStorage.setItem("progress", 0);
        sessionStorage.setItem("stage", STAGE_STARTING);
        this.restart = true;
        this.props.onRestart();
    }

    async onResume() {
        // resume for STAGE_RESULT_READY, STAGE_UPLOADING, STAGE_PROCESSING stages
        const stage = this.state.stage;
        console.log(`Resuming from ${stage}`);
        // reset caption text & video player
        const videoURL = sessionStorage.getItem("videoURL");
        const progress = sessionStorage.getItem("progress");
        const transcriptResult = sessionStorage.getItem("transcript_JSON_result");

        if (videoURL) {
            console.log(videoURL);
            this.props.onUpload(videoURL);
        }

        if (transcriptResult) {
            this.props.onTranscriptJSONReady(transcriptResult);
        }

        if (progress) {
            this.setState({progress: progress});
        }

        let subtitleJobId = null;
        if (stage === STAGE_PROCESSING) {
            subtitleJobId = sessionStorage.getItem("subtitle_job_id");
        }
        // continue wait for subtitle_job
        if (subtitleJobId === null) {
            this.setState({stage: STAGE_ERROR_SPEECH_2_TEXT});
            return;
        }

        await this.getSubtitleResult(subtitleJobId);
    }

    async onSubtitleJobReady(result) {
        this.setState({stage: STAGE_RESULT_READY});
        sessionStorage.setItem("stage", STAGE_RESULT_READY);
        sessionStorage.setItem("transcript_JSON_result", result);
        this.onTranscriptJSONReady(result);
    }

    async updateFile(droppedFiles){
        let file = droppedFiles[0].file;
        if (file.name.length > 100) {
            console.log(
                "The file name is too long(>100). We are going to use the 1st 100 char out " +
                file.name.length + "chars as the file name"
            );
            file.name = file.name.substring(0, 100);
        }
        this.setState({videoFile: file});
    }

    async uploadToS3(file) {
        // const path_to_file = await this.s3.upload(file);
        // console.log(`Uploaded to S3 path=${path_to_file}`);
        // sessionStorage.setItem("path_to_s3", path_to_file);
        // this.setState({progress: 100});
        return "path_to_file";
    }

    async startSubtitleJob(path_to_file) {
        let job_id = null;

        // TODO mediaFormat and language code required.
        const url = `dummy_domain/api/video/queue_get_subtitle_job`;
        const response = await fetch(
            url,
            {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({"path_to_video": path_to_file}),
                credentials: "include",
            },
        )
        .then(response => response.json())
        .catch((error) => {
            console.log(`Failed to fetch from ${url} with error: ${error}`);
            throw error;
        });

        if (response.job_id) {
            job_id = response.job_id;
            sessionStorage.setItem("subtitle_job_id", job_id);
            sessionStorage.setItem("stage", STAGE_PROCESSING);
            this.setState({stage: STAGE_PROCESSING, progress: 16});
        }

        return job_id
    }


    async getSubtitleResult(subtitleJobId) {
        if (this.subtitleJobTimeout <= 0) {
            this.setState({stage: STAGE_ERROR_TIMEOUT});
            throw STAGE_ERROR_TIMEOUT;
        }
        console.log(`job: ${subtitleJobId} getSubtitleResult: ${this.subtitle_job_timeout}ms left before timeout.`);

        if (subtitleJobId) {
            return fetch(
                `dummy_domain/api/video/get_subtitle_result`,
                {
                    method: "POST",
                    headers: {"Content-Type" : "application/json"},
                    body: JSON.stringify({"job_id": subtitleJobId}),
                    credentials: "include",
                },
            )
            .then(response => response.json())
            .then((result)=>{
                this.subtitleJobTimeout -= SUBTITLE_JOB_REFRESH_TIME_MS;
                console.log(`Job ${subtitleJobId} is ${result.job_status}`);

                // job_status including:
                // - COMPLETED
                // - FAILED
                // - IN_PROGRESS
                // - QUEUED
                if (result.job_status === "FAILED") {
                    throw STAGE_ERROR_SPEECH_2_TEXT;
                } else if (result.job_status === "COMPLETED") {
                    const subtitle_url = result.subtitle_file_uri;
                    const progress = 100;

                    sessionStorage.setItem("progress", progress);
                    sessionStorage.setItem("subtitle_url", subtitle_url);
                    sessionStorage.setItem("stage", STAGE_RESULT_READY);

                    this.setState({stage: STAGE_RESULT_READY,  progress: progress});
                    return subtitle_url;
                } else if (result.job_status === "IN_PROGRESS") {
                    // const currentProgress = this.state.progress;
                    const currentProgress = parseInt(sessionStorage.getItem("progress") || 0);
                    const progress = Math.min(90, currentProgress + 1);
                    sessionStorage.setItem("progress", progress);
                    this.setState({progress: progress});
                }
            })
            .catch((error) => {
                console.log(error);
                throw error;
            }).then(
                (subtitle_url) => {
                    if (subtitle_url) {
                        // E.g https://s3.us-west-1.amazonaws.com/joeysun-west/tot-users/123/d6c6b93ecf9e4a6a22f612dd2adff115.json
                        console.log(`Getting subtitle from url=${subtitle_url}`);
                        this.s3.download(subtitle_url).then(
                            (result) => {
                                this.onSubtitleJobReady(result);
                            }
                        );
                    } else if (this.restart) {
                        console.log("reset is invoked. Giving up current progress");
                        // TODO invoke cancel task here.
                    }else {
                         setTimeout(this.getSubtitleResult, SUBTITLE_JOB_REFRESH_TIME_MS, subtitleJobId);
                    }
                }
            );
        } else {
            console.log("subtitleJobId is null. Retry latter.");
        }
        return null;
    }

    getProgressBarStatus(progress, stage) {
        if (stage.includes("Error")) {
            return "danger";
        }
        return progress === 100 ? "success" : "info";
    }

    render() {
        const label = this.state.videoFile ?
            this.state.videoFile.name :
            "Click or drop a video/audio here";
        return <div>
            <div id="progress">
                <ProgressBar
                    className="progressBar"
                    animated={this.state.progress !== 100}
                    variant={this.getProgressBarStatus(this.state.progress, this.state.stage)}
                    now={this.state.progress} label={this.state.stage}
                />
            </div>
            <div id="upload" hidden={!this.state.showUploadZone}>
                <Dropzone
                    hidden={!this.state.showUploadZone}
                    header={false}
                    onChange={this.updateFile}
                    accept={ACCEPTED_FILE}
                    multiple={false}
                    label={label}
                    maxFiles={1}>
                    <FileItem>{this.state.videoFile}</FileItem>
                </Dropzone>
            </div>
            <div id="buttons">
                <Button
                    hidden={!this.state.showUploadZone}
                    variant="outline-primary"
                    onClick={this.onStart}
                    size="lg"
                    disabled={!this.state.videoFile}
                >
                    Start 🚀
                </Button>
                {/* render Download Button here as children */}
                {this.props.children}
                <Button
                    hidden={this.state.showUploadZone}
                    variant="outline-secondary"
                    onClick={this.onRestart}
                    size="lg"
                >
                    Restart 🔄
                </Button>
            </div>
        </div>;
    }
}
