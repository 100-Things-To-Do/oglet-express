require("dotenv").config();
const express = require('express')
const usersRouter = require("./routers/users")
const auctionsRouter = require("./routers/auctions")
const offerRouter = require("./routers/offers")
const notificationRouter = require("./routers/notifications")
const connection = require("./db");
var cors = require('cors')
const cron = require('node-cron');

const server = express()
connection();

server.use(cors({credentials: true, origin: true}))
server.use(express.json())
server.use("/users", usersRouter)
server.use("/auctions", auctionsRouter)
server.use("/offers", offerRouter)
server.use("/notifications", notificationRouter)

server.get('/', (req, res) => {
    res.send("Hello from expressjs")
})

cron.schedule("*/5 * * * * *", function() {
    console.log('running a task every 5 secs.');
  });


server.listen(5000, () => {
    console.log("https://localhost:5000 is listening.")
})