import "./css/App.css";
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import MyNavBar from "./MyNavbar";
import SideBar from "./SideBar";
import React from "react";

class App extends React.Component {
    
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    render() {
        return (
            <div className="App">
                <MyNavBar {...this.props}/>
                <div className="main-content">
                {/* repalce this */}
                    <SideBar/>
                </div>
            </div>
        );
    }
}

export default withCookies(App);
