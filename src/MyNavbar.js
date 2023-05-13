import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import FormModal from "./FormModal";

// require('dotenv').config({ path: '../.env' })


export default class MyNavBar extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogoutClick = this.handleLogoutClick.bind(this);
        // TODO remove username from state.
        this.state = {showUser: false, showLoginModal: false, showSignupModal: false};
    }

    handleLogoutClick(event) {
        let username = localStorage.getItem("username");
        fetch(
            `dummy_domain/api/user/logout`,
            {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({"username": username}),
                credentials: "include",
            },
        ).then(
            (res) => {
                console.log("================");
                console.log(res);
                console.log("================");
                return res.json();
            }
        )
        .then(
            (result) => {
                console.log(result);
                if (!result.is_login) {
                    this.setState({showUser: false});
                    localStorage.removeItem("username");
                    window.location.reload();
                } else {
                    alert("Failed to logout! Please try again.");
                }
            }
        ).catch(
            (error) => {
                this.setState({showUser: false});
                localStorage.removeItem("username");
                console.log("Failed to logout with error: " + error);
            }
        );
    }

    render() {
        let accountButton;
        let loginUsername = this.state.username || localStorage.getItem("username");
        if (loginUsername) {
            accountButton = (
                <NavDropdown
                    bg="dark"
                    variant="dark"
                    title={loginUsername}
                    id="collapsible-nav-dropdown"
                >
                    <NavDropdown.Item as="button" onClick={this.handleLogoutClick}>Logout</NavDropdown.Item>
                    <NavDropdown.Item as="button" onClick={this.handleLogoutClick}>Change Password</NavDropdown.Item>
                </NavDropdown>
            );
        } else {
            accountButton =  (
                <Nav.Item bg="dark" variant="dark">
                    <Button
                        bg="dark" variant="dark"
                        onClick={(event) => {this.setState({showSignupModal: true});}}
                    >
                        Sign Up
                    </Button>
                    <Button
                        bg="dark" variant="dark"
                        onClick={(event) => {this.setState({showLoginModal: true});}}
                    >
                        Login
                    </Button>
                </Nav.Item>
            );
        }

        return (
            <div {...this.props}>
                <Navbar  bg="dark" variant="dark" {...this.props}>
                    <Container>
                        <Navbar.Brand href="#home">Captions.io</Navbar.Brand>
                        {accountButton}
                    </Container>
                </Navbar>
                <FormModal
                    title="Log in"
                    show={this.state.showLoginModal}
                    onHide={() => this.setState({showLoginModal: false})}
                    onSubmit={(event) => {
                        let username = event.target.email.value;
                        let password = event.target.password.value;
                        fetch(
                            `dummy_domain/api/user/login`,
                            {
                                method: "POST",
                                headers: {"Content-Type" : "application/json", credentials: 'include'},
                                body: JSON.stringify({"username": username, "password": password}),
                                credentials: "include",
                            },
                        ).then(
                            res => res.json(),
                        ).then(
                            (result) => {
                                if (result.is_login) {
                                    this.setState({
                                        showLoginModal: false,
                                        username: username,
                                    });
                                    localStorage.setItem("username", username);
                                    console.log("==============================");
                                    console.log(localStorage.getItem("username"));
                                    console.log("==============================");
                                } else {
                                    alert(result.error_msg);
                                }
                            }
                        ).catch(
                            (error) => {
                                alert(`Failed to login with error ${error}`);
                            }
                        );
                        event.preventDefault();
                    }}
                    {...this.props}
                >
                    <LoginForm/>
                </FormModal>
                <FormModal
                    title="Create New Account"
                    show={this.state.showSignupModal}
                    onHide={() => this.setState({showSignupModal: false})}
                    onSubmit={(event) => {
                        let username = event.target.email.value;
                        let password = event.target.password.value;
                        console.log(event.target.password);
                        console.log("username " + username + " password " + password);
                        fetch(
                            `dummy_domain/api/user/sign_up`,
                            {
                                method: "POST",
                                headers: {"Content-Type" : "application/json"},
                                body: JSON.stringify({"username": username, "password": password}),
                                credentials: "include",
                            },
                        ).then(res => res.json())
                        .then(
                            (result) => {
                                if (result.is_sign_up) {
                                     this.setState({
                                        showSignupModal: false,
                                        username: username,
                                    });
                                    localStorage.setItem("username", username);
                                } else {
                                    alert(result.error_msg);
                                }
                            }
                        );
                        event.preventDefault();
                    }}
                >
                    <SignupForm/>
                </FormModal>
            </div>
        );
    }

}
