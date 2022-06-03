
const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: "./.data/votos.db",
    logging: false
  })

module.exports = sequelize;

const Linguagem = sequelize.define('Linguagem', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true},
    nome: {
      type: Sequelize.STRING,
      allowNull: false},
    numVotos: {
      type: Sequelize.INTEGER}
  },{
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false
  }
);
 
const Voto = sequelize.define('Voto', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true},
      idLinguagem: {
        type: Sequelize.INTEGER,
        references: {
          model: Linguagem,
          key: 'id'
        // ,
        //deferrable: Deferrable.INITIALLY_IMMEDIATE
        // Options:
        // - `Deferrable.INITIALLY_IMMEDIATE` - Immediately check the foreign key constraints
        // - `Deferrable.INITIALLY_DEFERRED` - Defer all foreign key constraint check to the end of a transaction
        // - `Deferrable.NOT` - Don't defer the checks at all (default) - This won't allow you to dynamically change the rule in a transaction
      }},
    hora: {
        type: Sequelize.STRING,
        allowNull: false}
  },{
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false
  }
);

(async () => {
    try {
        const resultado = await sequelize.sync();
        // const resultadoCreate = await Linguagem.create({
        //     nome: 'Prolog',
        //     numVotos: 0
        // });
        // console.log(resultadoCreate);
        const linguagens = await Linguagem.findAll();
    } catch (error) {
        console.log(error);
    }
})();