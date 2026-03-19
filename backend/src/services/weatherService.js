const axios = require('axios')

async function getWeatherForecast(city) {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY

    if (!apiKey) {
      throw new Error('API KEY do OpenWeather não configurada')
    }

    const response = await axios.get(
      'https://api.openweathermap.org/data/2.5/forecast',
      {
        params: {
          q: city,
          appid: apiKey,
          units: 'metric',
          lang: 'pt_br'
        }
      }
    )

    return response.data
  } catch (error) {
    console.error('Erro ao buscar previsão do tempo:', error.message)
    return { list: [] }
  }
}

module.exports = {
  getWeatherForecast
}