import { app } from "./app";
import logger from "./config/logger";


app.listen(process.env.PORT, () => {
  logger.info(`Server running on port ${process.env.PORT}`);
});


app.get("/", (req, res) => {
  res.send("Backend Service is running!");
});