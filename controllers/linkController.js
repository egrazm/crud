import { Topic } from "../models/topicModel.js";
import { Link } from "../models/linkModel.js";

export const linkController = {
  create(req, res) {
    const { id: topicId } = req.params;
    const topic = Topic.find(topicId);
    if (!topic) return res.status(404).send("Tema no encontrado");

    try {
      const { title, url } = req.body;
      Link.create({ topicId, title, url });
      return res.redirect(`/topics/${topicId}`);
    } catch (e) {
      return res.status(400).send(e.message || "Error al crear link");
    }
  },

  destroy(req, res) {
    const { id: topicId, linkId } = req.params;
    Link.destroy(linkId);
    return res.redirect(`/topics/${topicId}`);
  },

  upvote(req, res) {
    const { id: topicId, linkId } = req.params;
    const link = Link.upvote(linkId);
    if (!link) return res.status(404).send("Link no encontrado");
    return res.redirect(`/topics/${topicId}#link-${linkId}`);
  },

  downvote(req, res) {
    const { id: topicId, linkId } = req.params;
    const link = Link.downvote(linkId);
    if (!link) return res.status(404).send("Link no encontrado");
    return res.redirect(`/topics/${topicId}#link-${linkId}`);
  }
};
