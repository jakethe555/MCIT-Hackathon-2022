const express = require("express");
const mysql = require("mysql");
require("dotenv").config();
// const path = require("path");
const cors = require("cors");
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'coolpetfoodtracker@gmail.com',
    pass: 'j8asj91aml'
  }
});

var mailOptions = {
  from: 'coolpetfoodtracker@gmail.com',
  to: 'christianrichmond.12@gmail.com',
  subject: "Your pet's bowl is empty!",
  html: '<h1>Your pet\'s bowl is empty!</h1> <img alt="Embedded Image" height="512" width="384" src="https://i.imgur.com/unzfnaD.jpeg" />',
};

const app = express();
app.use(cors());
app.use(express.json()); // parses incoming requests with JSON payloads

// declare react files in build as static
// app.use(express.static(path.join(__dirname, "build")));

//create connection to database
const db = mysql.createPool({
    host: process.env.DB_HOST, //localhost
    user: process.env.DB_USER, //root
    password: process.env.DB_PASSWORD, //password
    database: process.env.DB, //ravenbooks
});

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log("App is listening on port " + listener.address().port);
});

app.get("/weights", (req, res) => {
    db.query("SELECT * FROM weights", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.post("/weights", (req, res) => {
    const insertQuery = "INSERT INTO weights SET ?";
    db.query(insertQuery, req.body, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send("Weight Added to Database");
        }
    });
});

app.put("/weights", (req, res) => {
    const updateQuery =
        "UPDATE weights SET time = ?, food_weight = ? WHERE id = ?";
    db.query(
        updateQuery,
        [req.body.time, req.body.food_weight, req.body.id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.delete("/weights/:id", (req, res) => {
    db.query(
        "DELETE FROM weights WHERE id = ?",
        req.params.id,
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

var lastweight;
var lastEmailTime = 0;

function getweight() {
    const newquery = "SELECT food_weight from (SELECT * FROM weights ORDER BY id DESC LIMIT 1)";
    return db.query(newquery, lastweight);
}


var intervalId = setInterval(function() {
    console.log("Interval1 reached every 120s");
    
	if (Math.floor((new Date() - lastEmailTime)/1000/3600) > 8){
	    db.query("SELECT * FROM weights ORDER BY id DESC LIMIT 1", function(err, value){
			if(err) {
				throw err;
			} else {
				lastweight = value[0].food_weight;
			}
		  
			console.log("------");
			console.log(lastweight);
			console.log("------");
			  
			if (lastweight < 10) {
				console.log("Weight below minimum");
				transporter.sendMail(mailOptions, function(error, info){
				if (error) {
					console.log(error);
				} else {
					console.log('Email sent: ' + info.response);
					lastEmailTime = new Date();
					console.log(lastEmailTime);
				}
				});
			}
		});
	}
	
}, 120000);

var intervalId2 = setInterval(function() {
    console.log("Interval2 reached every 120s");

    db.query(`
    DELETE FROM eatenperday
    `, function(err, value){
        if(err) {
            throw err;
        } else {
            console.log("------");
            console.log("deleted eaten per day");
            console.log("------");
            db.query(`
            INSERT INTO eatenperday (day, eaten)
            SELECT day, (max - min) AS eaten
            FROM
            (SELECT day, MAX(food_weight) AS max, MIN(food_weight) AS min
            FROM
            (SELECT cast(time AS date) AS day, food_weight FROM weights)temp1
            GROUP BY day)temp2
            `, function(err, value){
                if(err) {
                    throw err;
                } else {
                    console.log("------");
                    console.log("updated eaten per day");
                    console.log("------");
                }
        
            });
        }
    });
}, 120000);

// serve index.html from the build folder
// app.get("/*", (req, res) => {
//     res.sendFile(path.join(__dirname, "build", "index.html"));
// });
