const Sequelize = require('sequelize');
const User = require('../models').users;

/**
 * Classe na qual são implementados os métodos que realizam a manipulação das informações da Entidade User como cadastrar, consultar, consulta por campos, editar, remover e etc
 */
class UserPersistence {

    /**
     * Método utilizado para cadastrar um usuário na base de dados
     * @param user dados do usuário a ser cadastrado 
     * @param transaction instância da transação que tá controlando a operação
     * @returns retorna um objeto com as informações do usuário cadastrado
     */
    async createUser(user, transaction) {

        //cria o usuário na base de dados
        const newUser = await User.create(user, transaction);

        //retorna o usuário criado
        return newUser;
    }

    /**
     * Método que realiza uma busca utilizando paginação de todos os usuários cadastrados
     * @param parameter parâmetro de busca, se for vazio, traz todos os usuários
     * @param page página atual
     * @param size tamanho de registros por página
     * @returns uma lista de usuários cadastrados ou uma lista vazia caso não seja encontrado 
     */
    async searchUsers(parameter, page, size) {

        //calcula o range dos registros a serem buscados com base na página atual e tamanho de registros por página
        const { limit, offset } = getPagination(page - 1, size);
        //variável que armazena as configurações da busca
        const query = {};
        //armazena o operador de busca que pode ser AND ou OR
        const Op = Sequelize.Op;
        
        //se o parâmetro de busca for informado
        if(parameter) {
            
            //monta a cláusula de busca where invocando a função getQueryFilter passando a lista de colunas a serem utilizadas no filtro e o parâmetro
            const searchFilter = getQueryFilter(columns, parameter);
            
            //configura a cláusula where
            query.where = {...query.where, [Op.and]: searchFilter.where};
        }

        //configura a busca definindo o limite de registros a ser buscado e o offset de busca (necessário por a busca utilizar paginação)
        query.limit = limit;
        query.offset = offset;
        query.subQuery = false;
        query.distinct = true;
        //configura que os resultados serão ordenados pelos nomes dos usuários
        query.order = [['name', 'ASC']];
        //configura que para cada usuário encontrado, retorna junto o total de cards que cada usuário criou
        query.attributes = Object.keys(User.rawAttributes).concat([
            [Sequelize.literal('(SELECT COUNT(cards.cardId) FROM cards WHERE users.userId = cards.userId)'), 'cardsCount']
        ]);

        //faz a busca na base de dados com base nas configurações de busca realizadas
        const usersCollection = await User.findAndCountAll(query);
        
        //retorna uma lista com as informações dos usuários junto com as informações da paginação como número da página atual, registros encontrados e etc
        return getPagingData(usersCollection, page, limit);
    }

    /**
     * Método que realiza a busca de usuário por meio do seu id
     * @param userId id do usuário a ser buscado 
     * @returns retorna as informações do usuário ou null caso não seja encontrado
     */
    async findUserById(userId) {

        //realiza a busca do usuário por meio do seu id
        const userCollection = await User.findByPk(userId);

        //se encontrou retorna as informações da busca
        if(userCollection) {

            return userCollection;
        }
        
        //se não encontrou, retorna nulo
        return null;
    }

    /**
     * Método que realiza a busca de usuário por meio de um filtro com base em uma lista de chaves (nome dos campos) e valores a serem utilizados para filtrar
     * Exemplo: filtrar por login e senha então teremos uma lista de chaves do tipo
     * [
     *    {"field": "mail", "value": "xxxxxxxxxx" },
     *    {"field": "password", "value": "yyy"}
     * ]
     * @param parameters lista com os campos e os valores a serem utilizados como filtro 
     * @returns retorna as informações do usuário ou null caso não seja encontrado
     */
    async findUserByParameters(parameters) {

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

        //faz a busca de um único usuário com base no filtro montado
        const userCollection = await User.findOne(query);
        
         //se encontrou retorna as informações da busca
         if(userCollection) {

            return userCollection;
        }
        
        //se não encontrou, retorna nulo
        return null;
    }

    /**
     * Método utilizado para alterar um usuário na base de dados
     * @param userId id do usuário a ser atualizado
     * @param user dados do usuário a ser alterado 
     * @param transaction instância da transação que tá controlando a operação
     * @returns retorna um objeto com as informações do usuário alterado ou null se o usuário não foi encontrado
     */
    async updateUser(userId, user, transaction) {
    
        //faz a busca do usuário com base no id para verificar se o mesmo existe na base de dados
        const userCollection = await User.findByPk(userId);

        //se encontrou
        if(userCollection) {

            //atualiza as informações do usuário com base nos dados informados como parâmetro
            await userCollection.update(user, transaction);

            //retorna o usuário com as informações atualizadas
            return userCollection;
        }
        
        //se não encontrou retorna null
        return null;
    }

    /**
     * Método utilizado para remover um usuário na base de dados
     * @param userId id do usuário a ser atualizado
     * @param transaction instância da transação que tá controlando a operação
     * @returns retorna um objeto com as informações do usuário removido ou null se o usuário não foi encontrado
     */
    async deleteUser(userId, transaction) {

         //faz a busca do usuário com base no id para verificar se o mesmo existe na base de dados
       const userCollection = await User.findByPk(userId, transaction);

        //se encontrou
        if(userCollection) {

            //remove o cadastro do usuário na base de dados
            await userCollection.destroy(transaction);

            //retorna o usuário removido
            return userCollection;
        }
        
        //se não encontrou retorna null
        return null;
    }

    /**
     * Método que deleta todos os usuários cadastrados na base de dados
     * @param transaction instância da transação que tá controlando a operação
     */
    async deleteAllUsers(transaction) {

        //deleta todos os usuários na base de dados
        await User.destroy({
            where: {},
            truncate: false,
            transaction
        });
    }

    /**
     * Método que conta o total de usuários cadastrados na base de dados
     * @returns total de usuários cadastrados
     */
    async countUsers() {

        //faz a busca utilizando a função de agregação count para contar o total de usuários cadastrados
        const countUsers = await User.findAll({
            attributes: [
                [Sequelize.fn('count', Sequelize.col('userId')), 'countUsers']
            ]
        });

        //retorna o total de usuários
        return countUsers;
    }
}

//exporta uma instância já criada da classe para ser utilizada em outros arquivos
module.exports = new UserPersistence();