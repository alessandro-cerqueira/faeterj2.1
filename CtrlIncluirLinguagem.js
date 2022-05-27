const seo = require("./src/seo.json");
const data = require("./src/data.json");
const db = require("./src/" + data.database);

const INICIAR_INCLUIR_LINGUAGEM = "/iniciarIncluirLinguagem";
const INCLUIR_LINGUAGEM = "/incluirLinguagem";
const OPERACAO = "Incluir";

var servidor;

module.exports = {
  configurar: async(srv) => {
    servidor = srv;
    
    // Apresenta o formulário caso o path seja / e requisição via get
    servidor.get(INICIAR_INCLUIR_LINGUAGEM, module.exports.apresentarFormulario);

    // Apresenta o resultado da votação caso o path seja / e a requisição seja post
    servidor.post(INCLUIR_LINGUAGEM, module.exports.incluir);
  },
  apresentarFormulario: async (request, reply) => {
    // Se a requisição NÃO veio com o parâmetro 'raw', vamos repassar o objeto SEO
    // (Search Engine Optimization) que coloca dados nas tags META do arquivo hbs
    let params = request.query.raw ? {} : { seo: seo };

    // Verificando se ocorreu a autenticação
    let conta = request.cookies.conta;
    if(conta == null || conta == undefined) {
      params.error = "Usuário não autenticado!";
      reply.view("/src/pages/login.hbs", params);
      return;
    }
    
    params.operacao = OPERACAO;
    params.funcao = INCLUIR_LINGUAGEM;
    
    // Se a requisição veio com o parâmetro 'raw', devolvo o JSON com o conteúdo dos votos.
    // Se não, solicito a renderização da página form.hbs
    request.query.raw
      ? reply.send(params)
      : reply.view("/src/pages/form.hbs", params);
  },
  
  incluir: async (request, reply) => {
    // Se a requisição NÃO veio com o parâmetro 'raw', vamos repassar o objeto SEO
    // (Search Engine Optimization) que coloca dados nas tags META do arquivo hbs
    let params = request.query.raw ? {} : { seo: seo };

    // Flag para indicar que queremos mostrar os resultados da votação ao invés do formulário de votação
    params.verResultados = true;
    let votos;

    // Se tivermos um voto, enviaremos para o DAO para processá-lo e para obtermos os resultados
    if (request.body.nome) 
      votos = await db.incluirLinguagem(request.body.nome);
    
    const ctrlProcessarVoto = require("./CtrlProcessarVoto.js");
    await ctrlProcessarVoto.apresentarFormulario(request,reply);
  },

  //---------------------------------------------------------------------//
};
