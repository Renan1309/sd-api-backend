const Pool = require('pg').Pool


function conectionDB(){
  return new Pool({
    user:'postgres',
    host: '',
    database: 'Autenticacao',
    password: 'postgres',
    port: '5432',
  })
 
}

module.exports = 
 {conectionDB}
