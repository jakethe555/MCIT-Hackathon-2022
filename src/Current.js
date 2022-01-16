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

    enoughFood() {
        const currentWeight = this.state.currentWeight;

        if (currentWeight > 200) {
            return "The food bowl is full! No need to worry"
        }
        else if (currentWeight < 10) {
            return "The food bowl is almost empty. Consider refilling!"
        }
        return "The food bowl is empty! Refill as soon as possible!"
    }

    enoughFoodImage() {
        const currentWeight = this.state.currentWeight;

        if (currentWeight > 200) {
            return require('/Users/radin/Desktop/MCIT_Hackthon/MCIT-Hackathon-2021/src/bowl1.png');
        }
        else if (currentWeight < 10) {
            return require('/Users/radin/Desktop/MCIT_Hackthon/MCIT-Hackathon-2021/src/bowl2.png');
        }
        return require('/Users/radin/Desktop/MCIT_Hackthon/MCIT-Hackathon-2021/src/bowl3.png');

    }

    render() {
        const currentWeight = this.state.currentWeight;

        return(
            <div>
                <img style={{position: 'relative', top: '-180px'}} src={require('/Users/radin/Desktop/MCIT_Hackthon/MCIT-Hackathon-2021/src/logo.png')} alt="supposed to be cat" width={'300px'} height={'auto'}/>
                <h2>{this.enoughFood()}</h2>
                <img src={this.enoughFoodImage()} alt="cat food bowl" width={'500px'} height={'auto'}/>
                <h4>{currentWeight} grams </h4>
            </div>
        )
    }
}
