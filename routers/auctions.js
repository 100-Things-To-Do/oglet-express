const { Auction, validateAuction } = require("../models/auction")
const { User, validate } = require("../models/user")
const router = require("express").Router()
const ensureToken = require("../middleware/jwt")

router.post("/", ensureToken, async (req, res) => {
    try{
        const { error } = validateAuction(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const activeUser = await User.findOne({ _id: req.currentUser._id});
        req.body.owner = activeUser._id
        const auction = new Auction(req.body);
        auction.save()
        activeUser.auctions.push(auction._id)
        activeUser.save()
        res.send(auction);
    } catch (error) {
        console.log(error);
        res.send("An error occured");
    }


})


router.get("/", ensureToken, async (req, res) => {
    const allAuctions = await Auction.find({}).populate("owner")
    res.json(allAuctions)
})

module.exports = router