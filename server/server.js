const express = require('express');
const mongoose = require('mongoose');

const cors= require('cors');
require('dotenv').config();


const userRoutes= require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const hotelRoutes = require('./routes/hotelRoutes');

const app= express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/contact-messages", contactRoutes);
app.use("/api/hotels", hotelRoutes);

app.get("/", (req,res)=>{
    console.log("server hit", req.url);
    res.send("API is running");
});

app.get("/health", (req,res)=>{
    res.send("ok");
});


console.log("Connecting to MongoDB...");

mongoose
    .connect(process.env.MONGO_URI_LOCAL)
    .then(()=>{
        console.log("connected to DB");
        app.listen(5001, ()=>{
            console.log("Listening to port 5001");
        })
    })
    .catch((err)=>{
        console.error("DB connect error: ", err.message);
    });
