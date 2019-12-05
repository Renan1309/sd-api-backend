const app = require('./app')

app.listen(process.env.PORT || 7000, function(){
    console.log('Servidor rodando na porta 7000.');
  });