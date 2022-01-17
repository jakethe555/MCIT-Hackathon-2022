import React from "react";
import "./App.css";
import Current from "./Current.js";
import CurrentChart from "./CurrentChart.js";
import DayWeightChart from "./DayWeightChart.js";

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
