const { Notification } = require("../models/notification")

async function createNotification(myUser, notificationObj){
    notificationObj.owner = myUser._id
    const notification = new Notification(notificationObj)
    myUser.notifications.push(notification._id)
    myUser.save()
    notification.save()
    return notification;
}

async function getNotifications(myUser){
    const userNotifications = await Notification.find({owner: myUser._id}).populate("owner")
    return userNotifications; 
}

async function deleteNotification(notificationId, myUser){
    const notification = await Notification.findOne({_id: notificationId})
    if(!notification) throw new Error("notification not found");
    myUser.notifications.remove(notification._id)
    myUser.save()
    notification.delete()
    return "notification deleted!";
}

async function updateNotification(notificationId){
    const notification = await Notification.findOne({_id: notificationId})
    if(!notification) throw new Error("notification not found");
    notification.isRead = req.body.isRead
    notification.save()
    return "notification updated.";
}


module.exports = {
    createNotification,
    getNotifications,
    updateNotification,
    deleteNotification
}