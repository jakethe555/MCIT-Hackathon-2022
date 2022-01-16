import React from "react";
import axios from "axios";

export default class Current extends React.Component {
    interval = null;

    state = {
        currentWeight: "",
    };

    componentDidMount() {
        this.interval = setInterval(this.getData, 5000);
        this.getData();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    // get the weight of the last item
    getData = () => {
        axios.get(`http://localhost:3000/weights`).then((res) => {
            const weights = res.data;
            const currentWeight = weights[weights.length - 1].food_weight;
            this.setState({ currentWeight });
        });
    };

    render() {
        const currentWeight = this.state.currentWeight;
        return <h4> {currentWeight} grams </h4>;
    }
}
