import { Router, type IRouter } from "express";
import healthRouter from "./health";
import aiRouter from "./ai";
import miarRouter from "./miar";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/ai", aiRouter);
router.use("/miar", miarRouter);

export default router;
