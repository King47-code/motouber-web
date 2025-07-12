const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host: 'metro.proxy.rlwy.net',
    port: 22310,
    user: 'postgres',
    password: 'TUfurKRAHzmpVtaEUrfkKKyRBaoFnlGJ',
    database: 'railway',
    ssl: { rejectUnauthorized: false }
  }
});

module.exports = db;
