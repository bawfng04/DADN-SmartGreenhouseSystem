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

// vercel --prod

const app = express();

app.use(express.json());

const corsOptions = {
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));

// use routes
app.use("/api", exampleRoute);
app.use("/api", registerRoute);
app.use("/api", loginRoute);
app.use("/api", changePassword);
app.use("/api", adafruitRoute);

app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
