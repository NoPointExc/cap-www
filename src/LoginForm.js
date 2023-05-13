import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";


function LoginForm(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function validateForm() {
        return email.length > 0 && password.length > 0;
    }

    // example https://www.telerik.com/kendo-react-ui/components/editor/find-replace/
    return (
        <div className="Login">
            <Form onSubmit={props.onSubmit}>
                <Form.Group size="lg" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        autoFocus
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="remember_me">
                    <Form.Check type="checkbox" label="Remember Me"/>
                </Form.Group>
                <Button block size="lg" type="submit" variant="outline-primary" disabled={!validateForm()}>
                    Confirm
                </Button>
            </Form>
        </div>
    );
}




export default LoginForm;

// ReactDOM.render(Login(), signup_div);
