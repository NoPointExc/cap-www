import React, { useState } from "react";
import Form from "react-bootstrap/Form";

import Button from "react-bootstrap/Button";

import "bootstrap/dist/css/bootstrap.min.css";


function SignupForm(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    function isSamePassword() {
        return password === confirmPassword;
    }

    function isUsernameEmail() {
        // eslint-disable-next-line
        let regex = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$", "g");
        return regex.test(email);
    }

    function validateForm() {
        return email.length > 0 && password.length > 0 && isSamePassword() && isUsernameEmail();
    }

    return (
        <div className="Signup">
            <Form onSubmit={props.onSubmit}>
                <Form.Group size="lg" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        autoFocus
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {isUsernameEmail() || email === ""?
                        <div/> :
                        <div className="text-danger">
                        The email you've entered is invalidated. Re-enter your Email.
                        </div>
                    }
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {!isSamePassword() ?
                        <div className="text-danger">
                        The passwords you've entered do not match. Re-enter your password.
                        </div> : <div/>
                    }
                </Form.Group>
                <Button block size="lg" type="submit" variant="outline-primary" disabled={!validateForm()}>
                    Confirm
                </Button>
            </Form>
        </div>
    );
}



export default SignupForm;
