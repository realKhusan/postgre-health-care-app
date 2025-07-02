const { Router } = require("express");
const router = Router();

const {
  getAllAppointments,
  addNewAppointment,
  deleteAppointment,
  editAppointment,
  getAppointmentsByDateRange,
  getAppointmentsByDoctor,
} = require("../controllers/appointments");

// @desc    Get all appointments
router.get("/all/", getAllAppointments);

// @desc    Add a new appointment
router.post("/add/", addNewAppointment);

// @desc    Edit an appointment by ID
router.put("/edit/:id/", editAppointment);

// @desc    Delete an appointment by ID
router.delete("/delete/:id/", deleteAppointment);

// @desc    Get appointments in a specific date range
router.get("/by-date", getAppointmentsByDateRange);

// @desc    Get all appointments for a specific doctor
router.get("/by-doctor/:doctor", getAppointmentsByDoctor);

module.exports = router;
