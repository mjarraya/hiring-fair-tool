const router = require("express").Router();
const Fair = require("../db/models/Fair");
const { check } = require("../utils/auth");

router.get("/", (req, res) => {
  if (req.session.fair) {
    res.render("dashboard.hbs", { fair: req.session.fair });
  } else {
    res.render("login.hbs", { error: req.flash("error") });
  }
});

router.post("/login", async (req, res) => {
  try {
    const fair = await Fair.findOne({ password: req.body.password });
    if (fair) {
      req.session.fair = fair;
    } else {
      req.flash("error", "Incorrect code");
    }
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

const itwRoutes = require("./interviews");
router.use("/", itwRoutes);

router.use(check("/"));

const studentsRoutes = require("./students");
router.use("/", studentsRoutes);
const companiesRoutes = require("./companies");
router.use("/", companiesRoutes);

module.exports = router;
