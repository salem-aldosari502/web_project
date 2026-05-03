const express = require("express");
const route = express.Router();
const { createMessage, getAllMessages } = require("../controllers/contactController");

route.post("/", createMessage);

route.get("/", getAllMessages);

module.exports = route;
