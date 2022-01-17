import "./Chart.css";
import React from "react";
import axios from "axios";
import moment from "moment";
import "chartjs-adapter-moment";

import "chart.js/auto";
import { Chart } from "react-chartjs-2";

export const options = {
    plugins: {
        title: {
            display: true,
            text: "Today's Real-Time Food Weight",
            fontSize: 20,
        },
        legend: {
            display: false,
        },
        responsive: true,
        maintainAspectRatio: true,
    },
    scales: {
        x: {
            type: "time",
            time: {
                // Luxon format string
                tooltipFormat: "MM/DD/YYYY",
            },
            title: {
                display: true,
                text: "Time",
            },
        },
    },
};

export default class CurrentChart extends React.Component {
    interval = null;

    constructor(props) {
        super(props);
        this.state = {
            date_times: [],
            food_weights: [],
        };
    }

    componentDidMount() {
        this.interval = setInterval(this.getData, 60000);
        this.getData();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    // get the weight of the last item
    getData = () => {
        let time = [];
        let weight = [];

        axios.get(`http://localhost:3000/weights`).then((res) => {
            for (const dataObj of res.data) {
                var localTime = moment().format("YYYY-MM-DD"); // store localTime
                var dataTime = moment(dataObj.time).format("YYYY-MM-DD"); // store localTime

                // only allow data from today
                if (localTime === dataTime) {
                    time.push(dataObj.time);
                    weight.push(parseInt(dataObj.food_weight));
                }
            }

            this.setState({ date_times: time });
            this.setState({ food_weights: weight });
        });
    };

    render() {
        return (
            <div className="ChartDisplay">
                <Chart
                    type="line"
                    data={{
                        labels: this.state.date_times,
                        datasets: [
                            {
                                label: "Weight",
                                backgroundColor: "rgba(75,192,192,1)",
                                borderColor: "rgba(75,192,192,1)",
                                borderWidth: 2,
                                data: this.state.food_weights,
                            },
                        ],
                    }}
                    options={options}
                />
            </div>
        );
    }
}
