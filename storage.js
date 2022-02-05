module.exports = () => {
    const multer = require("multer")

    const storage = multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, "client/")
        },
        filename: (req, file, callback) => {
            callback(null, Date.now() + ".jpg")
        }
    })
    global.upload = multer({ storage: storage })
}
