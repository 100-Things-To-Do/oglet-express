const { Auction, validateAuction } = require("../models/auction")
const { Offer, validateOffer } = require("../models/offer")
const { User, validateUser } = require("../models/user")
const router = require("express").Router()
const ensureToken = require("../middleware/jwt")
const cron = require('node-cron');
const { Notification, validateNotification } = require("../models/notification")
const multer = require("multer")

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "client/")
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + ".jpg")
    }
})

const upload = multer({ storage: storage })

const aDayToMs = 24 * 60 * 60 * 1000

cron.schedule("*/5 * * * * *", async function () {
    const currentMs = (new Date()).getTime()
    const allAuctions = await Auction.find({ isOver: false }).populate("offers").populate("owner")

    allAuctions.forEach((auction) => {

        var auctionCreatedMs = new Date(auction.createdAt).getTime();
        if (currentMs > (auctionCreatedMs + aDayToMs)) {
            auction.isOver = true
            auction.save()

            if (auction.offers !== []) {
                const buyerNotification = new Notification({ owner: auction.offers[0].owner._id, message: "You have won auction with id: " + auction._id })
                buyerNotification.save()

                const sellerNotification = new Notification({ owner: auction.owner._id, message: "You have sold your item to user: " + auction.offers[0].owner.username })
                sellerNotification.save()
            }


        }
    })
});

router.post("/", ensureToken, upload.single("img"), async (req, res) => {
    // #swagger.tags = ['Auctions']
        /* #swagger.security = [{
        "Bearer": []
    }] */
        /*    #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Adding new auction.',
            schema: {
                $name: 'doruk',
                $startingPrice: 50,
                $closingPrice: 60
                }
    } */
    try {
        const { error } = validateAuction(req.body);
        const { myUser } = req
        if (error) return res.status(400).send(error.details[0].message);

        req.body.owner = myUser._id
        if (typeof req.file !== 'undefined') {
            req.body.img = req.file.filename
        }
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
    // #swagger.tags = ['Auctions']
        /* #swagger.security = [{
        "Bearer": []
    }] */
    const { isOver } = req.body
    var allAuctions
    if (isOver !== null) {
        //allAuctions = await Auction.find({isOver: isOver}).populate("owner")
        allAuctions = await Auction.find({}).populate("owner").populate("offers")
    } else {
        allAuctions = await Auction.find({}).populate("owner").populate("offers")
    }

    res.status(200).json(allAuctions)
})

router.get("/:auctionId", ensureToken, async (req, res) => {
    // #swagger.tags = ['Auctions']
    /* #swagger.security = [{
    "Bearer": []
}] */
    const { auctionId } = req.params
    const auction = await Auction.findOne({ _id: auctionId }).populate("owner").populate("offers")
    if(auction){
        res.status(200).json(auction)
    }else{
        throw new Error('Auction not found!') // Express will catch this on its own.
    }
})

router.delete("/:auctionId", ensureToken, async (req, res) => {
    // #swagger.tags = ['Auctions']
    /* #swagger.security = [{
        "Bearer": []
    }] */
    const { auctionId } = req.params
    const { myUser } = req
    const auction = await Auction.findOne({ _id: auctionId })
    if (myUser._id.str !== auction.owner.str) throw new Error("You dont have rights to delete auction.")
    const users = await User.find({})
    myUser.auctions.remove(auction._id)
    myUser.save()
    const offers = await Offer.find({ auction: auction._id })
    await Offer.deleteMany({ auction: auction._id }, (err, data) => {
        if (err) {
            console.log(err)
            throw new Error("error deleting offers.")
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
    // #swagger.tags = ['Auctions']
    /*  #swagger.parameters['parameter_name'] = {
            in: 'body',
            description: 'Put auction',
            schema: {
                $name: 'dorukChanged',
                $startingPrice: 55,
                $closingPrice: 65
            }
    } */
    const { auctionId } = req.params
    const { myUser } = req
    const { name, startingPrice, closingPrice } = req.body

    const auction = await Auction.findOne({ _id: auctionId })
    auction.name = name
    auction.startingPrice = startingPrice
    auction.closingPrice = closingPrice
    auction.save()
    res.status(200).send("auction updated")
})



module.exports = router