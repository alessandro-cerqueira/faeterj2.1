const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: "./.data/votos.db",
    logging: false
  })

class Linguagem extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      id: {
        type: Sequelize.INTEGER, 
        autoIncrement: true,
        allowNull: false,
        primaryKey: true},
      nome: {
        type: Sequelize.STRING, 
        allowNull: false},
        numVotos: {
          type: Sequelize.INTEGER,
          defaultValue: 0}
    },{
      freezeTableName: true,
      timestamps: false,
      createdAt: false,
      updatedAt: false
    });
  }
}

(async () => {
    try {
      const resultado = await sequelize.sync();
      const ling = new Linguagem({nome:'Pluribus'});
      console.log("LING=" + ling);
    } catch (error) {
        console.log(error);
    }
})();
