import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses } from "./middleware/log.js";
import { middlewareMetricsInc } from "./middleware/metrics.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get("/healthz", handlerReadiness);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
