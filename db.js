const mongoose = require("mongoose");

module.exports = async () => {
    try {
        const connectionParams = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        };
        await mongoose.connect(global.DB_STRING, connectionParams);
        console.log("connected to database.");
    } catch (error) {
        console.log("could not connect to database", error);
    }
};