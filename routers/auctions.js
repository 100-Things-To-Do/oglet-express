const { Auction, validateAuction } = require("../models/auction")
const { Offer, validateOffer } = require("../models/offer")
const { User, validateUser } = require("../models/user")
const router = require("express").Router()
const ensureToken = require("../middleware/jwt")

router.post("/", ensureToken, async (req, res) => {
    try{
        const { error } = validateAuction(req.body);
        const {myUser} = req
        if (error) return res.status(400).send(error.details[0].message);

        req.body.owner = myUser._id
        const auction = new Auction(req.body);
        auction.save()
        myUser.auctions.push(auction._id)
        myUser.save()
        res.send(auction);
    } catch (error) {
        console.log(error);
        res.send("An error occured");
    }


})


router.get("/", ensureToken, async (req, res) => {
    const allAuctions = await Auction.find({}).populate("owner")
    res.status(200).json(allAuctions)
})

router.get("/:auctionId", ensureToken, async (req, res) => {
    const { auctionId } = req.params
    const auction = await Auction.findOne({_id: auctionId}).populate("owner").populate("offers")
    res.status(200).json(auction)
})

router.delete("/:auctionId", ensureToken, async (req, res) => {
    const { auctionId } = req.params
    const { myUser } = req
    const auction = await Auction.findOne({_id: auctionId})
    if(myUser._id.str !== auction.owner.str) return res.status(403).send("You dont have rights to delete auction.")
    const users = await User.find({})
    myUser.auctions.remove(auction._id)
    myUser.save()
    const offers = await Offer.find({auction: auction._id})
    await Offer.deleteMany({auction: auction._id}, (err, data) => {
        if(err){
            console.log(err)
            res.status(400).send("error deleting offers.")
        }
    })
    offers.forEach(offer => {
        users.forEach(user => {
            user.offers.remove(offer._id)
            user.save()
        })  
    })

    auction.delete()
    res.send("auction deleted.")
})

router.put("/:auctionId", async (req, res) => {
    const { auctionId } = req.params
    const { myUser } = req
    const { name, startingPrice, closingPrice } = req.body
    
    const auction = await Auction.findOne({_id: auctionId})
    auction.name = name
    auction.startingPrice = startingPrice
    auction.closingPrice = closingPrice
    auction.save()
    res.status(200).send("auction updated")
})

module.exports = router