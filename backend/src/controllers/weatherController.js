import axios from "axios";

export const getWeather = async (req, res) => {
  const { city } = req.query;

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric&lang=pt_br`
    );

    res.json(response.data);
  } catch (error) {
    console.error("Erro OpenWeather:", error.response?.data || error.message);
    res.status(500).json({ error: "Erro ao buscar clima" });
  }
};
