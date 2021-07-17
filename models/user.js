const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const userSchema = new Schema({
    auctions: [{
        type: Schema.Types.ObjectId,
        ref: 'auction'
    }],
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

userSchema.methods.generateAuthToken = function () {
    // { expiresIn: '1800s' }
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY);
    return token;
};

const User = mongoose.model("user", userSchema);

const validate = (user) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
    });
    return schema.validate(user);
};

module.exports = { User, validate };