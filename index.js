const express = require('express')
const usersRouter = require("./routers/users")
const auctionsRouter = require("./routers/auctions")


const server = express()
server.use(express.json())
server.use("/users", usersRouter)
server.use("/auctions", auctionsRouter)


server.get('/', (req, res) => {
    res.send("Expressten merhaba ")
})




server.listen(5000, () => {
    console.log("https://localhost:5000 dinleniyor.")
})