# clickideia-api

API criada em NodeJS

Para maiores informações, uma apresentação de slides com a descrição do desenvolvimento do projeto está disponível no repositório.

## Instalação

Clone o repositório e instale as dependências.

```bash
git clone https://github.com/vmsb11/clickideia-api.git
cd clickideia-api
npm install
```

## Configuração

Clone o repositório e instale as dependências.

```bash
git clone https://github.com/vmsb11/clickideia-api.git
cd clickideia-api
npm install
```


## Configuração do banco de dados

1) Importe o arquivo clickideia-vini.sql no banco de dados MySQL
2) Abra o arquivo diretorio_do_projeto/server/config/config.json
3) Informe nas propriedades username, host, database e password as informações do banco de dados importado (developement, test e production)
4) Salve o arquivo


## Execução

Para executar o projeto, execute o comando

```bash
nodemon
```

A API ficará sendo executado na porta 5000.

Observação: a aplicação frontend está acessando essa API por meio da URL http://localhost:5000/api, portanto a aplicação frontend e backend devem ser executadas na mesma máquina.
