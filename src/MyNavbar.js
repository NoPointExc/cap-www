import { instanceOf } from 'prop-types';
import { withCookies, Cookies, setCookie } from 'react-cookie';
import { DOMAIN, LOGIN_USER } from "./lib/Config";
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
        this.state = {
            showUser: false,
            loggedInUser: null,
            credit: -1,
        };
    }



    async fetchUserStatus() {
        try {
            const response = await fetch(`${DOMAIN}/user/status`);

            if (response.status === 200) {
                const status = await response.json();
                return status;
            } else if (response.status === 400) {
                // Request was rejected with error 400
                return null;
            } else {
                // Handle other status codes if needed
                console.error(`Unexpected status code: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching user status:', error.message);
        }
    }

    async componentDidMount() {
        if (this.props.cookies.get(LOGIN_USER)) {
            const user = await this.fetchUserStatus();
            if (user === null) {
                setCookie(LOGIN_USER, null);
            } else {
                this.setState(
                    { loggedInUser: user.name, credit: user.credit}
                )
            }
        }   
    }


    render() {
        let accountButton = (
            <Nav.Item bg="light" variant="light">
                <Button
                    bg="light"
                    variant="light"
                    href={`${DOMAIN}/user/login-redirect`}
                >
                    <img src="btn_google_signin.png" />
                </Button>
            </Nav.Item>
        );
        
        let credit_info = "Sign in now for 300mins free credit + $0.02/mins transcription service";
        if (this.state.loggedInUser) {
            accountButton = (
                <NavDropdown
                    bg="light"
                    variant="light"
                    title={this.state.loggedInUser}
                    id="collapsible-nav-dropdown"
                >   
                    <NavDropdown.Item as="a" href={`${DOMAIN}/user/logout`}>
                        Sign out
                    </NavDropdown.Item>
                </NavDropdown>
            );
        }
        if (this.state.credit != -1) {
            credit_info = `Balance: ${this.state.credit} mins`;
        }

        return (
            <div {...this.props}>
                <Navbar bg="light" variant="light" {...this.props}>
                    <Container>
                        <Navbar.Brand href="#home">Captions.io</Navbar.Brand>
                        <Nav.Link href="#TODO">
                            {credit_info}
                        </Nav.Link>
                        {accountButton}
                    </Container>
                </Navbar>
            </div>

        );
    }
}

export default withCookies(MyNavBar)
