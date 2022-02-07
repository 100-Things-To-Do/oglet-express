const mongoose = require("mongoose");
const { Client } = require('pg');

module.exports = async () => {
    if (global.DB_TYPE === 'mongodb') {
        try {
            const connectionParams = {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
            };
            await mongoose.connect(global.MONGO_DB_STRING, connectionParams);
            console.log("connected to database.");
        } catch (error) {
            console.log("could not connect to database", error);
        }
    } else if (global.DB_TYPE === 'postgresql') {
        global.client = new Client({
            user: global.PQ_USERNAME,
            host: global.PQ_HOSTNAME,
            database: global.PQ_DATABASE,
            password: global.PQ_PASSWORD,
            port: Number(global.PQ_PORT),
        });
        await client.connect();
    }


};