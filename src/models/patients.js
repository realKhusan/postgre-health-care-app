const pool = require("../config/db");

class Patient {
  constructor({
    id,
    name,
    age,
    medical_history,
    phone,
    email,
    address,
    created_at,
    updated_at,
  }) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.medical_history = medical_history;
    this.phone = phone;
    this.email = email;
    this.address = address;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  static validate(data) {
    const errors = [];
    if (!data.name || data.name.length < 3)
      errors.push("Ism noto‘g‘ri yoki juda qisqa");
    if (!data.age || isNaN(data.age) || data.age <= 0)
      errors.push("Yosh noto‘g‘ri kiritilgan");
    if (!data.medical_history) errors.push("medicalHistory kiritilmagan");
    if (!data.phone || data.phone.length < 7)
      errors.push("Telefon raqam noto‘g‘ri");
    if (!data.email || !data.email.includes("@"))
      errors.push("Email noto‘g‘ri");
    if (!data.address || data.address.length < 5)
      errors.push("Manzil noto‘g‘ri yoki juda qisqa");
    return errors;
  }

  static async getAll() {
    const result = await pool.query("SELECT * FROM patients");
    return result.rows.map((row) => new Patient(row));
  }

  static async getById(id) {
    const result = await pool.query("SELECT * FROM patients WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) return null;
    return new Patient(result.rows[0]);
  }

  static async create(data) {
    const errors = Patient.validate(data);
    if (errors.length) {
      throw { validationErrors: errors };
    }
    const result = await pool.query(
      `INSERT INTO patients (name, age, medical_history, phone, email, address)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        data.name,
        data.age,
        data.medical_history,
        data.phone,
        data.email,
        data.address,
      ]
    );
    return new Patient(result.rows[0]);
  }

  async update(data) {
    const updatedData = { ...this, ...data };
    const errors = Patient.validate(updatedData);
    if (errors.length) {
      throw { validationErrors: errors };
    }
    const result = await pool.query(
      `UPDATE patients SET
         name = $1,
         age = $2,
         medical_history = $3,
         phone = $4,
         email = $5,
         address = $6
       WHERE id = $7 RETURNING *`,
      [
        updatedData.name,
        updatedData.age,
        updatedData.medical_history,
        updatedData.phone,
        updatedData.email,
        updatedData.address,
        this.id,
      ]
    );
    Object.assign(this, result.rows[0]);
    return this;
  }

  async delete() {
    const result = await pool.query(
      "DELETE FROM patients WHERE id = $1 RETURNING *",
      [this.id]
    );
    if (result.rows.length === 0) {
      throw new Error("Bemor topilmadi");
    }
    return true;
  }

  static async getInactive(months) {
    if (!months || isNaN(months) || Number(months) <= 0) {
      throw new Error("`months` parametri ijobiy son bo'lishi kerak");
    }

    const monthsAgo = new Date();
    monthsAgo.setMonth(monthsAgo.getMonth() - Number(months));

    const result = await pool.query(
      `SELECT * FROM patients WHERE id NOT IN (
         SELECT DISTINCT patient_id FROM appointments WHERE appointment_date >= $1
       )`,
      [monthsAgo]
    );
    return result.rows.map((row) => new Patient(row));
  }
}

module.exports = Patient;
