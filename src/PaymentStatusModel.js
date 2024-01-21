import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';


function getPaymentFromUrl() {
    const queryParams = new URLSearchParams(window.location.search);
    const argString = queryParams.get("payment")
    if (argString !== null) {
        try {
            return JSON.parse(argString);
        } catch (e) {
            console.error("Error parsing JSON:", e.message);
        }
    }
    return null;
}

function PaymentStatusModel(props) {
    const [show, setShow] = useState(true);

    const handleOnHide = () => {
        // Clear the query parameters from the URL
        const newUrl = window.location.href.split('?')[0];
        window.history.replaceState({}, document.title, newUrl);
        setShow(false);
    };

    const payment = getPaymentFromUrl();

    let title = "Payment Error";
    // TODO having a model body here as well.
    if (payment !== null) {
        if (payment.status == "SUCCESS") {
            title = "Payment success!";
        } else if (payment.status == "CANCELED") {
            title = "Payment Canceled";
        } else if (payment.status = "FAILED") {
            title = "Payment Failed. Ops!";
        }
    }

    // show success, error model for different payment results
    return (
        <div>
            <Modal show={show && payment !== null} onHide={handleOnHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                </Modal.Body>
            </Modal>
        </div>
    );

}

export default PaymentStatusModel;