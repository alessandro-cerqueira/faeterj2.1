const seo = require("./src/seo.json");
var servidor = null
module.exports = {
  configurar: async(srv) => {
    // Guardando o servidor fastify
    servidor = srv;
    
    // Apresenta o formulário caso o path seja / e requisição via get
    servidor.get("/", module.exports.apresentarFormLogin);

    // Apresenta o resultado da votação caso o path seja / e a requisição seja post
    servidor.post("/", module.exports.processarLogin);
  },
  
  apresentarFormLogin: async (request, reply) => {
    let params = { seo: seo };

    // Se a requisição veio com o parâmetro 'raw', devolvo o JSON com o conteúdo dos votos.
    // Se não, solicito a renderização da página index.hbs
    reply.view("/src/pages/login.hbs", params);
  },

  processarLogin: async (request, reply) => {
    // Se a requisição NÃO veio com o parâmetro 'raw', vamos repassar o objeto SEO
    // (Search Engine Optimization) que coloca dados nas tags META do arquivo hbs
    let params = { seo: seo };

    // Recuperando os dados enviados pelo form da página login.hbs
    let conta = request.body.conta;
    let senha = request.body.senha;
    
    // Verificando conta e senha
    if(conta == null || conta.length == 0)
      params.error = "A conta não pode ser nula!";
    else if(conta.length > 15)    
      params.error = "Conta Inválida!";
    else if(senha == null || senha.length == 0)    
      params.error = "A senha não pode ser nula!";
    else if(senha !== "paracambi") // A senha deve ser "paracambi"    
      params.error = "Senha Inválida";

    // Se algum erro foi definido, mando de novo para a página com o formulário
    if(params.error != null) {
      reply.view("/src/pages/login.hbs", params);
      return;
    }
    
    
    let agora = Date.now();
    
    servidor.usuariosAtivos[agora] = { conta: conta, ultimaChamada : agora };
    
    reply.setCookie('conta', agora, {
      domain: 'exemplo-fastify-faeterj.glitch.me',
      path: '/',
      maxAge: 60 * 20, // 20 minutos
      secure: true,
      sameSite: 'lax',
      httpOnly: true
    });
    
    request.cookies.conta = agora;
    
    const ctrlProcessarVoto = require("./CtrlProcessarVoto.js");
    await ctrlProcessarVoto.apresentarFormulario(request,reply);
  }

  //---------------------------------------------------------------------//
};
