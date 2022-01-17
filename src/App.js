import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Current from "./Current.js";
import CurrentChart from "./CurrentChart.js";
import AverageWeightChart from "./AverageWeightChart.js";

function App() {
    return (
        <div className="App">
            <div className="App-header">
                <div className="Main">
                    <img
                        src={require("./logo.png")}
                        alt="supposed to be cat"
                        width={"300px"}
                        height={"auto"}
                        style={{ paddingBottom: "100px" }}
                    />
                    <Current />
                    <CurrentChart />
                    <AverageWeightChart />
                </div>
            </div>
        </div>
    );
}

export default App;
