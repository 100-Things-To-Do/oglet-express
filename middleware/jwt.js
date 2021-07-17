const jwt = require("jsonwebtoken")

function ensureToken(req, res, next){
    const bearerHeader = req.headers["authorization"]
    if(typeof bearerHeader !== 'undefined'){
        const token = bearerHeader.split(" ")[1]

        jwt.verify(token, process.env.JWTPRIVATEKEY, function(err, data){
            if(err){
                res.status(403)
            }else{
                req.data = data;
                next()
            }
        })
    }else{
        res.status(403)
    }
}

module.exports = ensureToken