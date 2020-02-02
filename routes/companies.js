const router = require("express").Router();
const Company = require("../db/models/Company");
const { check } = require("../utils/auth");

router.get("/fair/:fairId/companies", check(), async (req, res) => {
  try {
    const { fairId } = req.params;
    const { course } = req.query;

    const query = { fair: fairId };
    if (course) query.courses = course;
    const companies = await Company.find(query).sort({ displayName: 1 });

    res.render("companies.hbs", { course, companies, fair: req.session.fair });
  } catch (err) {
    console.log(err);
  }
});

router.post("/fair/:fairId/companies", check(), async (req, res) => {
  try {
    const { fairId } = req.params;
    const { displayName, courses, langFilter } = req.body;

    await Company.create({
      displayName,
      courses,
      langFilter: !!langFilter,
      fair: fairId
    });
    res.redirect(
      `/fair/${fairId}/companies${
        req.query.course ? `?course=${req.query.course}` : ""
      }`
    );
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
