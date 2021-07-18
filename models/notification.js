const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Joi = require("joi")

const notificationSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const Notification = mongoose.model("notification", notificationSchema);

const validateNotification = (notification) => {
    const schema = Joi.object({
        message: Joi.string().required()
    });
    return schema.validate(notification);
};


module.exports = { Notification, validateNotification };