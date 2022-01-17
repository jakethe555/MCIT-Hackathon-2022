import "./Current.css";
import React from "react";
import axios from "axios";

export default class Current extends React.Component {
    interval = null;

    state = {
        currentWeight: "",
    };

    componentDidMount() {
        this.interval = setInterval(this.getData, 10000);
        this.getData();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    // get the weight of the last item
    getData = () => {
        axios
            .get(`https://cool-pet-food-tracker.herokuapp.com/weights`)
            .then((res) => {
                const weights = res.data;
                const currentWeight = weights[weights.length - 1].food_weight;
                this.setState({ currentWeight });
            });
    };

    enoughFood() {
        const currentWeight = this.state.currentWeight;

        if (currentWeight >= 200) {
            return "The food bowl is full! No need to worry";
        } else if (currentWeight > 20 && currentWeight < 200) {
            return "The food bowl is almost empty. Consider refilling!";
        }
        return "The food bowl is empty! Refill as soon as possible!";
    }

    enoughFoodImage() {
        const currentWeight = this.state.currentWeight;

        if (currentWeight >= 200) {
            return require("./bowl1.png");
        } else if (currentWeight > 20 && currentWeight < 200) {
            return require("./bowl2.png");
        }
        return require("./bowl3.png");
    }

    render() {
        const currentWeight = this.state.currentWeight;

        return (
            <div>
                <h2 style={{ position: "relative" }}>{this.enoughFood()}</h2>

                <span>
                    <img
                        className="BowlImg"
                        src={this.enoughFoodImage()}
                        alt="cat food bowl"
                    />
                </span>

                <h4 style={{ position: "relative" }}>
                    {" "}
                    Current Weight: {currentWeight} grams{" "}
                </h4>
            </div>
        );
    }
}
