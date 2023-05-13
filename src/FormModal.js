import React from "react";
import Modal from "react-bootstrap/Modal";


export default class FormModel extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {
        return (
            <Modal size="lg" centered="true"  {...this.props} >
                <Modal.Header closeButton>
                    <Modal.Title >
                        {this.props.title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.props.children}
                </Modal.Body>
            </Modal>
        );
    }
}
