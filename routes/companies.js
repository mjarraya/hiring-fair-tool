const router = require("express").Router();
const Company = require("../db/models/Company");

router.get("/fair/:fairId/companies", async (req, res) => {
  try {
    const { fairId } = req.params;
    const { course } = req.query;

    const query = { fair: fairId };
    if (course) query.courses = course;
    const companies = await Company.find(query);

    res.render("companies.hbs", { course, companies, fair: req.session.fair });
  } catch (err) {
    console.log(err);
  }
});

router.post("/fair/:fairId/companies", async (req, res) => {
  try {
    const { fairId } = req.params;
    const { displayName, courses, langFilters } = req.body;

    await Company.create({ displayName, courses, langFilters, fair: fairId });
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
