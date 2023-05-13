import React from "react";
import Button from "react-bootstrap/Button";

import Form from "react-bootstrap/Form";


import Row from "react-bootstrap/Row";



const SearchForm = (props) => {
    return (
        <Form.Group size="sm" controlId={props.id} >
            <Form.Control
                autoFocus
                type={props.id}
                placeholder={props.placeholder}
            />
        </Form.Group>
    );
}

const ImageButton = (props) => {
    return (
        <Button
            variant="outline-secondary"
            onClick={props.onClick}
            size="sm"
        >
            {props.children}
        </Button>
    );
}

export default class EditorToolbar  extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            punctuationOn: true,
            showReplace: false,
            showFind: false,
        };

        this.toFindVal = null;
        this.setPunctuationOn = this.setPunctuationOn.bind(this);
        this.onReplaceClicked = this.onReplaceClicked.bind(this);
        this.onFindClicked = this.onFindClicked.bind(this);
    }

    setPunctuationOn(event) {
        const isOn = event.currentTarget.checked;
        console.log(`Toggle on Punctuation: ${isOn}`);
        this.setState({punctuationOn: isOn});
    }


    onFindClicked(event) {
        const currentStatus = this.state.showFind;
        this.setState({showFind: !currentStatus, showReplace: false});
    }

    onReplaceClicked(event) {
        const currentStatus = this.state.showReplace;
        this.setState({showReplace: !currentStatus, showFind: false});
    }

    // https://getbootstrap.com/docs/5.0/forms/range/
    // RANGE FOR line width
    // Editor toolbar example
    // https://xdsoft.net/jodit/
    render() {

        const buttonVariant = "outline-secondary";
        const buttonSize = "sm";
        return (
            <div>
                <div id="buttons">
                    <ImageButton onClick={this.onFindClicked}>
                        <img src="svg/search_black_24dp.svg" alt="Find"/>
                    </ImageButton>
                    <ImageButton onClick={this.onReplaceClicked}>
                        <img src="svg/find_replace_black_24dp.svg" alt="Replace"/>
                    </ImageButton>
                    <ImageButton onClick={this.props.undo}>
                        <img src="svg/undo_black_24dp.svg" alt="Undo"/>
                    </ImageButton>
                    <ImageButton onClick={this.props.redo}>
                        <img src="svg/redo_black_24dp.svg" alt="Redo"/>
                    </ImageButton>
                </div>
                <div id="folded">
                    <div hidden={!this.state.showReplace}>
                        <Form onSubmit={this.props.onReplaceNext}>
                            <SearchForm id="toFind" placeholder="Find"/>
                            <SearchForm id="toReplace" placeholder="Replace"/>
                            <Button block size="lg" type="submit" variant="outline-primary">
                                Replace Next
                            </Button>
                        </Form>
                    </div>
                  <div hidden={!this.state.showFind}>
                        <Form onSubmit={this.props.onFindNext}>
                            <SearchForm id="toFind" placeholder="Find"/>
                            <Button block size="lg" type="submit" variant="outline-primary">
                                Find Next
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }

}
