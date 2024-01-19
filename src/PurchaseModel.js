import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { DOMAIN, COST_PER_100_MIN } from "./lib/Config";

const DEFAULT_HOURS = 5;

const PurchaseModel = (props) => {
    const [hours, setHours] = useState(DEFAULT_HOURS);

    const handleOnHourChange = (event) => {
        if (event.target.value && event.target.value > 0 ) {
            setHours(event.target.value);
        }
    }

    const caculateCost = () => {
        if (hours > 0) {
            return hours * COST_PER_100_MIN * 60 / 100;
        }
        return 0.0;
    }

    return (
        <div>
            <Modal show={props.show} onHide={props.handleOnClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Buy Service Credits</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <body><p>Thank you for choosing our service. Please take note of the following before making a purchase:</p>
                        <ul>
                            <li>The minimum unit of transcript service credit is 1 minute.</li>
                            <li>Consumption less than 1 minute will be rounded up.</li>
                            <li>For any issues, please contact us at todo@example.com."</li>
                        </ul>
                        <p>&nbsp;</p>
                    </body>
                    <Form>
                        <InputGroup>
                            <Form.Control
                                type="number"
                                min="1"
                                placeholder={DEFAULT_HOURS}
                                aria-label="Hours. Round up to minutes when transcript audio."
                                autoFocus
                                onChange={handleOnHourChange}
                            />
                            <InputGroup.Text>Hours</InputGroup.Text>
                        </InputGroup>
                        <Form.Group className="mb-3">
                            <Form.Text muted>
                                Hours. Before Tax cost: ${caculateCost()}
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleOnClose}>
                        Close
                    </Button>
                    <Button variant="success" href={`${DOMAIN}/payment/stripe/create?quantity=${hours * 60}`}>
                        Pay
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default PurchaseModel;