import express from "express";
import dotenv from "dotenv"
import logging from '@sap/logging'

import { authRouter } from "./routes/auth.route.js";
import { movieRouter } from "./routes/movie.route.js";

const app = express()
app.use(express.json())

var appContext = logging.createAppContext();
app.use(logging.middleware({ appContext: appContext, logNetwork: true }));


app.use("/auth",authRouter)
app.use("/movie",movieRouter)

app.listen(process.env.PORT,()=>{
    console.log("server started")
})