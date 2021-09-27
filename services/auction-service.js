const { Auction } = require("../models/auction")
const { Offer } = require("../models/offer")
const { User } = require("../models/user")
const { Notification } = require("../models/notification")
const cron = require('node-cron');


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

async function createAuction(myUser, auctionObj){
    auctionObj.owner = myUser._id
    const auction = new Auction(auctionObj);
    auction.save()
    myUser.auctions.push(auction._id)
    myUser.save()
    return auction; 
}


async function getAuctions() {
    var allAuctions;
    var isOver = null;
    if (isOver !== null) {
        //allAuctions = await Auction.find({isOver: isOver}).populate("owner")
        allAuctions = await Auction.find({}).populate("owner").populate("offers")
    } else {
        allAuctions = await Auction.find({}).populate("owner").populate("offers")
    }
    return allAuctions;
}


async function getAuction(auctionId) {
    const auction = await Auction.findOne({ _id: auctionId }).populate("owner").populate("offers")
    if(auction){
        return auction;
    }else{
        throw new Error('Auction not found!') // Express will catch this on its own.
    }
}

async function deleteAuction(auctionId, myUser){
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
    return "auction deleted.";
}



async function updateAuction(auctionId, name, startingPrice, closingPrice){
    const auction = await Auction.findOne({ _id: auctionId })
    auction.name = name
    auction.startingPrice = startingPrice
    auction.closingPrice = closingPrice
    auction.save()
    return "auction updated";
}

module.exports = {
    createAuction,
    getAuctions,
    getAuction,
    deleteAuction,
    updateAuction,

}
