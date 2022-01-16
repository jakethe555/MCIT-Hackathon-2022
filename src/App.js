import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
    // 1. Initialize an array called weights, which contains all weight data
    const [weights, setWeights] = useState([]);
    // 2. Create function to GET all the weights from server store to weights array.
    const getWeights = () => {
        setInterval(() => {
            axios
                .get("https://cool-pet-food-tracker.herokuapp.com/weights")
                .then((res) => {
                    setWeights(res.data);
                });
        }, 5000); // query every 5 sec
    };
    // 3. Create a useEffect hook to update weights
    useEffect(() => {
        getWeights();
    }, [weights]);

    return (
        <div className="App">
            <header className="App-header">
                <div className="weights">
                    {weights.map((item) => {
                        return (
                            <div className="weight">
                                <h3>Date Time: {item.time}</h3>
                                <h3>Weight: {item.food_weight}</h3>
                            </div>
                        );
                    })}
                </div>
            </header>
        </div>
    );
}

export default App;
