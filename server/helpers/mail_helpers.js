/**
 * Arquivo com funções utilitárias para envio de emails, não utilizada por motivos de não ter um servidor de email configurado
 */
const nodemailer = require('nodemailer');
const MAIL_ACCOUNT = 'vmsb11@yahoo.com.br';
/**
 * Configura o servidor de email como host, porta, serviço e etc
 */
const mailAccount = nodemailer.createTransport({
    host: 'smtp.mail.yahoo.com',
    port: 465,
    service:'yahoo',
    secure: false,
    auth: {
        user: MAIL_ACCOUNT,
        pass: '' 
    }
});

/**
 * Função que envia um email
 * @param {*} to endereço do destinatário
 * @param {*} subject assunto da mensagem
 * @param {*} message conteúdo da mensagem
 * @returns true se o email foi enviado ou fase caso contrário
 */
async function sendMail(to, subject, message) {

    //monta e configura o email a ser enviado
    const mailMessage = {
        from: 'contato@clickideia.com.br',
        to: to,
        subject: subject,
        html: message
    };

    //realiza o envio do email
    return await mailAccount.sendMail(mailMessage);
}

/**
 * Função que monta o email a ser enviado ao usuário com a senha recuperada e faz o disparo do email
 * @param {*} name nome do usuário
 * @param {*} mail email do usuário
 * @param {*} login login do usuário
 * @param {*} password senha do usuário
 */
async function sendMailRecoveredPassToUser(name, mail, login, password) {

    let message = ``;
    //monta a mensagem a ser enviada
    message += `<p><center><b><h2>Click Ideia - Recuperação de senha</h2></b></center><p>`;
    message += `<p/></p>`;
    message += `<p>Olá ${name.split(" ")[0]}, estamos enviando para você a sua senha, caso não consiga fazer o login, entre em contato com o nosso suporte técnico.`;
    message += `<br/><br/>`;
    message += `<p><b>Login:</b> ${login}`;
    message += `<p><b>Senha:</b> ${password}`;
    message += `<br/><br/>`;
    message += `<p>Atenciosamente</p>`;
    message += `<p>Equipe Click Ideia</p>`;
    message += `<hr/>`;

    //faz o disparo do email
    await sendMail(mail, 'Envio de senha', message);
}

module.exports = { 
    sendMailRecoveredPassToUser
};