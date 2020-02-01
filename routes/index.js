const router = require("express").Router();
const Fair = require("../db/models/Fair");

router.get("/", (req, res) => {
  if (req.session.fair) {
    res.render("dashboard.hbs", { fair: req.session.fair });
  } else {
    res.render("login.hbs");
  }
});

router.post("/login", async (req, res) => {
  try {
    const fair = await Fair.findOne({ password: req.body.password });
    if (fair) {
      req.session.fair = fair;
    }
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

const studentsRoutes = require("./students");
router.use("/", studentsRoutes);
const companiesRoutes = require("./companies");
router.use("/", companiesRoutes);
const itwRoutes = require("./interviews");
router.use("/", itwRoutes);

module.exports = router;
