// controllers/topicController.js
import { Topic } from "../models/topicModel.js";
import { Link } from "../models/linkModel.js";

export const topicController = {
  index(req, res) {
    const topics = Topic.all();
    return res.render("index", { layout: "layout", topics });
  },

  
  show(req, res) {
    const topic = Topic.find(req.params.id);
    if (!topic) return res.status(404).send("Tema no encontrado");
    const links = Link.allByTopic(topic.id);
    return res.render("topics/show", { layout: "layout", topic, links });
  },

  create(req, res) {
    try {
      const { title, description } = req.body;
      Topic.create({ title, description });
      return res.redirect("/topics");
    } catch (e) {
      return res.status(400).send(e.message || "Error al crear");
    }
  },

  edit(req, res) {
    const topic = Topic.find(req.params.id);
    if (!topic) return res.status(404).send("Tema no encontrado");
    return res.render("topics/edit", { layout: "layout", topic });
  },

  update(req, res) {
    try {
      const { title, description } = req.body;
      const updated = Topic.update(req.params.id, { title, description });
      if (!updated) return res.status(404).send("Tema no encontrado");
      return res.redirect("/topics");
    } catch (e) {
      return res.status(400).send(e.message || "Error al actualizar");
    }
  },

  destroy(req, res) {
    Topic.destroy(req.params.id);
    return res.redirect("/topics");
  },

  upvote(req, res) {
    const t = Topic.upvote(req.params.id);
    if (!t) return res.status(404).send("Tema no encontrado");
  
    if (req.headers.accept?.includes("application/json")) return res.json({ id: t.id, votes: t.votes });
    return res.redirect("/topics");
  },

  downvote(req, res) {
    const t = Topic.downvote(req.params.id);
    if (!t) return res.status(404).send("Tema no encontrado");
    if (req.headers.accept?.includes("application/json")) return res.json({ id: t.id, votes: t.votes });
    return res.redirect("/topics");
  }
};
