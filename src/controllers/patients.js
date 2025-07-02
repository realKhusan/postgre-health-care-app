const Patient = require("../models/Patient");

// GET /api/patients/all
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.getAll();
    res.status(200).json(patients);
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ message: "Server xatosi: bemorlarni olishda muammo bo‘ldi" });
  }
};

// POST /api/patients/add
const addNewPatient = async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (e) {
    if (e.validationErrors) {
      return res.status(400).json({ errors: e.validationErrors });
    }
    console.error(e);
    res
      .status(500)
      .json({ message: "Server xatosi: bemorni qo‘shishda muammo bo‘ldi" });
  }
};

// PUT /api/patients/edit/:id
const editPatient = async (req, res) => {
  try {
    const patient = await Patient.getById(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Bemor topilmadi" });
    }

    const updatedPatient = await patient.update(req.body);
    res.status(200).json(updatedPatient);
  } catch (e) {
    if (e.validationErrors) {
      return res.status(400).json({ errors: e.validationErrors });
    }
    console.error("editPatient error:", e);
    res.status(500).json({ error: e.message });
  }
};

// DELETE /api/patients/delete/:id
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.getById(req.params.id);
    if (!patient) {
      return res
        .status(404)
        .json({ message: "Bunday ID bilan bemor topilmadi" });
    }
    await patient.delete();
    res.status(200).json({ message: "Bemor muvaffaqiyatli o'chirildi" });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ message: "Server xatosi: bemorni o‘chirishda muammo bo‘ldi" });
  }
};

// GET /api/patients/not-seen-since?months=6
const getInactivePatients = async (req, res) => {
  try {
    const { months } = req.query;
    const patients = await Patient.getInactive(months);
    if (patients.length === 0) {
      return res.status(404).json({
        message: `So'nggi ${months} oy ichida appointment qilmagan bemorlar topilmadi`,
      });
    }
    res.status(200).json(patients);
  } catch (e) {
    console.error(e);
    res.status(400).json({
      message:
        e.message || "Server xatosi: nofaol bemorlarni olishda muammo bo‘ldi",
    });
  }
};

module.exports = {
  getAllPatients,
  addNewPatient,
  editPatient,
  deletePatient,
  getInactivePatients,
};
