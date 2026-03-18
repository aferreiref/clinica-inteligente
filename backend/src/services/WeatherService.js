const axios = require('axios')

async function getWeatherForecast(city) {
  const apiKey = process.env.OPENWEATHER_API_KEY

  const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
    params: {
      q: city,
      appid: apiKey,
      units: 'metric',
      lang: 'pt_br'
    }
  })

  return response.data
}

module.exports = {
  getWeatherForecast
}