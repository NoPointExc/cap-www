import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { DOMAIN, COST_PER_100_MIN } from "./lib/Config";

const DEFAULT_HOURS = 5;

const PurchaseModel = (props) => {
    const [hours, setHours] = useState(DEFAULT_HOURS);


    const handleSubmit = async (event) => {
        event.preventDefault();
        // TODO forward a fetch request to "/stripe/create"
        // props.handleOnClose();
        const min = hours * 60;
        try {
            const response = await fetch(
                `${DOMAIN}/payment/stripe/create?quantity=${min}`,
                {   
                    method: "POST",
                    redirect: "follow",
                }
            );
            if (response.status === 200) {
                console.log("request succeded.");
            } else if (response.status === 400) {
                // TODO redirect to login
                return null;
            } else {
                // TODO: show an error
                console.error(`Unexpected status code: ${response.status}`);
            }
        } catch (error) {
            console.error('Error when submit the stripe/create request:', error.message);
        }

        //props.handleOnClose();
    };

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
                    <body><p>Thank you for buy our service. Before purchase, please note:</p>
                        <ul>
                            <li>The minial units of transcript service credit is 1 minutes.</li>
                            <li>Less than 1 minutes consumption will be round up.</li>
                            <li>Contact us with todo@example.com if you have any issues.</li>
                        </ul>
                        <p>&nbsp;</p>
                    </body>
                    <Form inline>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Control
                                type="number"
                                min="1"
                                placeholder={DEFAULT_HOURS}
                                aria-label="Hours"
                                autoFocus
                                onChange={handleOnHourChange}
                            />
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
                    <Button variant="success" onClick={handleSubmit}>
                        Pay
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default PurchaseModel;