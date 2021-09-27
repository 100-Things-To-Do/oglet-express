const { Auction } = require("../models/auction")
const { Offer } = require("../models/offer")



async function createOffer(auctionId, myUser, offerObj){
    try{

        offerObj.owner = myUser._id
        let auction = await Auction.findOne({ _id: auctionId}).populate("offers");
        if(auction !== null){
            offerObj.auction = auction._id
        }else{
            throw new Error("auction with that id is not found.")
        }
        const offer = new Offer(offerObj)
        if(offer.price < auction.startingPrice){
            throw new Error(`Offer must be higher than ${auction.startingPrice}`)
        }
        // relationlar guncelleniyor
        auction.offers.push(offer._id)
        await auction.save()
        await offer.save()
        auction = await Auction.findOne({ _id: auctionId}).populate("offers");
        myUser.offers.push(offer._id)
        await myUser.save()

        auction.offers.sort((a, b) => a.price - b.price)
        await auction.save()
        return offer;
    } catch (error) {
        console.log(error);
        throw new Error("An error occured");
    }


}

async function updateOffer(myUser, offerId, price){
    const offer = await Offer.findOne({ _id: offerId});
    if(price){
        if(price > offer.price){
            offer.price = price
        }else{
            throw new Error("Offer cannot be lower than previous.")
        }
    } 
    offer.save()
    return "offer updated.";
}


async function deleteOffer(myUser, offerId){
    const offer = await Offer.findOne({ _id: offerId});
    const auction = await Auction.findOne({ _id: offer.auction});
    myUser.offers.remove(offerId)
    auction.offers.remove(offerId)
    myUser.save()
    auction.save()
    offer.delete()
    return "offer deleted.";
}

async function getAllOffers(){
    const allOffers = await Offer.find({}).populate("owner").populate("auction")
    return allOffers
}
module.exports = {
    createOffer,
    updateOffer,
    deleteOffer,
    getAllOffers
}