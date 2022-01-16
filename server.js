const express = require("express");
const mysql = require("mysql");
require("dotenv").config();
const path = require("path");
const cors = require("cors");

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

// serve index.html from the build folder
app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});
