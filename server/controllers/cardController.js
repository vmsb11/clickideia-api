const { sequelize } = require('../models');
const CardPersistence = require('../persistence/cardPersistence');
//importa as funções implementas para serem utilizadas nas operações abaixo
const { sendErrorMessage } = require('../helpers/api_helpers');
const { formatDatabaseDatetime } = require('../helpers/date_helpers');

/**
 * Classe responsável por tratar as requisições (como cadastros, alterações, remoções, consultas e etc) da API relacionadas a entidade Card
 */
class CardController {

    /**
     * Método que implementa a requisição que cria um novo card na base de dados
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async createCard(req, res) {

        let transaction;

        try {
            
            /**
             * Cria uma transação, ela é importante pois se houver algum erro na operação, todas as manipulações feitas na base de dados são desfeitas
             */
            transaction = await sequelize.transaction();

            //cria um novo card na base de dados inserindo as informações recebidas no formato JSON através da requisição
            const newCard = await CardPersistence.createCard({
                cardId: req.body.cardId,
                userId: req.body.userId,
                title: req.body.title, 
                content: req.body.content,
                status: req.body.status, 
                createdAt: formatDatabaseDatetime(new Date()),
                updatedAt: formatDatabaseDatetime(new Date())
            }, { transaction });
            
            //comita na base de dados as operações realizadas
            await transaction.commit();
            //envia a resposta indicando que o cadastro foi realizado junto com as informações do card cadastrado
            res.status(201).send(newCard);
        }
        catch(error) {
            
            //se ocorreu algum erro
            if(transaction) {
                    
                //desfaz quaisquer operações realizadas na base de dados
                await transaction.rollback();
            }

            //envia uma resposta indicando o erro que ocorreu na operação de cadastro
            sendErrorMessage(req, res, error, 'CARDS', 'CADASTRO DE CARD', 500, 'error', 'Falha ao gerar o cadastro do card, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que busca cards na base de dados
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async searchCards(req, res) {

        try {
            //obtém através dos parâmetros da requisição os filtros a serem utilizados na busca
            const { userId } = req.query;
            //realiza a busca dos cards TO-DO na base de dados
            const toDoCardsCollection = await CardPersistence.searchCards(userId, 'TO-DO');
            //realiza a busca dos cards DOING na base de dados
            const doingCardsCollection = await CardPersistence.searchCards(userId, 'DOING');
            //realiza a busca dos cards DONE na base de dados
            const doneCardsCollection = await CardPersistence.searchCards(userId, 'DONE');
            //junta todos os tipos de cards que foram pesquisados
            const cardsCollection = { toDoCards: toDoCardsCollection, doingCards: doingCardsCollection, doneCards: doneCardsCollection };

            //envia como resposta os cards encontrados ou uma lista vazia
            res.status(200).send(cardsCollection);
        }
        catch(error) {
            
            //em caso de falha, envia uma mensagem de erro indicando a falha que ocorreu durante o processo de busca
            sendErrorMessage(req, res, error, 'CARDS', 'PESQUISA DE CARDS', 500, 'error', 'Falha ao pesquisar cards, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que busca um card por meio de seu id na base de dados
     * PS: requisição não utilizada na API (feita apenas para testes)
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async findCardById(req, res) {

        try {

            //busca o card na base de dados por meio do seu id recebido como parâmetro na requisição
            const cardCollection = await CardPersistence.findCardById(req.params.id);

            //se encontrou o card
            if(cardCollection) {

                //envia como resposta o card encontrado
                res.status(200).send(cardCollection);
            }
            else {

                //envia uma resposta indicando que o card não foi encontrado e o código 404
                sendErrorMessage(req, res, undefined, 'CARDS', 'PESQUISA DE CARD POR ID', 500, 'error', 'Card não encontrado');
            }
        }
        catch(error) {
            
            //em caso de falha, envia uma mensagem de erro indicando a falha que ocorreu durante o processo de busca
            sendErrorMessage(req, res, error, 'CARDS', 'PESQUISA DE CARD POR ID', 500, 'error', 'Falha ao pesquisar o card, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que atualiza o cadastro de um card na base de dados
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async updateCard(req, res) {

        let transaction;

        try {

            /**
             * Cria uma transação, ela é importante pois se houver algum erro na operação, todas as manipulações feitas na base de dados são desfeitas
             */
            transaction = await sequelize.transaction();

            //obtém via parâmetro o id do card a ser deletado
            const { id } = req.params;
            //atualiza as informações do card na base de dados atualizando as informações recebidas no formato JSON através da requisição
            const cardCollection = await CardPersistence.updateCard(id, {

                userId: req.body.userId,
                title: req.body.title, 
                content: req.body.content,
                status: req.body.status, 
                updatedAt: formatDatabaseDatetime(new Date())
            }, { transaction });

            //se o card de fato existe
            if(cardCollection) {
                
                //envia como resposta as informações do card que foi alterado
                res.status(200).send(cardCollection);
            }
            else {

                //envia uma resposta indicando que o card não foi encontrado e o código 404
                sendErrorMessage(req, res, undefined, 'CARDS', 'ALTERAÇÃO DE CARD', 404, 'warning', 'Card não encontrado');
            }

            //comita na base de dados as operações realizadas
            await transaction.commit();
        }
        catch(error) {
            
            //se ocorreu algum erro
            if(transaction) {
                
                //desfaz quaisquer operações realizadas na base de dados
                await transaction.rollback();
            }

            //em caso de falha envia uma mensagem indicando a falha ocorrida
            sendErrorMessage(req, res, error, 'CARDS', 'ALTERAÇÃO DE CARD', 500, 'error', 'Falha ao alterar o cadastro do card, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que delete um card na base de dados
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async deleteCard(req, res) {

        let transaction;

        try {

            /**
             * Cria uma transação, ela é importante pois se houver algum erro na operação, todas as manipulações feitas na base de dados são desfeitas
             */
            transaction = await sequelize.transaction();

            //obtém via parâmetro o id do card a ser deletado
            const { id } = req.params;
            //deleta o card na base de dados por meio de seu id
            const cardCollection = await CardPersistence.deleteCard(id, { transaction });

            //se o card realmente existe
            if(cardCollection) {

                //envia como resposta as informações do card deletado
                res.status(200).send(cardCollection);
            }
            //caso não tenha encontrado
            else {

                //envia uma resposta indicando que o card não foi encontrado e o código 404
                sendErrorMessage(req, res, undefined, 'CARDS', 'DELEÇÃO DE CARD', 404, 'warning', 'Card não encontrado');
            }

            //comita na base de dados as operações realizadas
            await transaction.commit();
        }
        catch(error) {
            
            //se ocorreu algum erro
            if(transaction) {
                
                //desfaz quaisquer operações realizadas na base de dados
                await transaction.rollback();
            }

            //envia uma resposta indicando a falha que ocorreu durante o processo de deleção
            sendErrorMessage(req, res, error, 'CARDS', 'DELEÇÃO DE CARD', 500, 'error', 'Falha ao deletar o cadastro do card, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que deleta todos os cards na base de dados
     * PS: requisição não utilizada na API (feita apenas para testes)
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async deleteAllCards(req, res) {

        let transaction;

        try {

            /**
             * Cria uma transação, ela é importante pois se houver algum erro na operação, todas as manipulações feitas na base de dados são desfeitas
             */
            transaction = await sequelize.transaction();
            
            //deleta todos os cards na base de dados
            await CardPersistence.deleteAllCards({ transaction });

            //comita na base de dados as operações realizadas
            await transaction.commit();
            res.status(200).send("Todos os cards foram deletados");
        }
        catch(error) {
            
            //se ocorreu algum erro
            if(transaction) {
                
                //desfaz quaisquer operações realizadas na base de dados
                await transaction.rollback();
            }

            //envia uma resposta indicando a falha que ocorreu durante o processo de deleção
            sendErrorMessage(req, res, error, 'CARDS', 'DELEÇÃO DE CARDS', 500, 'error', 'Falha ao deletar o cadastro de todos cards, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que cria um novo usuário na base de dados
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async countCards(req, res) {

        try {
            //obtém via parâmetro o id do usuário
            const { userId } = req.query;
            //realiza a contagem dos cards agrupando por status
            const countCards = await CardPersistence.countCardsByStatus(userId);
            /**
             * Vetor que armazena a contagem total de cards por status
             * posição 0 - total de cards To-Do
             * posição 2 - total de cards Doing
             * posição 1 - total de cards Done
             * posição 3 - total de cards geral
             */
            const cardsTotal = [0, 0, 0, 0];
            let sumCards = 0;

            //percorre os resultados da contagem
            for(let i = 0; i < countCards.length; i++) {

                //soma o total de geral cards por cada status
                sumCards += countCards[i].dataValues.countCards;
                //grava no vetor o total
                cardsTotal[i] = countCards[i].dataValues.countCards;
            }

            //armazena na última posição do vetor a contagem geral
            cardsTotal[3] = sumCards;

            //envia o total de cards
            res.send(cardsTotal);
        }
        catch(error) {

            sendErrorMessage(req, res, error, 'CARDS', 'CONTAGEM DE CARDS', 500, 'error', 'Falha ao obter os indicadores de cards, tente novamente mais tarde');
        }
    }
}

module.exports = new CardController();