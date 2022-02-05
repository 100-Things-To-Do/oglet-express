module.exports = {
    createDomain: `insert into domain(name, size)
    values ($1, $2)`
}