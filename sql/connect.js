const Client  = require("mysql-pro");

let options = {
    host: 'localhost',
    port: '3306',
    user: 'root',
    database: 'bookstest',
    password: '123456',
}

const client = new Client({
    mysql:options
})

module.exports = client;