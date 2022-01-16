import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Current from "./Current.js";

function App() {
    // // 1. Initialize an array called weights, which contains all weight data
    // const [weights, setWeights] = useState([]);
    // // 2. Create function to GET all the weights from server store to weights array.
    // const getWeights = () => {
    //     setInterval(() => {
    //         axios.get("http://localhost:3000/weights").then((res) => {
    //             setWeights(res.data);
    //         });
    //     }, 5000); // query every 5 sec
    // };
    // // 3. Create a useEffect hook to update weights
    // useEffect(() => {
    //     getWeights();
    // }, [weights]);

    return (
        <div className="App">
            <div className="App-header">
                <div className="Main">
                    <Current />
                </div>
            </div>
        </div>
    );
}

export default App;
