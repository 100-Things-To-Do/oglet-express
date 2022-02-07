module.exports = {
    createDomain: `insert into domain(name, size)
    values ($1, $2)`,
    createCard: `insert into card(domain_id, index, text, image)
    values ($1, $2, $3, $4)`
}