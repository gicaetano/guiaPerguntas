const Sequelize = require("sequelize");
const connection = require("./database");

const Pergunta = connection.define('perguntas',{ 
    titulo:{
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Pergunta.sync({force: false}) //Se no banco de dados não existe a tabela Pergunta, ele irá criar
    .then(() => {});   
    

module.exports = Pergunta;