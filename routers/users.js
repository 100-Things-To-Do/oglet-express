const { User, validateUser } = require("../models/user")
const bcrypt = require("bcrypt")
const router = require("express").Router()
const ensureToken = require("../middleware/jwt")

//req.params ile /:id alinabilir.
//req.query ile query params alinabilir.
//req.body ile body alinabilir.



router.post("/signup", async (req, res) => {
    try {
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const sameUsernameUser = await User.findOne({ username: req.body.username });
        if(sameUsernameUser){
            return res.status(400).send("username exists.");
        }
        const user = new User(req.body);

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        user.password = await bcrypt.hash(user.password, salt);
        user.save();

        res.send(user);
    } catch (error) {
        console.log(error);
        res.send("An error occured");
    }
});



router.post("/signin", async (req, res) => {
    try {
        
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({ username: req.body.username });
        if (!user) return res.status(400).send("User not found");

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!validPassword)
            return res.status(400).send("Invalid password");

        const token = user.generateAuthToken();
        res.send(token);
    } catch (error) {
        console.log(error);
        res.send("An error occured");
    }
});




router.delete("/", async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).send("User not found");
    user.delete()
    res.status(200).send("User deleted")

})





router.get("/me", ensureToken, (req, res) => {
    res.status(200).json({
        "message": "ensured"
    })

})


router.get("/", ensureToken, async (req, res) => {
    const allUsers = await User.find({}).populate("auctions")
    res.json(allUsers)

})

module.exports = router

