# Testes em NodeJS Lambdas + Layer

![](https://github.com/rappanui/nodejs-lambda-unit-tests/blob/master/images/proxyquire.jpg)
---
## Indíce de conteúdo  

1. [Introdução](#markdown-1-header-introducao)
2. [Instalação](#markdown-2-header-instalacao)
3. [Testes Unitarios](#markdown-3-header-testes-unitarios)
   - [Serverless Mocha Plugin](#markdown-header-serverless-mocha-plugin)
   - [Proxyquire](#markdown-header-proxyquire)
     - [Stub via objeto mock](#markdown-header-objeto-mock)
     - [Stub via classe mock](#markdown-header-classe-mock)

---

# **1. Introdução**
Este projeto contém uma stack em [Serverless Framework](https://www.serverless.com/), com AWS Lambda Functions utilizando Lambda Layers e possui testes unitários feitos com [Serverless Mocha Plugin](https://www.serverless.com/plugins/serverless-mocha-plugin/) e [Proxyquire](https://www.npmjs.com/package/proxyquire) para realizar os stubs das layers.
Esse projeto foi criado com o objetivo de servir como base para um [artigo no Medium](https://rpsilva.medium.com/como-desenvolver-testes-em-aws-lambda-com-layers-em-node-js-7a14796b2cbc)
que ensina como criar testes unitários para Lambda Functions que utilizam lambda layers, e também expõe um endpoint ``[GET] /cep/{cep}`` atraves do AWS API Gateway que dá start em uma lambda que, através de um CEP, busca os dados do endereço e os retorna juntamente de dados do usuário ou sistema que fez a requisição. 

# Instalação
Para a instalação e utilização desse projeto é necessário que você tenha instalado em sua maquina NodeJS, [Serverless Framework](https://www.serverless.com/framework/docs/). Também é necessário que você possua uma conta valida na AWS, e assim configure as suas variaveis de ambiente para que os recursos possam ser criados a partir de comandos do Serverless Framework.

Com esses recursos instalados basta fazer clone desse projeto e rodar um comando para que as dependências sejam baixadas.
```
npm install
```

*Obs.: a lambda contida nesse projeto faz uso de lambda layers que não são de uso público, não podendo ser utilizadas diretamente ao clonar o projeto. Será necessário que você possua sua propria lambda layer do Axios e do Moment e troque a referência na configuração da lambda function.*
# Testes unitários
Nos testes desenvolvidos nesse projeto, tivemos como objetivo mostrar algumas abordagens de como é possível testar unitariamente as funções Lambdas que utilizam Lambda Layers. Para isso utilizamos algumas ferramentas.

## Serverless Mocha Plugin
Os testes unitários nesse projeto foram desenvolvidos utilizando o plugin [Serverless Mocha Plugin](https://www.serverless.com/plugins/serverless-mocha-plugin/), que disponibiliza a lib de testes [mochaJS](https://mochajs.com) em conjunto com o [chai](https://chaijs.com), bem como outros recursos ligados ao framework serverless.
## Proxyquire
O [proxyquire](https://www.npmjs.com/package/proxyquire) é a ferramenta que viabiliza que os testes sejam executados, pois sem ele a runtime não iria encontrar os módulos que fazem referência às layers, pois localmente elas não existem no projeto. Por isso o proxyquire traz formas de criar stubs onde em tempo de execução o fluxo ignore as layers e utilize os mocks que criamos na classe de teste. Para isso temos diferentes abordagens, e as utilizadas aqui foram via objeto de teste e via classe de teste.
### Stub via objeto mock
Na abordagem utilizada para criar o stub do modulo do axios, nós criamos um objeto, que de forma dinâmica pode conter função que irão ser utilizadas no fluxo, retornando um resultado mockado. Com essa abordagem, o comportamento das função é dinâmica, determinado pelas funções criadas no teste.
### Stub via classe mock
Essa abordagem foi utilizada nesse projeto para criar o stub do modulo do moment, pois não há necessidade de haver comportamento dinâmico, sendo sempre o mesmo retorno. Com isso também podemos ter aproveitamento de código para outras possíveis lambdas que farão uso da mesma layer.
                
----