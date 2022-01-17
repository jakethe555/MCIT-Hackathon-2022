const express = require("express");
const mysql = require("mysql");
require("dotenv").config();
const path = require("path");
const cors = require("cors");

var nodemailer = require("nodemailer");

// Configuration for sending emails using nodemailer
var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "coolpetfoodtracker@gmail.com",
        pass: "j8asj91aml",
    },
});

// Set email content
var mailOptions = {
    from: "coolpetfoodtracker@gmail.com",
    to: "christianrichmond.12@gmail.com",
    subject: "Your pet's bowl is empty!",
    html: '<h1>Your pet\'s bowl is empty!</h1> <img alt="Embedded Image" height="512" width="384" src="https://i.imgur.com/unzfnaD.jpeg" />',
};

const app = express();
app.use(cors());
app.use(express.json()); // parses incoming requests with JSON payloads

// declare react files in build as static
app.use(express.static(path.join(__dirname, "build")));

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

// Operation to get data from table weights
app.get("/weights", (req, res) => {
    db.query("SELECT * FROM weights", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

// Operation to get data from table eatenperday
app.get("/eatenperday", (req, res) => {
    db.query("SELECT * FROM eatenperday", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

// Operation to add data to table weights
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

// Operation to modify data in table weights
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

// Operation to delete data in table weights
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

//function to get last weight
function getweight() {
    const newquery =
        "SELECT food_weight from (SELECT * FROM weights ORDER BY id DESC LIMIT 1)";
    return db.query(newquery, lastweight);
}

// Checks every 3 minutes if the last weight measurement is under 20 grams
// and sends an email if the condition is met
// An email is sent only if it has been at least 9 hours from the last email
var intervalId = setInterval(function () {
    console.log("Interval1 reached every 3 minutes");

    if (Math.floor((new Date() - lastEmailTime) / 1000 / 3600) > 8) {
        db.query(
            "SELECT * FROM weights ORDER BY id DESC LIMIT 1",
            function (err, value) {
                if (err) {
                    throw err;
                } else {
                    lastweight = value[0].food_weight;
                }

                console.log(lastweight);

                if (lastweight < 20) {
                    console.log("Weight below minimum");
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log("Email sent: " + info.response);
                            lastEmailTime = new Date();
                            console.log(lastEmailTime);
                        }
                    });
                }
            }
        );
    }
}, 180000);

// Updates table "eatenperday" with the total food eaten per day. This table will be used for the dashboard.
// Updates every 5 minutes.
var intervalId2 = setInterval(function () {
    console.log("Interval2 reached every 5 minutes");

    db.query(
        `
    DELETE FROM eatenperday
    `,
        function (err, value) {
            if (err) {
                throw err;
            } else {
                console.log("------");
                console.log("deleted eaten per day");
                console.log("------");
                db.query(
                    `
                INSERT INTO eatenperday (day, eaten)
                SELECT day, SUM(diff_eaten) AS eaten
                FROM
                (SELECT cast(time AS date) AS day, diff_eaten
                FROM
                (SELECT *, CASE
                    WHEN diff < 0 THEN -diff
                    WHEN diff >= 0 THEN 0
                END AS diff_eaten
                FROM
                (SELECT time, food_weight, food_weight - previous AS diff
                FROM   
                (SELECT id, time, food_weight, previous FROM
                weights INNER JOIN
                (SELECT id+1 AS id2, food_weight AS previous
                FROM weights)temp1
                ON id = id2)temp2)temp3)temp4)temp5
                GROUP BY day
                `,
                    function (err, value) {
                        if (err) {
                            throw err;
                        } else {
                            console.log("updated eatenperday");
                            console.log(value);
                        }
                    }
                );
            }
        }
    );
}, 10000);

// serve index.html from the build folder
app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});
