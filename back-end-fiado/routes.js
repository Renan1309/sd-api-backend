const { Router } = require('express'); //separar a parte de roteamento
var jwt = require('jsonwebtoken');
const  conection  = require('./config/database');
const pool = conection.conectionDB(); //pegando a conexão com o banco de dados




const routes = new Router();


///MIDDLEWARE PARA VERIFICAR TOKEN /////
routes.use(function(req, res , next){
  console.log('bateu no middleware');
  const authHeader = req.headers.authorization;

  console.log(authHeader);
  if (!authHeader){
      return res.status(401).json({error: 'Token not provided'})
  }

  const [ , token ] = authHeader.split(' ');
  console.log("tokenn"+token);

  jwt.verify(token, 'teste', function(err, decoded) {
      if (err) return res.status(401).send({ error: 'Token invalid' });
      // se tudo estiver ok, salva no request para uso posterior
      req.userIdempresa = decoded.id;
      req.emailempresa = decoded.emailempresa
      console.log(req.userId);
      return next();
    })

  
  })
///////////////MIDDLEWARE PARA VERIFICAR TOKEN ////////////////////////



//FALTA IMPLENTAR OS MIDLEWARES DE VERIFICAÇÃO DO TOKEN JWT


//ROTA PARA CADASTRAR EMPRESAS
routes.post('/cadastro',function(req, res){
  console.log(req.body.nome);
   pool.query(`INSERT INTO empresas(
              nome, email, senha)
              VALUES ( 
              '${req.body.nome}', '${req.body.email}', '${req.body.senha}');	`, 
    (error, ret) => {
     if (error) {
       return res.status(401).json('ERROR')
      }
       res.status(200).send(ret.rows[0]);
      })
   })


//RETORNA TODOS OS CLIENTE DE UMA EMPRESA ESPECÍFICA
routes.get('/clientes',function(req, res){
  let cnpj = req.userIdempresa;
  let emailempresa = req.emailempresa;
  console.log('Email da empresa ====>'+ emailempresa);
     pool.query(`select * from cliente where empresa_id = '${cnpj}'	`, 
     (error, ret) => {
        if (error) {
          return res.status(401).json('ERROR')
          }
          res.status(200).send(ret.rows);
       })
     })

//ROTA PARA CADASTRAR CLIENTES
routes.post('/cliente', function(req, res){
  pool.query(`INSERT INTO cliente(empresa_id, cliente_cpf, cliente_nome, cliente_email, cliente_password , cliente_telefone )
            VALUES ('${req.userIdempresa}', '${req.body.cpf}', '${req.body.nome}', 
            '${req.body.email}', '${req.body.senha}' , ${req.body.telefone}); `, (error, ret) => {
              if (error) {
                return res.status(401).json('ERROR')
              }
              res.status(200).send(ret.rows[0]);
            })
})

//ROTAS PARA LISTAR AS VENDAS DO CLIENTE PASSANDO O CPF QUE E SEU ID
   routes.get('/vendas',function(req, res){
    console.log(req.query.cpf);
    let cpf = req.query.cpf;
    pool.query(`select * from vendas where venda_id_cliente = '${cpf}'	`, 
    (error, ret) => {
      if (error) {
         return res.status(401).json('ERROR')
        }
       res.status(200).send(ret.rows);
      })
   })

//ROTA PARA INSERIR VENDAS
 routes.post('/venda', function(req, res){
  pool.query(`INSERT INTO vendas (venda_id_cliente, venda_data, venda_valor , empresa_id)
            VALUES ('${req.body.idusu}', '${req.body.date}', '${req.body.valor}' , '${req.userIdempresa}'); `, 
            (error, ret) => {
              if (error) {
                return res.status(401).json('ERROR')
              }
              res.status(200).send(ret.rows[0]);
            })
})

//ROTA PARA DELETAR AS VENDAS
routes.put('/deletarVenda',function(req, res){
  console.log(req.body.idvenda);
  console.log(req.body.cpf);
  let cpf = req.query.cpf;
  pool.query(`delete from vendas where venda_id = ${req.body.idvenda}	`, 
  (error, ret) => {
      if (error) {
        return res.status(401).json('ERROR')
       }
        res.status(200).send(ret.rows);
     })
 })

 //ROTA PARA DELETAR UM CLIENTE
 routes.put('/deletarCliente',function(req, res){
  let cpf = req.body.cpf;
  let cnpj = req.userIdempresa;
  console.log(cpf);
  pool.query(`delete from cliente where cliente_cpf = '${cpf}' and empresa_id = '${cnpj}'	`, 
  (error, ret) => {
      if (error) {
        return res.status(401).json('ERROR')
       }
        res.status(200).send(ret.rows);
     })
 })
 


module.exports = routes;
