import { Router } from "express";
import topicRoutes from "./topics.routes.js";

const router = Router();

router.get("/", (_req, res) => res.redirect("/topics"));
router.use("/topics", topicRoutes);

export default router;
