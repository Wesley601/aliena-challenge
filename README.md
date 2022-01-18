## Descrição

Rest api feita em [Nest](https://github.com/nestjs/nest) framework.

## Requerimentos

```
Docker e docker-compose
node versão 16
npm versão 8
nest cli
```

## Instalação

```bash
$ npm install
$ cp .env.example .env
```
## Iniciar banco de dados

```
 No arquivo .env deve ser configurado as variáveis DB_DATABASE, DB_USERNAME e DB_PASSWORD antes de rodar o docker
```

## Rodando a aplicação

```bash
# iniciar o banco de dados
$ docker-compose up -d mysql

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Testes

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
