const { clientQuery } = require('../helper');
const scripts = require('../postgre-scripts');


async function createCard(domain_id, index, text, image) {
    await clientQuery(scripts.createCard, [domain_id, index, text, image])
    return "card created"
}


module.exports = {
    createCard
}