const router = require("express").Router()
const cardService = require("../services/card-service")
const { Response } = require('../responses')


router.post("/", global.upload.single("img"), async (req, res, next) => {
    const responseEntity = new Response();
    if (typeof req.file !== 'undefined') {
        req.body.img = req.file.filename
    }
    try {
        responseEntity.data = await cardService.createCard(req.body.domain_id, req.body.index, req.body.text, req.body.img).catch(error => {
            throw error;
        });
        res.status(responseEntity.statusCode).json(responseEntity.data);
    } catch (err) {
        next(err)
    }
})

router.get("/:domainId", async (req, res, next) => {
    const responseEntity = new Response();
    try {
        responseEntity.data = await cardService.getDomainCards(req.params.domainId).catch(error => {
            throw error;
        });
        res.status(responseEntity.statusCode).json(responseEntity.data);
    } catch (err) {
        next(err)
    }
})

module.exports = router;