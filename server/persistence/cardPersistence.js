const Sequelize = require('sequelize');
const Card = require('../models').cards;
const User = require('../models').users;
//variável que faz a associação da entidade usuário com o card, permitindo assim trazer nos resultados das buscas dos cards as informações do usuário associado a cada card
const userCard = {
    model: User,
    as: 'userCard'
};
//variável de instância da própria classe
let instance = null;

/**
 * Classe na qual são implementados os métodos que realizam a manipulação das informações da Entidade Card como cadastrar, consultar, consulta por campos, editar, remover e etc
 */
class CardPersistence {

    /**
     * Construtor padrão
     */
    constructor() {

        /**
         * Inicializa a variável global que armazenará a instância de um objeto da própria classe
         */
        if(instance === null) {

            instance = this;
        }
    }

    /**
     * Método utilizado para cadastrar um card na base de dados
     * @param card dados do card a ser cadastrado 
     * @param transaction instância da transação que tá controlando a operação
     * @returns retorna um objeto com as informações do card cadastrado
     */
    async createCard(card, transaction) {

        //cria o card na base de dados
        const newCard = await Card.create(card, transaction);
    
         //retorna o card criado
        return newCard;
    }

    /**
     * Método que realiza uma busca de todos os cards cadastrados
     * @param userId id do usuário associado aos cards, permitindo assim filtrar os cards por usuário, se o valor informado for "undefined", o filtro por usuário é ignorado
     * @param status status dos cards (TO-DO, DOING ou DONE)
     * @returns uma lista de cards cadastrados ou uma lista vazia caso não seja encontrado 
     */
    async searchCards(userId, status) {

        //variável que armazena as configurações da busca
        const query = {};
        //armazena o operador de busca que pode ser AND ou OR
        const Op = Sequelize.Op;
        
        //configura a busca definindo o limite de registros a ser buscado e o offset de busca (necessário por a busca utilizar paginação)
        query.subQuery = false;
        query.distinct = true;
        query.duplicating = false;
        //inclui na busca as informações do usuário associado aos cards enconttrados
        query.include = [userCard];
        
        //se o id do usuário foi informado
        if(userId) {
            //configura um filtro para que sejam retornados os cards apenas ao id do usuário informado
            query.where = {...query.where, userId: {
                [Op.and]: {[Op.eq]: userId}
            }};
        }
        //se o status do Card foi informado
        if(status && status !== 'Todos') {
            //monta um filtro para que sejam encontrados apenas os cards com base no status informado
            query.where = {...query.where, status: {
                [Op.and]: {[Op.eq]: status}
            }};
        }

        //faz a busca na base de dados com base nas configurações de busca realizadas
        const cardsCollection = await Card.findAll(query);
        
        //retorna uma lista com as informações dos cards
        return cardsCollection
    }

    /**
     * Método que realiza a busca de card por meio do seu id
     * @param cardId id do card a ser buscado 
     * @returns retorna as informações do card ou null caso não seja encontrado
     */
    async findCardById(cardId) {

        //realiza a busca do card por meio do seu id e inclui no resultado da busca as informações do usuário associado a esse card
        const cardCollection = await Card.findByPk(cardId, { include: [userCard] });

        //se encontrou retorna as informações da busca
        if(cardCollection) {

            return cardCollection;
        }
        
        //se não encontrou, retorna nulo
        return null;
    }

