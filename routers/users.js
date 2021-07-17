const router = require("express").Router()

//req.params ile /:id alinabilir.
//req.query ile query params alinabilir.
//req.body ile body alinabilir.

router.post("/signin", (req, res) => {
    const { username, password } = req.query
    res.status(200)

})


router.get("/me", (req, res) => {
    //const { username, password } = req.query
    res.status(200).json({
        "key": "aaaa"
    })

})

module.exports = router

