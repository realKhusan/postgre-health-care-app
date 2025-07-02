const Appointment = require("../models/appointments");

// GET /api/appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.getAll();
    res.status(200).json(appointments);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Server xatosi: appointmentlarni olishda muammo bo‘ldi",
    });
  }
};

// POST /api/appointments/add
const addNewAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json(appointment);
  } catch (err) {
    if (err.validationErrors) {
      return res.status(400).json({ message: err.validationErrors });
    }
    console.error(err);
    res.status(500).json({
      message: "Server xatosi: uchrashuv qo‘shishda muammo bo‘ldi",
    });
  }
};

// PUT /api/appointments/edit/:id
const editAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.getById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Uchrashuv topilmadi" });
    }

    const updatedAppointment = await appointment.update(req.body);
    res.status(200).json(updatedAppointment);
  } catch (err) {
    if (err.validationErrors) {
      return res.status(400).json({ message: err.validationErrors });
    }
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/appointments/delete/:id
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.getById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Uchrashuv topilmadi" });
    }

    await appointment.delete();
    res.json({ message: "Muvaffaqiyatli o'chirildi" });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ message: "Server xatosi: uchrashuv o‘chirishda muammo" });
  }
};

// GET /api/appointments/by-date?from=YYYY-MM-DD&to=YYYY-MM-DD
const getAppointmentsByDateRange = async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      return res
        .status(400)
        .json({ message: "`from` va `to` parametrlari kerak" });
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res.status(400).json({ message: "Sana formati noto‘g‘ri" });
    }

    const appointments = await Appointment.getByDateRange(from, to);
    if (appointments.length === 0) {
      return res
        .status(404)
        .json({ message: "Bu oraliqda uchrashuv topilmadi" });
    }

    res.status(200).json(appointments);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Server xatosi: appointmentlarni olishda muammo bo‘ldi",
    });
  }
};

// GET /api/appointments/by-doctor/:doctor
const getAppointmentsByDoctor = async (req, res) => {
  try {
    const { doctor } = req.params;
    if (!doctor || doctor.trim().length < 3) {
      return res
        .status(400)
        .json({ message: "Shifokor nomi noto‘g‘ri yoki berilmagan" });
    }

    const appointments = await Appointment.getByDoctor(doctor);
    if (appointments.length === 0) {
      return res.status(404).json({
        message: `Bunday nomdagi shifokor bilan uchrashuv topilmadi: "${doctor}"`,
      });
    }

    res.status(200).json(appointments);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Server xatosi: appointmentlarni olishda muammo bo‘ldi",
    });
  }
};

module.exports = {
  getAllAppointments,
  addNewAppointment,
  editAppointment,
  deleteAppointment,
  getAppointmentsByDateRange,
  getAppointmentsByDoctor,
};
