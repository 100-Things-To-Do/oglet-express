const router = require("express").Router()
const notificationService = require("../services/notification-service")
const ensureToken = require("../middleware/jwt")
const { Response } = require('../responses')


router.post("/", ensureToken, async (req, res, next) => {
    // #swagger.tags = ['Notifications']
    /* #swagger.security = [{
    "Bearer": []
}] */

    /*  #swagger.parameters['obj'] = {
    in: 'body',
    description: 'Post notification',
    schema: {
        $message: "temp notification."
    }
    } */
    const responseEntity = new Response();
    const { myUser } = req
    try {
        responseEntity.data = await auctionService.createNotification(myUser, req.body).catch(error => {
            throw error;
        });
        res.status(responseEntity.statusCode).json(responseEntity.data);
    } catch (err) {
        next(err);
    }

})



router.get("/", ensureToken, async (req, res, next) => {
    // #swagger.tags = ['Notifications']
    /* #swagger.security = [{
    "Bearer": []
}] */
    const responseEntity = new Response();
    const { myUser } = req
    try {
        responseEntity.data = await notificationService.getNotifications(myUser).catch(error => {
            throw error;
        });
        res.status(responseEntity.statusCode).json(responseEntity.data);
    } catch (err) {
        next(err)
    }
})


router.delete("/:notificationId", ensureToken, async (req, res, next) => {
    // #swagger.tags = ['Notifications']
    /* #swagger.security = [{
    "Bearer": []
}] */
    const responseEntity = new Response();
    const { notificationId } = req.params
    const { myUser } = req
    try {
        responseEntity.data = await notificationService.deleteNotification(notificationId, myUser).catch(error => {
            throw error;
        });
        res.status(responseEntity.statusCode).json(responseEntity.data);
    } catch (err) {
        next(err);
    }
})


router.put("/:notificationId", ensureToken, async (req, res, next) => {
    // #swagger.tags = ['Notifications']
    /* #swagger.security = [{
    "Bearer": []
}] */
    /*  #swagger.parameters['obj'] = {
    in: 'body',
    description: 'Post notification',
    schema: {
        $isRead: true
    }
    } */
    const responseEntity = new Response();
    const { notificationId } = req.params
    try {
        responseEntity.data = await notificationService.updateNotification(notificationId).catch(error => {
            throw error;
        });
        res.status(responseEntity.statusCode).json(responseEntity.data);
    } catch (err) {
        next(err);
    }
})

module.exports = router