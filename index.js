require("dotenv").config();
const express = require('express')
const usersRouter = require("./routers/users")
const auctionsRouter = require("./routers/auctions")
const offerRouter = require("./routers/offers")
const notificationRouter = require("./routers/notifications")
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
server.use("/users", usersRouter)
server.use("/auctions", auctionsRouter)
server.use("/offers", offerRouter)
server.use("/notifications", notificationRouter)




server.listen(5000, () => {
    console.log("https://localhost:5000 is listening.")
})