const { Router } = require("express");
const router = Router();

const {
  addNewPatient,
  getAllPatients,
  deletePatient,
  editPatient,
  getInactivePatients,
} = require("../controllers/patients");

// @desc    Get all patients
router.get("/all/", getAllPatients);

// @desc    Add a new patient
router.post("/add/", addNewPatient);

// @desc    Edit a patient by ID
router.put("/edit/:id", editPatient);

// @desc    Delete a patient by ID
router.delete("/delete/:id", deletePatient);

// @desc    Get patients who haven't had any appointment recently
router.get("/without-appointments", getInactivePatients);

module.exports = router;
