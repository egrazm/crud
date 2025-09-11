// routes/topics.routes.js
import { Router } from "express";
import { topicController } from "../controllers/topicController.js";
import { linkController } from "../controllers/linkController.js";

const r = Router();

r.get("/", topicController.index);
r.post("/", topicController.create);

// ver tema + links
r.get("/:id", topicController.show);

r.get("/:id/edit", topicController.edit);
r.post("/:id/update", topicController.update);
r.post("/:id/delete", topicController.destroy);

// votos tema
r.post("/:id/upvote", topicController.upvote);
r.post("/:id/downvote", topicController.downvote);

// ----- Links (dentro de un tema) -----
r.post("/:id/links", linkController.create);                    // crear link
r.post("/:id/links/:linkId/delete", linkController.destroy);    // borrar link
r.post("/:id/links/:linkId/upvote", linkController.upvote);     // votar link +
r.post("/:id/links/:linkId/downvote", linkController.downvote); // votar link -

export default r;
