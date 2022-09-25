const express = require('express');
const bodyParser = require('body-parser');
const mailchimp = require("@mailchimp/mailchimp_marketing");
const app = express();
const port = process.env.PORT || 3000;
const listId = "4489f55cf0";

mailchimp.setConfig({
    apiKey: "8f91b810182848ffc9ca75e4ef5f24be-us9",
    server: "us9",
});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.listen(port, () => {
    console.log("Server is listening to port: " + port);
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
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