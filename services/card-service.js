const { clientQuery } = require('../helper');
const scripts = require('../postgre-scripts');


async function createCard(domain_id, index, text, image) {
    await clientQuery(scripts.createCard, [domain_id, index, text, image])
    return "card created"
}

async function getDomainCards(domainId) {
    let domainSize = await clientQuery(scripts.getDomain, [domainId]);
    domainSize = domainSize && domainSize.rows && domainSize.rows[0] ? domainSize.rows[0].size : 0;
    let domainCards = await clientQuery(scripts.getDomainCards, [domainId]);
    domainCards = domainCards && domainCards.rows ? domainCards.rows : [];
    const result = [];
    for (let i = 0; i < domainSize; i++) {
        const filterResult = domainCards.filter(card => card.index == i);
        if (filterResult.length > 0) {
            result.push(filterResult[0]);
        } else {
            result.push(null);
        }
    }
    return result;
}


module.exports = {
    createCard,
    getDomainCards,
}