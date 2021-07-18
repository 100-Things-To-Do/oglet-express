const jwt = require("jsonwebtoken")
const { User, validateUser } = require("../models/user")

function ensureToken(req, res, next){
    const bearerHeader = req.headers["authorization"]
    if(typeof bearerHeader !== 'undefined'){
        const token = bearerHeader.split(" ")[1]

        jwt.verify(token, process.env.JWTPRIVATEKEY, async function(err, data){
            if(err){
                res.status(403).json(err)
            }else{
                req.myUser = await User.findOne({ _id: data._id});
                if(!req.myUser) res.status(403).send("user not found (refresh jwt)")
                next()
            }
        })
    }else{ 
        res.status(403).send("JWT is null")
    }
}

module.exports = ensureToken