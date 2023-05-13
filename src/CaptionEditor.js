import React from "react";

import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";

import "prismjs/components/prism-markup";
import "./css/CaptionEditor.css";

const HOW_TO = `How To Use

- Upload a video(E.g mp4, wav) or Audio(E.g mp3) with the upload panel on the left side.
- Start 🚀 & wait for AI to transcribe.
- The generated caption is editable here.
- Timestamps are tracked automatically & dynamically during the editing.
- Download the caption as .srt.

Tip:
- Smaller audio files costs less process time.
- .mp3 is much faster to process than video formats.
`;

export default class CaptionEditor extends React.Component{
    constructor(props) {
        super(props);
        this.cursorLinePosition = -1;
        this.state = {
            cursorLine: -1,
        };

        this.onChange = this.onChange.bind(this);
        this._cursorMayMoveToNewLine = this._cursorMayMoveToNewLine.bind(this);

        this.metaKeyDown = false;
    }

    onChange(value) {
        if (this.props.captionText) {
            this.props.captionText.update(value);
        }
        this.setState({value: value});
    }

    hightLightWithTimeStamp(input, language) {
        const highlightedInput = highlight(input, language);
        let lines = highlightedInput.split("\n");
        if (input === "" || input === null || input === undefined) {
            return this._highLightForEmptyPlaceholder();
        }
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            let newLine = `<span class='editorTimeStamp'>${i}</span>${line}`;
            if (this.props.captionText) {
                const timeRange = this.props.captionText.getTimeRange(i);
                if (i === this.state.cursorLine) {
                    newLine = `<span class='editorTimeStamp'>${timeRange}</span><span class='selectedLine'>${line}</span>`;
                }else {
                    newLine = `<span class='editorTimeStamp'>${timeRange}</span>${line}`;
                }
            }
            lines[i] = newLine;
        }

        return lines.join("\n");
    }

    _highLightForEmptyPlaceholder(){
        const emptyLineNum = 20;
        // backgroudLine
        let lines = new Array(emptyLineNum).fill(
            `<span class='editorTimeStamp'>00:00:00,000->00:00:00,000</span><span class='backgroudLine'>${"............"}</span>`
        );

        const how_to_lines = HOW_TO.split("\n");
        for (let i = 0; i < how_to_lines.length; i++){
            let how_to_line = how_to_lines[i];
            lines[i] = `<span class='editorTimeStamp'>00:00:00,000->00:00:00,000</span><span class='backgroudLine'>${how_to_line}</span>`;
        }
        return lines.join("\n");
    }

    _cursorMayMoveToNewLine(event) {
        const cursorPosition = event.target.selectionStart;
        if (this.props.captionText === null) {
            return;
        }
        const text = this.props.captionText.getText();
        if (cursorPosition < text.length) {
            const cursorLinePosition = text.substr(0, cursorPosition).split("\n").length -1;
            if (cursorLinePosition !== this.cursorLinePosition) {
                this.cursorLinePosition = cursorLinePosition;
                this.setState({cursorLine: cursorLinePosition});
                this.props.cursorMoveToNewLine(cursorLinePosition);
            }
        }
    }

    onKeyDown(event) {
        if (event.key === "z" && this.metaKeyDown) {
            console.log("metaKey + z is disabled.");
            event.preventDefault();
        }

        if (event.metaKey) {
            this.metaKeyDown = true;
        } else {
            this.metaKeyDown = false;
        }

    }

    // TODO place holder for the text??
    // https://react-bootstrap.github.io/components/placeholder/
    render() {
        if (!this.props.captionText) {
            console.log("captionText is null.");
        }

        return (
            <div>
                <div>
                    {/* TODO: find and replace */}
                    {/* https://react-bootstrap.github.io/utilities/transitions/ */}
                </div>
                <div className="editorDiv">
                    <Editor
                        value={this.props.captionText ? this.props.captionText.getText() : ""}
                        onValueChange={this.onChange}
                        highlight={value => this.hightLightWithTimeStamp(value, languages.markup)}
                        padding={10}
                        textareaId="codeArea"
                        className="editor"
                        style={{
                            fontFamily: '"Fira code", "Fira Mono", monospace',
                            fontSize: 18,
                            outline: 0,
                        }}
                        onClick={event => this._cursorMayMoveToNewLine(event)}
                        onKeyUp={event => this._cursorMayMoveToNewLine(event)}
                        onKeyDown={event => this.onKeyDown(event)}
                    />
                </div>
            </div>

        );
    }
}
