import React from "react";
import "./App.css";
import Current from "./Current.js";
import CurrentChart from "./CurrentChart.js";
import DayWeightChart from "./DayWeightChart.js";

function App() {
    return (
        <div className="App">
            <div className="App-header">
                <div className="Main">
                    <img
                        className="Logo"
                        src={require("./logo.png")}
                        alt="supposed to be cat"
                    />
                    <Current />
                    <CurrentChart />
                    <DayWeightChart />
                </div>
                <div className="Footer">
                    <h4>
                        Team: 2B||!2B <br />
                        <span className="Names">
                            Christian Richmond, Jae Young Lee, Radin Nojoomi,
                            Shuke Zeng
                        </span>
                    </h4>
                </div>
            </div>
        </div>
    );
}

export default App;
