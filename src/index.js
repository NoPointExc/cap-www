import "bootstrap/dist/css/bootstrap.css";
import { CookiesProvider } from "react-cookie";
import App from "./Whisper";
import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";


const rootElement = document.getElementById("root");


ReactDOM.render(
  <CookiesProvider>
    <App />
  </CookiesProvider>,
  rootElement
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
