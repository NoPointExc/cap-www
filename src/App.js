import "./css/App.css";
import React from "react";
import Button from "react-bootstrap/Button"
import ReactPlayer from "react-player";

import MyNavBar from "./MyNavbar";
import UploadPanel from "./UploadPanel";
import EditorPanel from "./EditorPanel";
import CaptionEditor from "./CaptionEditor";
import CaptionText from "./lib/CaptionText";

// TODO make it adjustable
const CHARS_EACH_LINE = 18;
export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            captionText: null,
            // captionText: new CaptionText(transcriptJSON, CHARS_EACH_LINE),
            srtFilename: null,
            // videoURL: "https://www.youtube.com/watch?v=oUFJJNQGwhk",
            //videoURL: "//Users/joeysun/funlab/tot/tmp/test_video_chinese_3min.mp4",
            videoURL: null,
            paid: false,
        };

        this.onTranscriptJSONReady = this.onTranscriptJSONReady.bind(this);
        this.onDownloadCaption = this.onDownloadCaption.bind(this);
        this.onPay = this.onPay.bind(this);
        this.onUpload = this.onUpload.bind(this);
        this.onRestart = this.onRestart.bind(this);
        this.redo = this.redo.bind(this);
        this.undo = this.undo.bind(this);

        this.cursorMoveToNewLine = this.cursorMoveToNewLine.bind(this);
        this.videoPlayer = React.createRef();
    }


    onTranscriptJSONReady(transcriptJSON) {
        this.setState({
            captionText: new CaptionText(transcriptJSON, CHARS_EACH_LINE),
            paid: false,
        });
    }

    onUpload(videoURL) {
        this.setState({videoURL: videoURL});
    }

    onRestart() {
        this.setState({
            captionText: null,
            srtFilename: null,
            videoURL: null,
        });
    }

    onDownloadCaption(event) {
        event.preventDefault();
        // TODO check payment status before download
        console.log("onDownloadCaption invoked");
        if (this.state.captionText) {
            const blob = new Blob([this.state.captionText.exportAsSrt()]);
            const fileDownloadUrl = URL.createObjectURL(blob);
            this.setState (
                {
                    fileDownloadUrl: fileDownloadUrl,
                    srtFilename: `${this.state.captionText.getJobName()}.srt`,
                },
            () => {
                this.doFileDownload.click();
                URL.revokeObjectURL(fileDownloadUrl);  // free up storage--no longer needed.
                this.setState({fileDownloadUrl: ""})
            })
        }
    }

    onPay(event) {
        const job_id = sessionStorage.getItem("subtitle_job_id");
        if (job_id) {
            fetch(
                `dummy_domain/api/pay/create_checkout_session`,
                {
                    method: "POST",
                    headers: {"Content-Type" : "application/json"},
                    body: JSON.stringify({"job_id": job_id}),
                    credentials: "include",
                }
            ).then(rsp => rsp.json())
            .then(
                (result) => {
                    if (result.is_error) {
                        console.log(result.error_msg)
                    } else {
                        console.log(`Redirect to ${result.url}`)
                        window.open(result.url, "_blank");
                    }
                }
            )
            .catch(error => console.error(error));
        }
    }

    // Editor Event Listener
    onFindNext(event) {
        console.log(event);
        // event.preventDefault();
    }

    onReplaceNext(event) {
        console.log(event);
        event.preventDefault();
    }

    undo(event) {
        // event.preventDefault();
        console.log("undo");
        const captionText = this.state.captionText;
        captionText.undo();
        this.setState({captionText, captionText});
    }

    redo(event) {
        // event.preventDefault();
        const captionText = this.state.captionText;
        captionText.redo();
        this.setState({captionText, captionText});
    }

    cursorMoveToNewLine(cursorLinePosition) {
        // Get time Range

        // If video exists, then seek
        if (this.state.videoURL) {

            const timeRange = this.state.captionText.timeRanges[cursorLinePosition];
            const startTime = parseFloat(timeRange.start_time);
            const endTime = parseFloat(timeRange.end_time);

            console.log(`Seek to start time: ${startTime} to ${endTime}.`);
            this.videoPlayer.current.seekTo(startTime, "seconds");
            // TODO set a callback to check if video is still playing. If so, pause it.
        }
    }

    // light banner: https://react-bootstrap.github.io/components/carousel/
    // https://javascript.plainenglish.io/how-to-create-download-and-upload-files-in-react-apps-80893da4247a
    render() {
        return (
            <div className="App">
                <MyNavBar {...this.props}/>
                <div className="main-content">
                    <div className="app-panel editor-panel right-panel">
                        <CaptionEditor
                            captionText={this.state.captionText}
                            cursorMoveToNewLine={this.cursorMoveToNewLine}
                        />
                    </div>
                    <div className="app-panel left-panel">
                        <ReactPlayer
                            id="player"
                            hidden={!this.state.videoURL}
                            url={this.state.videoURL}
                            ref={this.videoPlayer}
                            controls="true"
                        />
                        <UploadPanel
                            id="upload"
                            onTranscriptJSONReady={this.onTranscriptJSONReady}
                            onUpload={this.onUpload}
                            onRestart={this.onRestart}
                        >
                            <div id="download" style={{display: "inline"}}>
                                <a className="hidden"
                                    download={this.state.srtFilename}
                                    href={this.state.fileDownloadUrl}
                                    ref={e=>this.doFileDownload = e}
                                />
                                <Button
                                    variant="outline-success"
                                    size="lg"
                                    onClick={this.onDownloadCaption}
                                    hidden={!this.state.captionText}
                                >
                                    Download
                                </Button>
                            </div>
                            <div id="payment" style={{display: "inline"}}>
                                <Button
                                    variant="outline-success"
                                    size="lg"
                                    type="submit"
                                    disabled={!this.state.captionText}
                                    onClick={this.onPay}
                                >
                                    Checkout
                                </Button>
                            </div>
                        </UploadPanel>
                        <EditorPanel id="edit"
                            onFindNext={this.onFindNext}
                            onReplaceNext={this.onReplaceNext}
                            undo={this.undo}
                            redo={this.redo}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
