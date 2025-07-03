const express = require("express");
const app = express();
const path = require("path");

const ROUTE = 5050;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../", "public")));

const patientsRoutes = require("./routes/patients");
const appointmentsRoutes = require("./routes/appointments");

app.use("/api/patients", patientsRoutes);
app.use("/api/appointments", appointmentsRoutes);

app.use("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "views", "main.html"));
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "not-found.html"));
});
app.listen(ROUTE, () => {
  console.log("server running port:", ROUTE);
});