    /**
     * Método que realiza a busca de card por meio de um filtro com base em uma lista de chaves (nome dos campos) e valores a serem utilizados para filtrar
     * Exemplo: filtrar por titulo e status então teremos uma lista de chaves do tipo
     * [
     *    {"field": "title", "value": "xxxxxxxxxx" },
     *    {"field": "status", "value": "yyy"}
     * ]
     * @param parameters lista com os campos e os valores a serem utilizados como filtro 
     * @returns retorna as informações do card ou null caso não seja encontrado
     */
     async findCardByParameters(parameters) {

        //variável que armazena o filtro de busca utilizando a cláusula where
        const query = {where:{}};
        const Op = Sequelize.Op;

        //percorre a lista de parametros
        for(let i = 0; i < parameters.length; i++) {

            //obtém o parametro atual.
            const parameter = parameters[i];

            //monta a cláusula Where com o nome do campo e o valor a ser buscado, o operador utilizado é sempre o AND para combinar quando houver mais de uma condição
            query.where = {...query.where, [parameter.field]: {
                [Op.and]: {[Op.eq]: parameter.value}
            }};
        }

        //faz a busca de um único card com base no filtro montado e inclui no resultado da busca as informações do usuário associado a esse card
        const cardCollection = await Card.findOne(query, { include: [userCard] });
        
         //se encontrou retorna as informações da busca
         if(cardCollection) {

            return cardCollection;
        }
        
        //se não encontrou, retorna nulo
        return null;
    }

    /**
     * Método utilizado para alterar um card na base de dados
     * @param cardId id do card a ser atualizado
     * @param card dados do card a ser alterado 
     * @param transaction instância da transação que tá controlando a operação
     * @returns retorna um objeto com as informações do card alterado ou null se o card não foi encontrado
     */
    async updateCard(cardId, card, transaction) {

        //faz a busca do card com base no id para verificar se o mesmo existe na base de dados
        const cardCollection = await Card.findByPk(cardId, {include: [userCard]});

        //se encontrou
        if(cardCollection) {

            //atualiza as informações do card com base nos dados informados como parâmetro
            await cardCollection.update(card, transaction);

            //retorna o card com as informações atualizadas
            return cardCollection;
        }
        
        //se não encontrou retorna null
        return null;
    }

    /**
     * Método utilizado para remover um card na base de dados
     * @param cardId id do card a ser atualizado
     * @param transaction instância da transação que tá controlando a operação
     * @returns retorna um objeto com as informações do card removido ou null se o card não foi encontrado
     */
    async deleteCard(cardId, transaction) {

        //faz a busca do card com base no id para verificar se o mesmo existe na base de dados
        const cardCollection = await Card.findByPk(cardId);

        //se encontrou
        if(cardCollection) {

            //remove o cadastro do card na base de dados
            await cardCollection.destroy(transaction);

            //retorna o card removido
            return cardCollection;
        }
        
        //se não encontrou retorna null
        return null;
    }

     /**
     * Método que deleta todos os cards cadastrados na base de dados
     * @param transaction instância da transação que tá controlando a operação
     */
    async deleteAllCards(transaction) {

        //deleta todos os cards na base de dados
        await Card.destroy({
            where: {},
            truncate: false,
            transaction
        });
    }

    /**
     * Método que conta o total de cards cadastrados na base de dados
     * @returns total de cards cadastrados
     */
    async countCards() {

        //faz a busca utilizando a função de agregação count para contar o total de cards cadastrados
        const countCards = await Card.findAll({
            attributes: [
                [Sequelize.fn('count', Sequelize.col('cardId')), 'countCards']
            ]
        });

        //retorna o total de cards
        return countCards;
    }

    /**
     * Método que conta o total de cards cadastrados na base de dados agrupados por status
     * @param userId se o id do usuário for informado, faz o filtro com base no id do usuário, se não for informado, faz a contagem geral
     * @returns total de cards cadastrados
     */
    async countCardsByStatus(userId) {

        const Op = Sequelize.Op;
        //configura a busca utilizando a função de agregação count para contar o total de cards cadastrados e agrupando por status
        let query = {
            attributes: [
                'status', 
                [Sequelize.fn('count', Sequelize.col('cardId')), 'countCards']
            ],
            group: ['status'],
            order: Sequelize.literal('status DESC')
        };

        //se o id do usuário foi informado
        if(userId) {
            //configura um filtro para que sejam retornados os cards apenas ao id do usuário informado

            query.where = {...query.where, userId: {
                [Op.and]: {[Op.eq]: userId}
            }};
        }

        //executa a busca de contagem de cards com base na configuração realizada
        const countCards = await Card.findAll(query);

         //retorna o total de cards
        return countCards;
    }
}

//exporta uma instância já criada da classe para ser utilizada em outros arquivos
module.exports = new CardPersistence();