'use strict'


// Para especificações de path 
const path = require("path");
 
// Para uso do Framework Fastify
const servidor = require("fastify")({
  logger: false //  Para visualizarmos o log do sistema
});

// Configurando o fastify para retornar os arquivos estáticos, como se fosse um servidor web simples
servidor.register(require("fastify-static"), {
  // Qual é a pasta que contém os arquivos estáticos
  root: path.join(__dirname, "public"),  
  // Prefixo para retornar os arquivos estáticos. 
  prefix: "/" 
});

// Configurando o Fastify para processar o input de dados vindos de formulários
servidor.register(require("fastify-formbody"));

// Configurando o Fastify para usar cookies
servidor.register(require('fastify-cookie'), {
  secret: "paracambi", // for cookies signature
  parseOptions: {}     // options for parsing cookies
});

const hbs = require("handlebars");
// Registrando o template manager Point-of-View
servidor.register(require("point-of-view"), {
  engine: {
    handlebars: hbs
  }
});

//
// Criando Helpers (TAGS) que possam ser utilizados nas páginas
//
let nomesHelpers = process.env.HELPERS.split(","); 
console.log(nomesHelpers);
for(let i = 0; i < nomesHelpers.length; i++) {
  let helper = require("./src/helpers/" + nomesHelpers[i] + ".js");
  helper.configurar(hbs);
}

//
// Carga dinâmica dos partials do meu sistema
//
const fs = require("fs");  
let nomesPartials = process.env.PARTIALS.split(","); 
console.log(nomesPartials);
for(let i = 0; i < nomesPartials.length; i++) {
  let nome = nomesPartials[i];
  hbs.registerPartial(nome, fs.readFileSync(path.join(__dirname, 'src', 'pages', nome+'.hbs'), 'utf8'));
}

//
// Carga dinâmica dos controladores de Caso de Uso (Injeção de Dependência)
//
let nomesCtrl = process.env.CONTROLADORES.split(","); 
console.log(nomesCtrl);
for(let i = 0; i < nomesCtrl.length; i++) {
  let ctrl = require("./" + nomesCtrl[i] + ".js");
  ctrl.configurar(servidor);
}

//
// Definindo os usuários ativos
//
servidor.usuariosAtivos = [];

//
// Colocando o servidor no ar  
//
servidor.listen(process.env.PORT, '0.0.0.0', function(err, address) {
  if (err) {
    servidor.log.error(err);
    process.exit(1);
  }
  console.log(`A aplicação está ouvindo em ${address}`);
  servidor.log.info('servidor ouvindo em ' + address);
});

//---------------------------------------------------------------------//

