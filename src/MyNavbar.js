import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import {DOMAIN} from "./lib/Config";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import React from "react";


class MyNavBar extends React.Component {

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    
    constructor(props) {
        super(props);
        const { cookies } = props;
        this.state = {
            showUser: false,
            loggedInUser: cookies.get('logged_in_user') || null
        };
    }

    render() {
        let accountButton = (
            <Nav.Item bg="dark" variant="dark">
                <Button
                    bg="dark"
                    variant="dark"
                    href={DOMAIN + "/user/login-redirect"}
                >
                    <img src="btn_google_signin.png" />
                </Button>
            </Nav.Item>
        );
        if (this.state.loggedInUser) {
            accountButton = (
                <NavDropdown
                    bg="dark"
                    variant="dark"
                    title={this.state.loggedInUser}
                    id="collapsible-nav-dropdown"
                >
                    <NavDropdown.Item as="a" href={DOMAIN + "/user/logout"}>
                        Sign out
                    </NavDropdown.Item>
                </NavDropdown>
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
            </div>

        );
    }

}

export default withCookies(MyNavBar)
