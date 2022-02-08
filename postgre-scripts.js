module.exports = {
    createDomain: `insert into domain(name, size)
    values ($1, $2)`,
    createCard: `insert into card(domain_id, index, text, image)
    values ($1, $2, $3, $4)`,
    getDomains: `select * from domain`,
    getDomainCards: `select domain_id, index, text, image
    from card
    where card.domain_id=$1`,
    getDomain: `select * 
    from domain
    where id=$1`,
}