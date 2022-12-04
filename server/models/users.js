

module.exports = (sequelize, DataType) => {

    /**
     * Configuração da entidade User pelo Sequelize
     * Aqui são definidos os nomes dos campos da entidade e os seus respectivos tipos de dados
     * No caso de campos únicos como o email, já é configurada uma mensagem padrão de erro caso haja tentativa de inserir um valor duplicado
     */
    const User = sequelize.define('users', {
        userId: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataType.STRING
        },
        mail: {
            type: DataType.STRING,
            unique: {
                args: true,
                msg: 'Este email já está cadastrado'
            }
        },
        login: {
            type: DataType.STRING,
            unique: {
                args: true,
                msg: 'Este login já está cadastrado'
            }
        },
        password: {
            type: DataType.STRING
        },
        status: {
            type: DataType.STRING,
        },
        createdAt: {            
            type: DataType.STRING
        },
        updatedAt: {            
            type: DataType.STRING
        }
    }, {
            timestamps: false
        });

    return User;
}