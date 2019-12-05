const Pool = require('pg').Pool


function conectionDB(){
  return new Pool({
    user:'postgres',
    host: 'database-2.canjd3k93p3n.us-east-2.rds.amazonaws.com',
    database: 'Autenticacao',
    password: 'postgres',
    port: '5432',
  })
 
}

module.exports = 
 {conectionDB}
