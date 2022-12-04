const jwt = require('jsonwebtoken');
const { sequelize } = require('../models');
const UserPersistence = require('../persistence/userPersistence');
//importa as funções implementas para serem utilizadas nas operações abaixo
const { sendErrorMessage } = require('../helpers/api_helpers');
const { formatDatabaseDatetime } = require('../helpers/date_helpers');
const { sendMailRecoveredPassToUser } = require('../helpers/mail_helpers');

/**
 * Classe responsável por tratar as requisições (como cadastros, alterações, remoções, consultas e etc) da API relacionadas a entidade User
 */
class UserController {

    /**
     * Método que implementa a requisição que cria um novo usuário na base de dados
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async createUser(req, res) {

        let transaction;

        try {

             /**
             * Cria uma transação, ela é importante pois se houver algum erro na operação, todas as manipulações feitas na base de dados são desfeitas
             */
            transaction = await sequelize.transaction();

            //cria um novo usuário na base de dados inserindo as informações recebidas no formato JSON através da requisição
            const newUser = await UserPersistence.createUser({
                name: req.body.name,
                mail: req.body.mail,
                login: req.body.login,
                password: req.body.password,
                status: 'Ativo',
                createdAt: formatDatabaseDatetime(new Date()),
                updatedAt: formatDatabaseDatetime(new Date())
            }, { transaction });

