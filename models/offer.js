const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const offerSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    auction: {
        type: Schema.Types.ObjectId,
        ref: 'auction',
    },
    price: {
        type: Number,
        required: true,
    }
}, { timestamps: true });


const Offer = mongoose.model("offer", offerSchema);

const validateOffer = (offer) => {
    const schema = Joi.object({
        price: Joi.number().required()
    });
    return schema.validate(offer);
};


module.exports = { Offer, validateOffer };