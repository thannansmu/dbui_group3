//docker start mysql-container
//docker exec -it mysql-container bash
//mysql --user=root --password

const cors = require("cors");
const express = require("express");
const userRoutes = require("./routes/user");
const sessionRoutes = require("./routes/session");
const registerRoutes = require("./routes/register");
const requestRoutes = require("./routes/request");
const algorithmRoutes = require("./routes/algorithm");
const roommateRoutes = require("./routes/roommate");
const { createModelsMiddleware } = require("./middleware/model-middleware");
const { authenticateJWT } = require("./middleware/auth");
const app = express();
const port = 8000;
app.use(createModelsMiddleware);
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.get("/health", (request, response, next) => {
  const responseBody = { status: "up", port };
  response.json(responseBody);
  // next() is how we tell express to continue through the middleware chain
  next();
});
app.use("/session", sessionRoutes);
app.use("/user", authenticateJWT, userRoutes);
app.use("/request", authenticateJWT, requestRoutes);
app.use("/register", registerRoutes);
app.use("/algorithm", algorithmRoutes);
app.use("/roommate", authenticateJWT,roommateRoutes);
app.listen(port, () => {
  console.log(`This app is listening on port  ${port}`);
});
