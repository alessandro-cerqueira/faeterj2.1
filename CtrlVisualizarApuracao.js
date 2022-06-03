const seo = require("./src/seo.json");
const data = require("./src/data.json");
const db = require("./src/" + data.database);

var servidor;

module.exports = {
  configurar: async(srv) => {
    servidor = srv;
    // Apresenta o resultado da votação caso o path seja / e a requisição seja post
    servidor.get("/resultado", module.exports.apresentarResultados);
  },
  apresentarResultados: async (request, reply) => {
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
    
    // Indicamos que queremos ver os resultados.
    params.verResultados = true;
    // Recuperando as linguagens do banco de dados.
    // Montamos uma lista com as linguagens e número de votos obtidos
    const linguagens = await db.obterLinguagens();
    if (linguagens) 
      params.linguagens = linguagens;
    // Se não obteve as linguagens, repassar a mensagem de erro.
    else params.error = data.msgErro;

    // Se a requisição veio com o parâmetro 'raw', devolvo o JSON com o conteúdo dos votos.
    // Se não, solicito a renderização da página index.hbs
    reply.view("/src/pages/index.hbs", params);
  },
};
