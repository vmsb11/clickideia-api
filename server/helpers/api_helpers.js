/**
 * Arquivo com funções utilitárias para criação da API
 */

const jwt = require('jsonwebtoken');
const { formatDatetime } = require('./date_helpers');

/**
 * Função que envia uma mensagem como resposta de uma requisição quando houver alguma falha
 * @param req objeto que contém as informações da requisição
 * @param req objeto que contém as informações da requisição
 * @param error tipo de erro que ocorreu 
 * @param res objeto que contém as informações da resposta da requisição
 */
async function sendErrorMessage(req, res, error, module, task, statusCode, errorType, errorMessage) {

    let name = '';
    let errors = '';
    let errorContent = '';
    let descriptor = '';

    if(error) {

        //obtém as informações do erro ocorrido
        name = error.name;
        errors = error.errors;
        
        let propertyNames = Object.getOwnPropertyNames(error);
    
        //percorre todas as propriedades do objeto que armazena as informações do erro
        for (let property, i = 0, len = propertyNames.length; i < len; ++i) {
            
            //obtém o conteúdo de cada propiedade
            property = propertyNames[i];
            descriptor = Object.getOwnPropertyDescriptor(error, property);
            errorContent += JSON.stringify(property) + '\n' + JSON.stringify(descriptor);
        }
    }
    
    //se o erro for violação da chave única da base de dados
    if(name === "SequelizeUniqueConstraintError") {

        //envia a mensagem com o código 409 (conflito de informações)
        res.status(409).send({
            code: 409,
            type: 'warning',
            message: errors[0].message,
            date: formatDatetime(new Date()),
            errorDetail: errorContent
        });    
    }
    //se for um erro ocasionado por outro motivo
    else {
        
        //envia a resposta o código de erro ocorrido junto com a mensagem detalhada do erro
        res.status(statusCode).send({
            code: statusCode,
            type: errorType,
            message: errorMessage,
            date: formatDatetime(new Date()),
            errorDetail: errorContent
        });
    }
}

/**
 * Função que funciona como middleware verificando o token a cada requisição realizada
 * @param req objeto que contém as informações da requisição
 * @param req objeto que contém as informações da requisição
 */
function verifyJWTToken(req, res, next){

    //obtém o token informado na requisição
    const token = (req.headers.authorization) ? req.headers.authorization.split(" ")[1] : '';
    
    //se não for um token válido, já bloqueia o acesso
    if (!token) {
        
        return res.status(401).json({ auth: false, message: 'Acesso não autorizado.' });
    }
    
    //verifica se o token é válido
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      
        if(err) {
        
            //se for inválido, envia uma resposta informando o erro
            return res.status(500).json({ auth: false, message: 'Falha ao validar o token.' });
        }
      
        // se tudo estiver ok, salva no request para uso posterior
        req.userId = decoded.id;
        //passa para o próximo middleware
        next();
    });
}

module.exports = { 
    sendErrorMessage,
    verifyJWTToken
};