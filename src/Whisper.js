import "./css/App.css";
import React from "react";
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import MyNavBar from "./MyNavbar";
import SideBar from "./SideBar";
import Channel from "./Channel";
import Video from "./Video";
import Transcripts from "./Transcripts";


import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTab: "#channel",
        };
    }

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    onTabSelect = (selectedTab) => {
        this.setState({
            showTab: selectedTab
        });
    }

    render() {
        let tabToContent = new Map();
        tabToContent.set("#channel", <Col sm={5}><Channel className="main" /></Col>);
        tabToContent.set("#video", <Col sm={5}><Video className="main" /></Col>);
        tabToContent.set("#transcripts", <Col sm={8}><Transcripts className="main" /></Col>);

        return (
            <div className="App">
                <MyNavBar {...this.props}/>
                <div className="main-content">
                    <Container>
                        <Row>
                            <Col sm={2}><SideBar className="side" onTabSelect={this.onTabSelect}/></Col>
                            {tabToContent.get(this.state.showTab)}
                        </Row>
                    </Container>
                </div>
            </div>
        );
    }
}

export default withCookies(App);
