import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Current from "./Current.js";
import CurrentChart from "./CurrentChart.js";

function App() {
    return (
        <div className="App">
            <div className="App-header">
                <div className="Main">
                    <Current />
                    <CurrentChart />
                </div>
            </div>
        </div>
    );
}

export default App;
