import React, { useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";


function SideBar(props) {

    const [activeTab, setActiveTab] = useState('#video')

    const navItems = [
        // { key: '#channel', text: '• Youtube Channel', },
        { key: '#video', text: '• Youtube Video' },
        { key: '#transcripts', text: '• Your Transcripts' },
    ];
    
    const onTabSelect = (selectedTab) => {
        setActiveTab(selectedTab);
        props.onTabSelect(selectedTab);
    };

    useEffect(() => {
        const storedTab = localStorage.getItem('activeTab');
        console.log(`set avctive page as ${storedTab}`);
        if (storedTab) {
            setActiveTab(storedTab);
        }
    }, []);

    return (
        <Nav className="flex-column" variant="pills" activeKey={activeTab} defaultActiveKey='#video' onSelect={onTabSelect}>
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