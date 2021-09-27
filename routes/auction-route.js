const router = require("express").Router()
const auctionService = require("../services/auction-service")
const ensureToken = require("../middleware/jwt")
const { Response } = require('../responses')
const { routeFunctionErrorHandler } = require('../handleErrors')

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
    const responseEntity = new Response();
    const { myUser } = req
    if (typeof req.file !== 'undefined') {
        req.body.img = req.file.filename
    }
    try {
        responseEntity.data = await auctionService.createAuction(myUser, req.body).catch(error => {
            throw error;
        });
        res.status(responseEntity.statusCode).json(responseEntity.data);
    } catch (exception) {
        console.log(exception);
        routeFunctionErrorHandler(res, exception, null);
    }
})


router.get("/", ensureToken, async (req, res) => {
    // #swagger.tags = ['Auctions']
    /* #swagger.security = [{
    "Bearer": []
}] */
    const responseEntity = new Response();
    try {
        responseEntity.data = await auctionService.getAuctions().catch(error => {
            throw error;
        });
        res.status(responseEntity.statusCode).json(responseEntity.data);
    } catch (exception) {
        routeFunctionErrorHandler(res, exception, null);
    }
})


router.get("/:auctionId", ensureToken, async (req, res) => {
    // #swagger.tags = ['Auctions']
    /* #swagger.security = [{
    "Bearer": []
    }] */
    const responseEntity = new Response();
    const { auctionId } = req.params
    try {
        responseEntity.data = await auctionService.getAuction(auctionId).catch(error => {
            throw error;
        });
        res.status(responseEntity.statusCode).json(responseEntity.data);
    } catch (exception) {
        routeFunctionErrorHandler(res, exception, null);
    }
})


router.delete("/:auctionId", ensureToken, async (req, res) => {
    // #swagger.tags = ['Auctions']
    /* #swagger.security = [{
        "Bearer": []
    }] */
    const responseEntity = new Response();
    const { auctionId } = req.params
    const { myUser } = req
    try {
        responseEntity.data = await auctionService.deleteAuction(auctionId, myUser).catch(error => {
            throw error;
        });
        res.status(responseEntity.statusCode).json(responseEntity.data);
    } catch (exception) {
        routeFunctionErrorHandler(res, exception, null);
    }
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
    const responseEntity = new Response();
    const { auctionId } = req.params
    const { myUser } = req
    const { name, startingPrice, closingPrice } = req.body
    try {
        responseEntity.data = await auctionService.updateAuction(auctionId, name, startingPrice, closingPrice).catch(error => {
            throw error;
        });
        res.status(responseEntity.statusCode).json(responseEntity.data);
    } catch (exception) {
        routeFunctionErrorHandler(res, exception, null);
    }
})


module.exports = router