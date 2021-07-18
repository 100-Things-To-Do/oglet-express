require("dotenv").config();
const express = require('express')
const usersRouter = require("./routers/users")
const auctionsRouter = require("./routers/auctions")
const offerRouter = require("./routers/offers")
const connection = require("./db");

const server = express()
connection();

server.use(express.json())
server.use("/users", usersRouter)
server.use("/auctions", auctionsRouter)
server.use("/offers", offerRouter)

server.get('/', (req, res) => {
    res.send("Hello from expressjs")
})




server.listen(5000, () => {
    console.log("https://localhost:5000 is listening.")
})