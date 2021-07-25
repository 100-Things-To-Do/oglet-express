const { Auction, validateAuction } = require("../models/auction")
const { Offer, validateOffer } = require("../models/offer")
const { User, validateUser } = require("../models/user")
const router = require("express").Router()
const ensureToken = require("../middleware/jwt")
const cron = require('node-cron');
const { Notification, validateNotification} = require("../models/notification")

const aDayToMs = 24 * 60 * 60 * 1000

cron.schedule("*/5 * * * * *", async function() {
    const currentMs = (new Date()).getTime()
    const allAuctions = await Auction.find({isOver: false}).populate("offers").populate("owner")

    allAuctions.forEach((auction) => {

        var auctionCreatedMs = new Date(auction.createdAt).getTime();
        if(currentMs > (auctionCreatedMs + aDayToMs)){
            auction.isOver = true
            auction.save()
            
            if(auction.offers !== []){
                const buyerNotification = new Notification({owner: auction.offers[0].owner._id, message: "You have won auction with id: " + auction._id})
                buyerNotification.save() 

                const sellerNotification = new Notification({owner: auction.owner._id, message: "You have sold your item to user: " + auction.offers[0].owner.username})
                sellerNotification.save()
            }


        }
    })
  });

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
    const { isOver } = req.body
    var allAuctions
    if(isOver !== null){
        allAuctions = await Auction.find({isOver: isOver}).populate("owner")
    }else{
        allAuctions = await Auction.find({}).populate("owner")
    }
    
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