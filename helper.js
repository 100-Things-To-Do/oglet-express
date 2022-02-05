async function clientQuery(scriptName, params) {
    return await client.query(scriptName, params)
        .catch(e => {
            postgresErrorHandler(e);
        })
}