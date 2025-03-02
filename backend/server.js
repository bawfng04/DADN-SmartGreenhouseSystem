require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 8000;

// import routes
const exampleRoute = require("./src/routes/examplesRoute");
const registerRoute = require("./src/routes/registerRoute");
const loginRoute = require("./src/routes/loginRoute");
const changePassword = require("./src/routes/changePasswordRoute");
const adafruitRoute = require("./src/routes/adafruitRoute");



const app = express();
// vercel --prod
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// use routes
app.use("/", exampleRoute);
app.use("/", registerRoute);
app.use("/", loginRoute);
app.use("/", changePassword);
app.use("/", adafruitRoute);

app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
