const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/send", (req, res) => {
  const mailOptions = {
    from: req.body.email,
    to: process.env.EMAIL_TO,
    subject: `New message from ${req.body.name}`,
    html: `<h3>You got a new message from ${req.body.email}</h3>
           <p>${req.body.message}</p>
           <p>From: ${req.body.name}</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(501).send("Failed to send email");
    } else {
      res.status(200).send("Email sent successfully");
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));