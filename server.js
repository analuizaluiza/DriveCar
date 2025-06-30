const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const { pool, connectDB } = require("./db/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const carRoutes = require("./routes/carRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", carRoutes);
app.use("/", bookingRoutes);


async function startServer() {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
}

startServer();