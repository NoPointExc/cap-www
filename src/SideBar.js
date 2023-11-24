import React from "react";
import Nav from "react-bootstrap/Nav";




function SideBar(props) {
    const navLinkStyle = {
        color: 'aliceblue',
    };

    const navItems = [
        { key: '#channel', text: '• Youtube Channel', },
        { key: '#video', text: '• Youtube Video' },
        { key: '#transcripts', text: '• Your Transcripts' },
    ];
    

    return (
        <Nav className="flex-column" variant="pills" defaultActiveKey="#channel" onSelect={props.onTabSelect}>
            {navItems.map(
                (item) => (
                    <div>
                        <Nav.Link eventKey={item.key} className="side-bar">{item.text}</Nav.Link>
                    </div>
                )
            )}
        </Nav>);
}

export default SideBar;