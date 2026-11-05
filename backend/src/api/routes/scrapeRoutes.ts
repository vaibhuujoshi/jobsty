import { Router } from "express";
import { scrapeController } from "../controllers/scrapeController";

const scrapeRouter = Router();

scrapeRouter.post("/", scrapeController);

export default scrapeRouter;