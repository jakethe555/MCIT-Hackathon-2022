import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
    // 1.
    const [weights, setWeights] = useState([]);
    // 2.
    const getWeights = () => {
        axios.get("http://localhost:3000/weight").then((res) => {
            setWeights(res.data);
        });
    };
    // 3.
    useEffect(() => {
        getWeights();
    }, [weights]);

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
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
        </div>
    );
}

export default App;
