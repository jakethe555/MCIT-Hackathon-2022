import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
    // 1.
    const [weights, setWeights] = useState([]);
    // 2.
    const getWeights = () => {
        setInterval(() => {
            axios
                .get("https://cool-pet-food-tracker.herokuapp.com/weights")
                .then((res) => {
                    setWeights(res.data);
                });
        }, 60000);
    };
    // 3.
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
