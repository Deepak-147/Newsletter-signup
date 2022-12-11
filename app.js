require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mailchimp = require("@mailchimp/mailchimp_marketing");
const app = express();
const port = process.env.PORT || 3000;
const listId = "4489f55cf0"; // Available at: https://us9.admin.mailchimp.com/lists/settings?id=1033397

mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY, // API key secret stored in Heroku config vars
    server: "us9",
});

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({extended: true}));

app.listen(port, () => {
    console.log("Server is listening to port: " + port);
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    addMember(res, firstName, lastName, email);
});

async function addMember(res, firstName, lastName, email) {
    try {
        const response = await mailchimp.lists.addListMember(listId, {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        });
        res.sendFile(__dirname + "/success.html");
    }
    catch (err) {
        console.log(err);
        res.sendFile(__dirname + "/failure.html");
    }
}

app.post("/failure", (req, res) => {
    res.redirect("/");
});