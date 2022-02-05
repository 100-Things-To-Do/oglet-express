const router = require("express").Router()
const offerService = require("../services/offer-service")
const ensureToken = require("../middleware/jwt")
const { Response } = require('../responses')

const multer = require("multer")
const upload = multer()


router.post("/:auctionId", upload.any(), ensureToken, async (req, res, next) => {
    // #swagger.tags = ['Offers']
    /* #swagger.security = [{
    "Bearer": []
}] */
    /*  #swagger.parameters['parameter_name'] = {
    in: 'body',
    description: 'Post offer',
    schema: {
        $price: 70
    }
} */
    const responseEntity = new Response();
    const { auctionId } = req.params
    const { myUser } = req
    try {
        responseEntity.data = await offerService.createOffer(auctionId, myUser, req.body).catch(error => {
            throw error;
        });
        res.status(responseEntity.statusCode).json(responseEntity.data);
    } catch (err) {
        next(err)
    }


})


router.put("/:offerId", ensureToken, async (req, res, next) => {
    // #swagger.tags = ['Offers']
    /* #swagger.security = [{
    "Bearer": []
}] */
    /*  #swagger.parameters['parameter_name'] = {
    in: 'body',
    description: 'Put offer',
    schema: {
        $price: 71
    }
} */
    // TODO: int check
    const responseEntity = new Response();
    const { offerId } = req.params
    const { price } = req.body
    const { myUser } = req
    try {
        responseEntity.data = await offerService.updateOffer(myUser, offerId, price).catch(error => {
            throw error;
        });
        res.status(responseEntity.statusCode).json(responseEntity.data);
    } catch (err) {
        next(err)
    }
})


router.delete("/:offerId", ensureToken, async (req, res, next) => {
    // #swagger.tags = ['Offers']
    /* #swagger.security = [{
    "Bearer": []
}] */
    const responseEntity = new Response();
    const { offerId } = req.params
    const { myUser } = req
    try {
        responseEntity.data = await offerService.deleteOffer(myUser, offerId).catch(error => {
            throw error;
        });
        res.status(responseEntity.statusCode).json(responseEntity.data);
    } catch (err) {
        next(err);
    }
})


router.get("/", ensureToken, async (req, res, next) => {
    // #swagger.tags = ['Offers']
    /* #swagger.security = [{
    "Bearer": []
}] */
    const responseEntity = new Response();
    try {
        responseEntity.data = await offerService.getAllOffers().catch(error => {
            throw error;
        });
        res.status(responseEntity.statusCode).json(responseEntity.data);
    } catch (err) {
        next(err)
    }

})

module.exports = router;