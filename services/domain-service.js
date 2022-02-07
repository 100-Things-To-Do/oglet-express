const { clientQuery } = require('../helper');
const scripts = require('../postgre-scripts');

async function createDomain(name, size) {
    await clientQuery(scripts.createDomain, [name, size])
    return "domain created";
}

async function getDomains() {
    return "it worked";
}

module.exports = {
    createDomain,
    getDomains
}