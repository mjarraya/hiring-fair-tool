const router = require("express").Router();
const Company = require("../db/models/Company");

router.get("/fair/:fairId/companies", async (req, res) => {
  try {
    const { fairId } = req.params;
    const { course } = req.query;

    const companies = await Company.find({ fair: fairId, courses: course });

    res.render("companies.hbs", { companies, fair: req.session.fair });
  } catch (err) {
    console.log(err);
  }
});

router.post("/fair/:fairId/companies", async (req, res) => {
  try {
    const { fairId } = req.params;
    const { displayName, courses, langFilters } = req.body;

    await Company.create({ displayName, courses, langFilters, fair: fairId });
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
