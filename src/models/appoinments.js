const pool = require("../config/db");

class Appointment {
  constructor({
    id,
    patient_id,
    doctor_name,
    appointment_date,
    status,
    created_at,
    updated_at,
  }) {
    this.id = id;
    this.patient_id = patient_id;
    this.doctor_name = doctor_name;
    this.appointment_date = appointment_date;
    this.status = status;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  static validate(data) {
    const errors = [];

    if (!data.patient_id) errors.push("Bemor IDsi kiritilmagan");

    if (!data.doctor_name || data.doctor_name.trim().length < 3)
      errors.push("Doctor nomi noto‘g‘ri yoki juda qisqa");

    if (!data.appointment_date || isNaN(Date.parse(data.appointment_date)))
      errors.push("Uchrashuv sanasi noto‘g‘ri yoki mavjud emas");

    if (!["scheduled", "completed", "canceled"].includes(data.status))
      errors.push("Status noto‘g‘ri kiritilgan");

    return errors;
  }

  static async checkPatientExists(patient_id) {
    const result = await pool.query("SELECT 1 FROM patients WHERE id = $1", [
      patient_id,
    ]);
    return result.rows.length > 0;
  }

  static async getAll() {
    const result = await pool.query(
      "SELECT * FROM appointments ORDER BY appointment_date ASC"
    );
    return result.rows.map((row) => new Appointment(row));
  }

  static async getById(id) {
    const result = await pool.query(
      "SELECT * FROM appointments WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) return null;
    return new Appointment(result.rows[0]);
  }

  static async create(data) {
    const errors = Appointment.validate(data);
    if (errors.length) {
      throw { validationErrors: errors };
    }
    const patientExists = await Appointment.checkPatientExists(data.patient_id);
    if (!patientExists) {
      throw { validationErrors: ["Bunday bemor mavjud emas"] };
    }

    const result = await pool.query(
      `INSERT INTO appointments (patient_id, doctor_name, appointment_date, status)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [data.patient_id, data.doctor_name, data.appointment_date, data.status]
    );
    return new Appointment(result.rows[0]);
  }

  async update(data) {
    const updatedData = { ...this, ...data };
    const errors = Appointment.validate(updatedData);
    if (errors.length) {
      throw { validationErrors: errors };
    }
    const patientExists = await Appointment.checkPatientExists(
      updatedData.patient_id
    );
    if (!patientExists) {
      throw { validationErrors: ["Bunday bemor mavjud emas"] };
    }

    const result = await pool.query(
      `UPDATE appointments SET
         patient_id = $1,
         doctor_name = $2,
         appointment_date = $3,
         status = $4,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 RETURNING *`,
      [
        updatedData.patient_id,
        updatedData.doctor_name,
        updatedData.appointment_date,
        updatedData.status,
        this.id,
      ]
    );

    Object.assign(this, result.rows[0]);
    return this;
  }

  async delete() {
    const result = await pool.query(
      "DELETE FROM appointments WHERE id = $1 RETURNING *",
      [this.id]
    );
    if (result.rows.length === 0) {
      throw new Error("Uchrashuv topilmadi");
    }
    return true;
  }

  static async getByDateRange(from, to) {
    const result = await pool.query(
      `SELECT * FROM appointments 
       WHERE appointment_date BETWEEN $1 AND $2
       ORDER BY appointment_date ASC`,
      [from, to]
    );
    return result.rows.map((row) => new Appointment(row));
  }

  static async getByDoctor(doctor) {
    const result = await pool.query(
      `SELECT * FROM appointments WHERE doctor_name = $1`,
      [doctor]
    );
    return result.rows.map((row) => new Appointment(row));
  }
}

module.exports = Appointment;
