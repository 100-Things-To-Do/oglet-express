const { User } = require("../models/user")
const { Notification } = require("../models/notification")
const { Auction } = require("../models/auction")
const { Offer } = require("../models/offer")
const bcrypt = require("bcrypt")

//req.params ile /:id alinabilir.
//req.query ile query params alinabilir.
//req.body ile body alinabilir.

async function createUser(userObj) {
    const sameUsernameUser = await User.findOne({ username: userObj.username });
    if (sameUsernameUser) {
        throw new Error("Username exists! Enter another username.");
    }
    const user = new User(userObj);

    const salt = await bcrypt.genSalt(Number(global.SALT));
    user.password = await bcrypt.hash(user.password, salt);
    user.save();

    return user;

}


async function signin(userObj) {
    const user = await User.findOne({ username: userObj.username });
    if (!user) {
        throw new Error("User not found");
    }

    const validPassword = await bcrypt.compare(
        userObj.password,
        user.password
    );

    if (!validPassword)
        throw new Error("Invalid password");

    const token = user.generateAuthToken();
    const data = {}
    data.token = token
    data.user = user
    return data;

}

async function getAllUsers() {
    return await User.find({}).populate("auctions")
}


async function updateUser(myUser, newPassword) {
    const salt = await bcrypt.genSalt(Number(global.SALT));
    myUser.password = await bcrypt.hash(newPassword, salt);
    myUser.save()
    return "Password updated.";
}


async function deleteUser(myUser) {
    await Notification.deleteMany({ owner: myUser._id })
    const userAuctions = await Auction.find({ owner: myUser._id })
    await Auction.deleteMany({ owner: myUser._id })

    await userAuctions.forEach(auction => {
        Offer.deleteMany({ auction: auction._id })
    })

    await Offer.deleteMany({ owner: myUser._id })

    myUser.delete()
    return "User deleted."
}


async function getUser(myUser) {
    return myUser;
}



async function addCredit(myUser) {
    myUser.credit += req.body.credit
    myUser.save()
    return `${req.body.credit} credit(s) added.`
}


module.exports = {
    createUser,
    signin,
    deleteUser,
    updateUser,
    getAllUsers,
    getUser,
    addCredit
}

