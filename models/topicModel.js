// models/topicModel.js
import db from "../db/sqlite.js";

// PREPARED STATEMENTS
const stmtAll = db.prepare(`
  SELECT id, title, description, votes
  FROM topics
  ORDER BY votes DESC, id DESC
`);

const stmtFind = db.prepare(`
  SELECT id, title, description, votes
  FROM topics
  WHERE id = ?
`);

const stmtInsert = db.prepare(`
  INSERT INTO topics (title, description, votes)
  VALUES (?, ?, 0)
`);

const stmtUpdate = db.prepare(`
  UPDATE topics
  SET title = ?, description = ?
  WHERE id = ?
`);

const stmtDelete = db.prepare(`
  DELETE FROM topics
  WHERE id = ?
`);

const stmtVoteUp = db.prepare(`
  UPDATE topics
  SET votes = votes + 1
  WHERE id = ?
  RETURNING id, title, description, votes
`);

const stmtVoteDown = db.prepare(`
  UPDATE topics
  SET votes = votes - 1
  WHERE id = ?
  RETURNING id, title, description, votes
`);

export const Topic = {
  all() {
    return stmtAll.all(); // array de filas
  },

  create({ title, description }) {
    const titleClean = (title || "").trim();
    const descClean = (description || "").trim();
    if (!titleClean) throw new Error("title requerido");
    const info = stmtInsert.run(titleClean, descClean);
    return this.find(info.lastInsertRowid);
  },

  find(id) {
    const row = stmtFind.get(Number(id));
    return row || null;
  },

  update(id, { title, description }) {
    const t = this.find(id);
    if (!t) return null;

    const newTitle = (title ?? t.title).toString().trim();
    const newDesc = (description ?? t.description).toString().trim();
    if (!newTitle) throw new Error("title requerido");

    stmtUpdate.run(newTitle, newDesc, Number(id));
    return this.find(id);
  },

  destroy(id) {
    stmtDelete.run(Number(id));
  },

  upvote(id) {
    return stmtVoteUp.get(Number(id)) || null;
  },

  downvote(id) {
    return stmtVoteDown.get(Number(id)) || null;
  }
};
