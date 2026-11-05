import { Router } from "express";
import { enrichController } from "../controllers/enrichController";

const enrichRouter = Router();

enrichRouter.post("/", enrichController);

export default enrichRouter;