const express = require("express");
const app = express();
const path = require("path");

const ROUTE = 5050;

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../", "public")));

const patientsRoutes = require("./routes/patients");
const appointmentsRoutes = require("./routes/appointments");

app.use("/api/patients", patientsRoutes);
app.use("/api/appointments", appointmentsRoutes);

app.use((req, res) => {
  res.status(404).json({ title: "Not found", cssPath: "/styles/404.css" });
});
app.listen(ROUTE, () => {
  console.log("server running port:", ROUTE);
});
