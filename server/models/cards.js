
module.exports = (sequelize, DataType) => {

    /**
     * Configuração da entidade Card pelo Sequelize
     * Aqui são definidos os nomes dos campos da entidade e os seus respectivos tipos de dados
     */
    const Card = sequelize.define('cards', {
        cardId: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataType.INTEGER
        },
        title: {
            type: DataType.STRING
        },
        content: {
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

    /**
     * Como a entidade Cards possui uma chave estrangeira com o usuário, também é feita essa configuração e dada um nome para a mesma
     */
    Card.associate = function (models) {
        Card.belongsTo(models.users,{
            foreignKey : 'userId',
            as: 'userCard'
        });
    };

    return Card;
}