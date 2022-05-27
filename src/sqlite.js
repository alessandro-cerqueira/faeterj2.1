/**
 * Módulo para manipular o banco de dados SQLite da votação
 */

// Para acesso ao FileSystem
const fs = require("fs");

// Inicialização do Banco de Dados
const dbFile = "./.data/votos.db";
const dbExiste = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");
let db;

// Solicitando a abertura do Banco de Dados
sqlite.open({ filename: dbFile, driver: sqlite3.Database})
  .then(async dBase => {
    db = dBase;
    try {
      if (!dbExiste) {
        // Se o banco de dados não existe, ele será criado. Criando a tabela Voto
        await db.run(
          "CREATE TABLE Linguagem (id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR[20], numVotos INTEGER)"
        );

        // Adiciono quais são as linguagens da votação
        await db.run(
          "INSERT INTO Linguagem (nome, numVotos) VALUES ('Python', 0), ('JavaScript', 0), ('Java', 0), ('C#', 0)"
        );

        // Criando a tabela Voto
        await db.run(
          "CREATE TABLE Voto(id INTEGER PRIMARY KEY AUTOINCREMENT, hora STRING, idLinguagem INTEGER, FOREIGN KEY (idLinguagem) REFERENCES Linguagem(id))"
        );
      } else {
        // Se já temos um banco de dados, lista os votos processados
        console.log(await db.all("SELECT * from Linguagem"));
      }
    } catch (dbError) {
      console.error(dbError);
    }
  });

module.exports = {
// Funções disponibilizadas pela exportação
  //--- Retorna o resultado atual da votação ---//
  obterLinguagens: async () => {
    try {
      return await db.all("SELECT * from Linguagem");
    } catch (dbError) {
      console.error(dbError);
    }
  },

  //--- processar novo voto ---//
  processarVoto: async (votoLinguagem) => {
    try {
      // verificando se o voto é válido
      const resultado = await db.all("SELECT * from Linguagem WHERE id = ?", votoLinguagem);
      if (resultado.length > 0) {
        await db.run("INSERT INTO Voto (idLinguagem, hora) VALUES (?, ?)", 
                     [votoLinguagem, new Date().toISOString()]);
        await db.run(
          "UPDATE Linguagem SET numVotos = numVotos + 1 WHERE id = ?", votoLinguagem);
      }
      // Retorna o resultado atual da votação
      return await db.all("SELECT * from Linguagem");
    } catch (dbError) {
      console.error(dbError);
    }
  },

  //--- Retorna os últimos votos   ---//
  obterVotos: async () => {
    // Retorna os 30 votos mais recentes
    try {
      return await db.all("SELECT l.id, v.hora, v.idLinguagem, l.nome from Linguagem l INNER JOIN Voto v ON v.idLinguagem = l.id ORDER BY v.hora DESC LIMIT 30");
    } catch (dbError) {
      console.error(dbError);
    }
  },

  //--- Limpa e reset os votos ---//
  limparVotos: async () => {
    try {
      await db.run("DELETE FROM Voto");
      await db.run("DELETE FROM Linguagem");
      await db.run("INSERT INTO Linguagem (nome, numVotos) VALUES ('Python', 0), ('JavaScript', 0), ('Java', 0), ('C#', 0)");

      return [];
    } catch (dbError) {
      console.error(dbError);
    }
  },

  //--- Inclui uma nova linguagem na votação ---//
  incluirLinguagem: async (nome) => {
    try {
      await db.run("INSERT INTO Linguagem (nome, numVotos) VALUES (?, 0)", nome);
      return true;
    } catch (dbError) {
      console.error(dbError);
    }
  }, 
      
  //--- Inclui uma nova linguagem na votação ---//
  excluirLinguagem: async (nome) => {
    try {
      await db.run("DELETE FROM Linguagem WHERE nome = ?", nome);
      return true;
    } catch (dbError) {
      console.error(dbError);
    }
  }
}
