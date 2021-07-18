const { Auction, validateAuction } = require("../models/auction")
const { User, validateUser } = require("../models/user")
const { Offer, validateOffer } = require("../models/offer")
const router = require("express").Router()
const ensureToken = require("../middleware/jwt")
const mongoose = require("mongoose");

router.post("/:auctionId", ensureToken, async (req, res) => {
    try{
        const { auctionId } = req.params
        const { error } = validateOffer(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const activeUser = await User.findOne({ _id: req.currentUser._id});
        req.body.owner = activeUser._id

        const auction = await Auction.findOne({ _id: new mongoose.Types.ObjectId(auctionId)});
        if(auction !== null){
            req.body.auction = auction._id
        }else{
            res.send("auction with that id is not found.")
        }



        const offer = new Offer(req.body)
        // relationlar guncelleniyor
        auction.offers.push(offer._id)
        auction.save()
        activeUser.offers.push(offer._id)
        activeUser.save()

        offer.save()
        res.send(offer);
    } catch (error) {
        console.log(error);
        res.send("An error occured");
    }


})



router.get("/", ensureToken, async (req, res) => {
    const allOffers = await Offer.find({}).populate("owner").populate("auction")
    res.json(allOffers)
})

module.exports = router