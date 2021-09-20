const { User, validateUser } = require("../models/user")
const { Notification, validateNotification } = require("../models/notification")
const { Auction, validateAuction } = require("../models/auction")
const { Offer, validateOffer } = require("../models/offer")
const bcrypt = require("bcrypt")
const router = require("express").Router()
const ensureToken = require("../middleware/jwt")

//req.params ile /:id alinabilir.
//req.query ile query params alinabilir.
//req.body ile body alinabilir.



router.post("/signup", async (req, res) => {
    // #swagger.tags = ['Users']
    /*    #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Adding new user.',
            schema: {
                $username: 'doruk',
                $password: 'dodo1234'
                }
    } */
    try {
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const sameUsernameUser = await User.findOne({ username: req.body.username });
        if (sameUsernameUser) {
            return res.status(400).send("Username exists! Enter another username.");
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
    // #swagger.tags = ['Users']
    /*    #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Logging in.',
            schema: {
                $username: 'doruk',
                $password: 'dodo1234'
                }
    } */
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
        const data = {}
        data.token = token
        data.user = user
        res.send(data);
    } catch (error) {
        console.log(error);
        res.send("An error occured");
    }
});



router.get("/me", ensureToken, (req, res) => {
    // #swagger.tags = ['Users']
    /* #swagger.security = [{
        "Bearer": []
    }] */
    res.status(200).json({
        "message": "TODO: will return jwt token here"
    })

})


router.get("/", ensureToken, async (req, res) => {
    // #swagger.tags = ['Users']
    /* #swagger.security = [{
        "Bearer": []
    }] */
    const allUsers = await User.find({}).populate("auctions")
    res.json(allUsers)

})

router.put("/", ensureToken, async (req, res) => {
    // #swagger.tags = ['Users']
    /* #swagger.security = [{
        "Bearer": []
    }] */
        /*    #swagger.parameters['obj'] = {
            in: 'body',
            description: 'New password',
            schema: {
                $newPassword: 'doruk'
            }
    } */
    const { myUser } = req
    const { newPassword } = req.body
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    myUser.password = await bcrypt.hash(newPassword, salt);
    myUser.save()
    res.status(200).send("password updated.")

})


router.delete("/", ensureToken, async (req, res) => {
    // #swagger.tags = ['Users']
    /* #swagger.security = [{
    "Bearer": []
}] */

    // delete notifications
    // delete user auctions - delete user auction offers
    // delete user offers
    // delete user itself
    const { myUser } = req
    await Notification.deleteMany({ owner: myUser._id })
    const userAuctions = await Auction.find({ owner: myUser._id })
    await Auction.deleteMany({ owner: myUser._id })

    await userAuctions.forEach(auction => {
        Offer.deleteMany({ auction: auction._id })
    })

    await Offer.deleteMany({ owner: myUser._id })

    myUser.delete()
    res.status(200).send("user deleted.")

})

router.get("/whoami", ensureToken, async (req, res) => {
    // #swagger.tags = ['Users']
    /* #swagger.security = [{
    "Bearer": []
}] */
    const { myUser } = req
    res.json(myUser)
})

router.post("/addCredit", ensureToken, async (req, res) => {
    // #swagger.tags = ['Users']
    /* #swagger.security = [{
    "Bearer": []
}] */
    /*    #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Adding credit',
            schema: {
                $credit: 50,
                }
    } */
    const { myUser } = req
    myUser.credit += req.body.credit
    myUser.save()
    res.status(200).send(`${req.body.credit} credit(s) added.`)
})

module.exports = router

