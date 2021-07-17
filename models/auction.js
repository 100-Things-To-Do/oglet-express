const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const auctionSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    name: {
        type: String,
        required: true,
    },
    startingPrice: {
        type: Number,
        required: true,
    },
    closingPrice: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

const Auction = mongoose.model("auction", auctionSchema);

const validateAuction = (user) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        startingPrice: Joi.number().required(),
        closingPrice: Joi.number().required(),
    });
    return schema.validate(user);
};

module.exports = { Auction, validateAuction };