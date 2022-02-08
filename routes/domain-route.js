const router = require("express").Router()
const domainService = require("../services/domain-service")
const { Response } = require('../responses')



router.post("/", async (req, res, next) => {
    const responseEntity = new Response();
    try {
        responseEntity.data = await domainService.createDomain(req.body.name, req.body.size).catch(error => {
            throw error;
        });
        res.status(responseEntity.statusCode).json(responseEntity.data);
    } catch (err) {
        next(err)
    }
})

router.get("/", async (req, res, next) => {
    const responseEntity = new Response();
    try {
        responseEntity.data = await domainService.getDomains().catch(error => {
            throw error;
        });
        res.status(responseEntity.statusCode).json(responseEntity.data);
    } catch (err) {
        next(err)
    }
})

module.exports = router;