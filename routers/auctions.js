const router = require("express").Router()

router.post("/auction", (req, res) => {
    const { name } = req.body
    res.status(201)
})

module.exports = router