const { clientQuery } = require('../helper');
const scripts = require('../postgre-scripts');

async function createDomain(name, size) {
    await clientQuery(scripts.createDomain, [name, size])
    return "domain created";
}

async function getDomains() {
    let result = await clientQuery(scripts.getDomains, []);
    return result && result.rows ? result.rows : [];
}

module.exports = {
    createDomain,
    getDomains
}