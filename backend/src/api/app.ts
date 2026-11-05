import express from "express";
import cors from "cors";

import healthRouter from "./routes/healthRoutes";
import scrapeRouter from "./routes/scrapeRoutes";
import enrichRouter from "./routes/enrichRoutes";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
}));

app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/scrape", scrapeRouter);
app.use("/api/enrich", enrichRouter);

export default app;