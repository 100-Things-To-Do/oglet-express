const router = require("express").Router()
const userService = require("../services/user-service")
const ensureToken = require("../middleware/jwt")
const { Response } = require('../responses')


router.post("/signup", async (req, res, next) => {
    // #swagger.tags = ['Users']
    /*    #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Adding new user.',
            schema: {
                $username: 'doruk',
                $password: 'dodo1234'
                }
    } */
    const responseEntity = new Response();
    try {
        responseEntity.data = await userService.createUser(req.body).catch(error => {
            throw error;
        });
        res.status(responseEntity.statusCode).json(responseEntity.data);
    } catch (err) {
        next(err)
    }
});


router.post("/signin", async (req, res, next) => {
    // #swagger.tags = ['Users']
    /*    #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Logging in.',
            schema: {
                $username: 'doruk',
                $password: 'dodo1234'
                }
    } */
    const responseEntity = new Response();
    try {
        responseEntity.data = await userService.signin(req.body).catch(error => {
            throw error;
        });
        res.status(responseEntity.statusCode).json(responseEntity.data);
    } catch (err) {
        next(err);
    }
});


router.get("/", ensureToken, async (req, res, next) => {
    // #swagger.tags = ['Users']
    /* #swagger.security = [{
        "Bearer": []
    }] */
    const responseEntity = new Response();
    try {
        responseEntity.data = await userService.getAllUsers().catch(error => {
            throw error;
        });
        res.status(responseEntity.statusCode).json(responseEntity.data);
    } catch (err) {
        next(err)
    }
})


router.put("/", ensureToken, async (req, res, next) => {
    // #swagger.tags = ['Users']
    /* #swagger.security = [{
        "Bearer": []
    }] */
    /*    #swagger.parameters['obj'] = {
        in: 'body',
        description: 'New password',
        schema: {
            $newPassword: 'doruk'
        }
} */
    const responseEntity = new Response();
    const { myUser } = req
    const { newPassword } = req.body
    try {
        responseEntity.data = await userService.updateUser(myUser, newPassword).catch(error => {
            throw error;
        });
        res.status(responseEntity.statusCode).json(responseEntity.data);
    } catch (err) {
        next(err)
    }
})


router.delete("/", ensureToken, async (req, res, next) => {
    // #swagger.tags = ['Users']
    /* #swagger.security = [{
    "Bearer": []
}] */

    // delete notifications
    // delete user auctions - delete user auction offers
    // delete user offers
    // delete user itself
    const responseEntity = new Response();
    const { myUser } = req
    try {
        responseEntity.data = await userService.deleteUser(myUser).catch(error => {
            throw error;
        });
        res.status(responseEntity.statusCode).json(responseEntity.data);
    } catch (err) {
        next(err)
    }
})


router.get("/whoami", ensureToken, async (req, res, next) => {
    // #swagger.tags = ['Users']
    /* #swagger.security = [{
    "Bearer": []
}] */
    const responseEntity = new Response();
    const { myUser } = req
    try {
        responseEntity.data = await userService.getUser(myUser).catch(error => {
            throw error;
        });
        res.status(responseEntity.statusCode).json(responseEntity.data);
    } catch (err) {
        next(err)
    }
})


router.post("/addCredit", ensureToken, async (req, res, next) => {
    // #swagger.tags = ['Users']
    /* #swagger.security = [{
    "Bearer": []
}] */
    /*    #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Adding credit',
            schema: {
                $credit: 50,
                }
    } */
    const responseEntity = new Response();
    const { myUser } = req
    try {
        responseEntity.data = await userService.addCredit(myUser).catch(error => {
            throw error;
        });
        res.status(responseEntity.statusCode).json(responseEntity.data);
    } catch (err) {
        next(err)
    }
})

module.exports = router