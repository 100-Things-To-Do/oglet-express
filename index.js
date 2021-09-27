require("dotenv").config();
const express = require('express')
const userRouter = require("./routes/user-route")
const auctionRouter = require("./routes/auction-route")
const offerRouter = require("./routes/offer-route")
const notificationRouter = require("./routes/notification-route")
const connection = require("./db");
var cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

const server = express()
connection();

server.use(cors({credentials: true, origin: true}))
server.use(express.json())
server.use(express.static('client'))
server.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
server.use("/users", userRouter)
server.use("/auctions", auctionRouter)
server.use("/offers", offerRouter)
server.use("/notifications", notificationRouter)




server.listen(5000, () => {
    console.log("https://localhost:5000 is listening.")
})