import React from "react";
import Nav from "react-bootstrap/Nav";



function SideBar(props) {
    const navLinkStyle = {
        color: 'aliceblue',
    };

    const navItems = [
        { key: '#channel', text: '• Channel', },
        { key: '#video', text: '• Video' },
        { key: '#transcripts', text: '• Your Transcripts' },
    ];

    return (<div>
        {navItems.map(
            (item) => (
                <Nav.Link eventKey={item.key} className="side-bar">{item.text}</Nav.Link>
            )
        )}
    </div>);
}

export default SideBar;