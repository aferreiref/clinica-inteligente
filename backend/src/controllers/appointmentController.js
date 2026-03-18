import Appointment from "../models/Appointment.js";

export const createAppointment = async (req, res) => {
  try {
    const { date, time, rainForecast } = req.body;

    const existingAppointment = await Appointment.findOne({ date, time });

    if (existingAppointment) {
      return res.status(400).json({ error: "Horário já agendado" });
    }

    const appointment = await Appointment.create({
      patientId: req.user.id,
      date,
      time,
      rainForecast,
      status: "agendada"
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar consulta" });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user.id });
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar consultas" });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("patientId", "name email");
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar todas as consultas" });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar status" });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Consulta excluída com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao excluir consulta" });
  }
};