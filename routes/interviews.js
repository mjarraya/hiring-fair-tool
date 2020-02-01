const router = require("express").Router();
const Interview = require("../db/models/Interview");

router.get("/fair/:fairId/interviews", async (req, res) => {
  try {
    const interviews = Interview.find({ fair: req.params.fairId });
  } catch (err) {}
});

module.exports = router;