            //comita na base de dados as operações realizadas
            await transaction.commit();
            //envia a resposta indicando que o cadastro foi realizado junto com as informações do usuário cadastrado
            res.status(201).send(newUser);
        }
        catch(error) {
            
            //se ocorreu algum erro
            if(transaction) {
                
                //desfaz quaisquer operações realizadas na base de dados
                await transaction.rollback();
            }

            //envia uma resposta indicando o erro que ocorreu na operação de cadastro
            sendErrorMessage(req, res, error, 'USUÁRIOS', 'CADASTRO DE USUÁRIO', 500, 'error', 'Falha ao gerar o cadastro do usuário, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que busca os usuários na base de dados
     * PS: requisição não utilizada na API (feita apenas para testes)
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async searchUsers(req, res) {

        try {

            //obtém através dos parâmetros da requisição os filtros a serem utilizados na busca
            const { parameter, page, size } = req.query;
            //realiza a busca dos usuários na base de dados
            const usersCollection = await UserPersistence.searchUsers(parameter, page, size);
            
            //envia como resposta os usuários encontrados ou uma lista vazia
            res.status(200).send(usersCollection);
        }
        catch(error) {
            
            //em caso de falha, envia uma mensagem de erro indicando a falha que ocorreu durante o processo de busca
            sendErrorMessage(req, res, error, 'USUÁRIOS', 'PESQUISA DE USUÁRIOS', 500, 'error', 'Falha ao pesquisar usuários, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que busca um usuário por meio de seu id na base de dados
     * PS: requisição não utilizada na API (feita apenas para testes)
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async findUserById(req, res) {

        try {

            //busca o usuário na base de dados por meio do seu id recebido como parâmetro na requisição
            const userCollection = await UserPersistence.findUserById(req.params.id);

            //se encontrou o usuário
            if(userCollection) {

                //envia como resposta o usuario encontrado
                res.status(200).send(userCollection);
            }
            else {

                //envia uma resposta indicando que o usuário não foi encontrado e o código 404
                sendErrorMessage(req, res, undefined, 'USUÁRIOS', 'PESQUISA DE USUÁRIO POR ID', 404, 'warning', 'Usuário não encontrado');
            }
        }
        catch(error) {
            
            //em caso de falha, envia uma mensagem de erro indicando a falha que ocorreu durante o processo de busca
            sendErrorMessage(req, res, error, 'USUÁRIOS', 'PESQUISA DE USUÁRIO POR ID', 500, 'error', 'Falha ao pesquisar o usuário, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que atualiza o cadastro do usuário na base de dados
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async updateUser(req, res) {

        let transaction;

        try {

             /**
             * Cria uma transação, ela é importante pois se houver algum erro na operação, todas as manipulações feitas na base de dados são desfeitas
             */
            transaction = await sequelize.transaction();

            //obtém via parâmetro o id do usuário a ser atualizado
            const { id } = req.params;
            //atualiza as informações do usuário na base de dados atualizando as informações recebidas no formato JSON através da requisição
            const userCollection = await UserPersistence.updateUser(id, {
                name: req.body.name,
                mail: req.body.mail,
                login: req.body.login,
                password: req.body.password,
                updatedAt: formatDatabaseDatetime(new Date())
            }, { transaction });

            //se o usuário de fato existe
            if(userCollection) {
                
                //envia como resposta as informações do usuário que foi alterado
                res.status(200).send(userCollection);
            }
            else {

                //envia uma resposta indicando que o usuário não foi encontrado e o código 404
                sendErrorMessage(req, res, undefined, 'USUÁRIOS', 'ALTERAÇÃO DE USUÁRIO', 404, 'warning', 'Usuário não encontrado');
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
            sendErrorMessage(req, res, error, 'USUÁRIOS', 'ALTERAÇÃO DE USUÁRIO', 500, 'error', 'Falha ao alterar o cadastro do usuário, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que delete um usuário na base de dados
     * PS: requisição não utilizada na API (feita apenas para testes)
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async deleteUser(req, res) {

        let transaction;

        try {

             /**
             * Cria uma transação, ela é importante pois se houver algum erro na operação, todas as manipulações feitas na base de dados são desfeitas
             */
            transaction = await sequelize.transaction();

            //obtém via parâmetro o id do usuário a ser deletado
            const { id } = req.params;
            //deleta o usuário na base de dados por meio de seu id
            const userCollection = await UserPersistence.deleteUser(id, { transaction });

            //se o usuário realmente existe
            if(userCollection) {

                //envia como resposta as informações do usuário deletado
                res.status(200).send(userCollection);
            }
            //caso não tenha encontrado
            else {

                //envia uma resposta indicando que o usuário não foi encontrado e o código 404
                sendErrorMessage(req, res, undefined, 'USUÁRIOS', 'DELEÇÃO DE USUÁRIO', 404, 'warning', 'Usuário não encontrado');
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
            sendErrorMessage(req, res, error, 'USUÁRIOS', 'DELEÇÃO DE USUÁRIO', 500, 'error', 'Falha ao deletar o seu cadastro, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que deleta todos os usuários na base de dados
     * PS: requisição não utilizada na API (feita apenas para testes)
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async deleteAllUsers(req, res) {

        let transaction;

        try {

             /**
             * Cria uma transação, ela é importante pois se houver algum erro na operação, todas as manipulações feitas na base de dados são desfeitas
             */
            transaction = await sequelize.transaction();

            //deleta todos os usuários na base de dados
            await UserPersistence.deleteAllUsers({ transaction });
            //comita na base de dados as operações realizadas
            await transaction.commit();

            res.status(200).send("Todos os usuários foram deletados");
        }
        catch(error) {
            
            //se ocorreu algum erro
            if(transaction) {
                
                //desfaz quaisquer operações realizadas na base de dados
                await transaction.rollback();
            }

            //envia uma resposta indicando a falha que ocorreu durante o processo de deleção
            sendErrorMessage(req, res, error, 'USUÁRIOS', 'DELEÇÃO DE USUÁRIOS', 500, 'error', 'Falha ao deletar o cadastro de todos usuários, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que realiza a autenticação do usuário no sistema
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async authenticateUser(req, res) {

        try {

            //obtém os parâmetros email e senha recebidos através da requisição
            const { login, password } = req.body;
            //faz a busca do usuário por meio do email e senha informado
            const userCollection = await UserPersistence.findUserByParameters([
                { "field": "login", "value": login },
                { "field": "password", "value": password }
            ]);

            //se encontrou o usuário
            if(userCollection) {

                //verifica se está ativo, se estiver
                if(userCollection.status === 'Ativo') {
                
                    const { userId } = userCollection;
                    //gera o token de autorização
                    const token = jwt.sign({ userId }, process.env.SECRET, {
                        expiresIn: 300000
                    });
                      
                    //envia como resposta o usuário autenticado
                    res.status(200).send({ auth: true, token: token, user: userCollection });
                }
                else {

                    //se não estiver ativo, envia uma mensagem ao usuário informando
                    sendErrorMessage(req, res, undefined, 'USUÁRIOS', 'AUTENTICAÇÃO DE USUÁRIOS', 403, 'error', 'O seu cadastro está inativo, tente novamente mais tarde');
                }
            }
            else {

                //envia uma resposta indicando que o usuário não foi encontrado e o código 404
                sendErrorMessage(req, res, undefined, 'USUÁRIOS', 'AUTENTICAÇÃO DE USUÁRIOS', 404, 'warning', 'Login e/ou senha inválidos');
            }
        }
        catch(error) {
            
            //em caso de erro, envia uma resposta indicando a falha que ocorreu
            sendErrorMessage(req, res, error, 'USUÁRIOS', 'AUTENTICAÇÃO DE USUÁRIOS', 500, 'error', 'Falha ao realizar a sua autenticação, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que recupera a senha de um usuário cadastrado e a envia por email na base de dados
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async recoverUserPassword(req, res) {

        try {

            //obtém os parâmetros email e senha recebidos através da requisição
            const { mail } = req.body;
            //faz a busca do usuário por meio do email informado
            const userCollection = await UserPersistence.findUserByParameters([
                { field: "mail", value: mail }
            ]);

            //se encontrou o usuário
            if(userCollection) {

                //verifica se está ativo, se estiver
                if(userCollection.status === 'Ativo') {
                    
                    //obtém os dados do usuário
                    const { name, mail, password } = userCollection;
                    
                    //envia um email com o nome, email e senha para o usuário
                    await sendMailRecoveredPassToUser(name, mail, password);

                    //envia como resposta os dados do usuário que solicitou a recuperação de senha
                    res.status(200).send(userCollection);
                }
                else {

                    //se não estiver ativo, envia uma mensagem ao usuário informando
                    sendErrorMessage(req, res, undefined, 'USUÁRIOS', 'RECUPERAÇÃO DE SENHA DO USUÁRIO', 403, 'warning', 'O seu cadastro está inativo, contate nosso o suporte técnico');
                }
            }
            else {

                //envia uma resposta indicando que o usuário não foi encontrado e o código 404
                sendErrorMessage(req, res, undefined, 'USUÁRIOS', 'RECUPERAÇÃO DE SENHA DO USUÁRIO', 404, 'warning', 'Email não encontrado');
            }
        }
        catch(error) {

            console.log(error);
            //em caso de erro, envia uma resposta indicando a falha que ocorreu
            sendErrorMessage(req, res, error, 'USUÁRIOS', 'RECUPERAÇÃO DE SENHA DO USUÁRIO', 500, 'error', 'Falha ao processar a recuperação de senha, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que conta o total de usuários cadastrados na base de dados
     * PS: requisição não utilizada na API (feita apenas para testes)
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
     async countUsers(req, res) {

        try {

            //realiza a contagem dos usuários cadastrados
            const countUsers = await UserPersistence.countUsers();

            //envia como resposta o total dos usuários
            res.status(200).send(countUsers);
        }
        catch(error) {
            
            //em caso de erro, envia uma resposta indicando a falha que ocorreu
            sendErrorMessage(req, res, error, 'USUÁRIOS', 'CONTAGEM DE USUÁRIOS', 500, 'error', 'Falha ao processar a contagem de usuários, tente novamente mais tarde');
        }
    }
}

module.exports = new UserController();