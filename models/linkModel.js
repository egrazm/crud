// models/linkModel.js
import db from "../db/sqlite.js";

const qAllByTopic = db.prepare(`
  SELECT id, topic_id, title, url, votes
  FROM links
  WHERE topic_id = ?
  ORDER BY votes DESC, id DESC
`);

const qFind = db.prepare(`
  SELECT id, topic_id, title, url, votes
  FROM links
  WHERE id = ?
`);

const qInsert = db.prepare(`
  INSERT INTO links (topic_id, title, url) VALUES (?, ?, ?)
`);

const qDelete = db.prepare(`DELETE FROM links WHERE id = ?`);

const qUpvote = db.prepare(`
  UPDATE links
  SET votes = votes + 1
  WHERE id = ?
  RETURNING id, topic_id, title, url, votes
`);

const qDownvote = db.prepare(`
  UPDATE links
  SET votes = votes - 1
  WHERE id = ?
  RETURNING id, topic_id, title, url, votes
`);

export const Link = {
  allByTopic(topicId) {
    return qAllByTopic.all(Number(topicId));
  },
  find(id) {
    return qFind.get(Number(id)) || null;
  },
  create({ topicId, title, url }) {
    const titleClean = (title || "").trim();
    const urlClean = (url || "").trim();
    if (!titleClean) throw new Error("title requerido");
    if (!urlClean) throw new Error("url requerida");
    // validación simple
    if (!/^https?:\/\//i.test(urlClean)) throw new Error("url debe comenzar con http:// o https://");
    const info = qInsert.run(Number(topicId), titleClean, urlClean);
    return this.find(info.lastInsertRowid);
  },
  destroy(id) {
    qDelete.run(Number(id));
  },
  upvote(id) {
    return qUpvote.get(Number(id)) || null;
  },
  downvote(id) {
    return qDownvote.get(Number(id)) || null;
  },
};
