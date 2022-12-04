/**
 * Arquivo com funções utilitárias para realizar o tratamento de datas
 */

/**
 * Função que converte uma data no formato string no formato de armazenamento para banco de dados
 * @param date data a ser convertida
 * @returns data convetida
 */
function formatDatabaseDatetime(date) {

    try {

        //cria um objeto data
        const newDate = new Date(date);
        //obtém de forma sepada dia, mes, ano, hora, minuto, segundo da data
        let day = "" + newDate.getDate();
        let month = "" + (newDate.getMonth() + 1);
        let year = "" + newDate.getFullYear();
        let hour = "" + newDate.getHours();
        let minute = "" + newDate.getMinutes();
        let second = "" + newDate.getSeconds();
        
        //formata o dia e hora
        if(day.length === 1) day = "0" + day;
        if(month.length === 1) month = "0" + month;
        if(hour.length === 1) hour = "0" + hour;
        if(minute.length === 1) minute = "0" + minute;
        if(second.length === 1) second = "0" + second;

        //formata a data para ser inserida na base de dados no formato yyyy-mm-dd hh:mm:ss
        return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    }
    catch(error) {

        return date;
    }
}

/**
 * Função que recebe um objeto data e a converte no formato brasileiro
 * @param date data a ser convertida
 * @returns data convertid
 */
function formatDatetime(date) {

    try {
        //cria um novo objeto data
        const newDate = new Date(date);
        //obtém de forma sepada dia, mes, ano, hora, minuto, segundo da data
        let day = "" + newDate.getDate();
        let month = "" + (newDate.getMonth() + 1);
        let year = "" + newDate.getFullYear();
        let hour = "" + newDate.getHours();
        let minute = "" + newDate.getMinutes();
        let second = "" + newDate.getSeconds();
        
        //formata o dia e hora
        if(day.length === 1) day = "0" + day;
        if(month.length === 1) month = "0" + month;
        if(hour.length === 1) hour = "0" + hour;
        if(minute.length === 1) minute = "0" + minute;
        if(second.length === 1) second = "0" + second;

        //formata a data no formato brasileiro dd/mm/yyyy hh:mm:ss
        return day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second;
    }
    catch(error) {

        return date;
    }
}

module.exports = { 
    formatDatabaseDatetime,
    formatDatetime
};