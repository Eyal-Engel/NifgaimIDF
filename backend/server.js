const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const usersRoutes = require("./routes/usersRoutes");
const commandsRoutes = require("./routes/commandsRoutes");
const graveyardsRoutes = require("./routes/graveyardsRoutes");
const halalsRoutes = require("./routes/halalsRoutes");
const leftOversRoutes = require("./routes/leftOversRoutes");
const soldierAccompaniedRoutes = require("./routes/soldierAccompaniedRoutes");

const db = require("./dbConfig");
require("./models/relations");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
require("dotenv").config();
const helmet = require("helmet");

const app = express();

// security middlewares
app.use(cors());
app.use(helmet());

app.use(express.json());
app.use(bodyParser.json());

const port = process.env.PORT || 5000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.get("/", (req, res) => {
  res.send("Hello World From Mekalar!");
});

app.use("/api/users", usersRoutes);
app.use("/api/commands", commandsRoutes);
app.use("/api/graveyards", graveyardsRoutes);
app.use("/api/halals", halalsRoutes);
app.use("/api/leftOvers", leftOversRoutes);
app.use("/api/soldierAccompanied", soldierAccompaniedRoutes);

app.use("/api/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((error, req, res, next) => {
  //this function will execute if any middleware Infront of it yields an error
  if (res.headersSent) {
    //check if respond already has been sent
    return next(error);
  }

  //if code properties is set or default 500 => error code that something went wrong
  console.log(error.errors);

  return res.status(error.code || 500).json({
    body: error || "An unknown error occurred!",
  });
});
// Start the server
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  try {
    await db.authenticate();
    console.log(
      "Connection to the database has been established successfully."
    );

    // Sync all models
    await db.sync({ force: false });

    console.log("All models synchronized successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
