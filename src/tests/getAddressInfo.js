'use strict';
const mochaPlugin = require('serverless-mocha-plugin')
const { assert } = mochaPlugin.chai
const proxyquire = require('proxyquire').noCallThru()
const axiosLayerMock = {}
const momentLayerMock = require('../tests/layerMocks/momentLayerMock')
const handler = proxyquire('../functions/getAddressInfo/handler', {
  'axios': axiosLayerMock,
  'moment': momentLayerMock
})

describe('Test API: Get Address Info', () => {
  it('Test success', async function () {
    axiosLayerMock.get = () => { return { data: getAPIResponse() } }
    const event = getEvent()
    const result = await handler.getAddressInfo(event)
    
    console.log('Lambda test result: ', result)
    const body = JSON.parse(result.body)
    
    assert.equal(result.statusCode, 200)
    assert.equal(body.addressInfo.cep, '76872862')
    assert.equal(body.eventInfo.timestamp, '2021-01-01T00:00:00')
  })

  it('Test not found', async function () {
    axiosLayerMock.get = () => { return { data: { erro: true } } }
    const event = getEvent()
    event.pathParameters.cep = '00000000'
    const result = await handler.getAddressInfo(event)
    
    console.log('Lambda test result: ', result)
    
    assert.equal(result.statusCode, 404)
    assert.equal(result.body, 'There is no valid address info for the CEP 00000000!')
  })
})

function getAPIResponse() {
  return {
    bairro: "Setor Institucional",
    cep: "76872862",
    cidade: "Ariquemes",
    estado: "RO",
    logradouro: "Rio Madeira",
    tipodelogradouro: "Rua",
  }
}

function getEvent() {
  return {
    body: {},
    headers: {},
    pathParameters: { cep: '76872862' },
    queryStringParameters: {},
    path: '/cep/{cep}',
    requestContext: {
      identity: {
        sourceIp: '000.000.000',
        user: 'TEST'
      }
    }
  }
}
