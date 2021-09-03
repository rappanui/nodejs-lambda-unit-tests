'use strict'
const axios = require('axios')
const moment = require('moment')

module.exports.getAddressInfo = async (event) => {
  console.log(`Received event: ${JSON.stringify(event)}`)
  const { cep } = event.pathParameters
  try {
    const result = await getAddressInfoByCep(cep)
    if (!result.cep) {
      return { statusCode: 404, body: result }
    }

    const response = getResponse(event, result)
    console.log(`Lambda return data: ${JSON.stringify(response)}`)
    return { statusCode: 200, body: JSON.stringify(response) }
  } catch (error) {
    console.error(`An error occured executing lambda: ${JSON.stringify(error)}`)
    return { statusCode: 500, body: JSON.stringify(error) }
  }
}

async function getAddressInfoByCep(cep) {
  const url = `https://viacep.com.br/ws/${cep}/json/`
  try {
    console.log(`Getting data with the url: ${url}`)
    const result = await axios.get(url)
    console.log(`Data returned from Correios API: ${JSON.stringify(result.data)}`)
    
    if (result.data.erro) {
      const message = `There is no valid address info for the CEP ${cep}!`
      console.info(message)
      return message
    }

    return result.data
  } catch (error) {
    console.error(`Axios error trying to get address info: ${JSON.stringify(error)}`)
    throw error
  }
}

function getResponse(event, addressInfo) {
  return {
    addressInfo: addressInfo,
    eventInfo: {
      ip: event.requestContext.identity.sourceIp,
      timestamp: moment(),
      user: event.requestContext.identity.user
    }
  }
}