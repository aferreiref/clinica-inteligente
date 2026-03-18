import express from "express";
import { getAddressByCep } from "../controllers/cepController.js";
import { getWeather } from "../controllers/weatherController.js";

const router = express.Router();

router.get("/cep/:cep", getAddressByCep);
router.get("/weather", getWeather);

export default router;
