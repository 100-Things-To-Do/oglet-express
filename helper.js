function postgresErrorHandler(error) {
    console.log("POSTGRES ERROR: ", error.detail, " - ", error.message);
    process.exit(1);
}

async function clientQuery(scriptName, params) {
    return await global.client.query(scriptName, params)
        .catch(e => {
            postgresErrorHandler(e);
        })
}

module.exports = {
    clientQuery
}
