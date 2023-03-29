var express = require("express");
const Router = require("express-promise-router");
const db = require("../db");
const router = new Router();

/* GET home page. */
router.get("/", async function (req, res, next) {
  const { rows } = await db.query(
    "SELECT id,artist,title,(select count(*) FROM track WHERE youtube_id IS NULL) FROM track WHERE youtube_id IS NULL LIMIT 1"
  );
  const { id, artist, title } = rows[0];
  const url = `https://google.com/search?q=${encodeURIComponent(
    `youtube ${artist} - ${title}`
  )}`;

  res.render("index", {
    track: { id, artist, title, url },
    count: rows[0].count,
  });
});

router.patch("/track/:id", async function (req, res, next) {
  let success = false;
  if (req.body.youtube_id.length > 0) {
    await db.query("UPDATE track SET youtube_id = $1 WHERE id = $2", [
      req.body.youtube_id,
      req.params.id,
    ]);
    success = true;
  }
  res.set("HX-Location", "/");
  res.send("ok");
});

module.exports = router;
