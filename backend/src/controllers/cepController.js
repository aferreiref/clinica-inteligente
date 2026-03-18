import axios from "axios";

export const getAddressByCep = async (req, res) => {

  const { cep } = req.params;

  try {

    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

    res.json(response.data);

  } catch (error) {

    res.status(500).json({ error: "Erro ao buscar CEP" });

  }

};