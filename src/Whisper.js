import "./css/App.css";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import Channel from "./Channel";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import MyNavBar from "./MyNavbar";
import React from "react";
import Row from "react-bootstrap/Row";
import SideBar from "./SideBar";
import Transcripts from "./Transcripts";
import Video from "./Video";


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: "#video",
        };
    }

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    componentDidMount() {
        const storedTab = localStorage.getItem('activeTab');
        if (storedTab) {
            this.setState({
                activeTab: storedTab
            });
        }
    }

    onTabSelect = (selectedTab) => {
        this.setState({
            activeTab: selectedTab
        });
        localStorage.setItem('activeTab', selectedTab);
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
                            {tabToContent.get(this.state.activeTab)}
                        </Row>
                    </Container>
                </div>
            </div>
        );
    }
}

export default withCookies(App);
