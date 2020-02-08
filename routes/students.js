const router = require("express").Router();
const Student = require("../db/models/Student");
const Company = require("../db/models/Company");
const { check } = require("../utils/auth");

router.get("/fair/:fairId/students", check(), async (req, res) => {
  try {
    const { fairId } = req.params;
    const { course } = req.query;

    const query = { fair: fairId };
    if (course) query.course = course;

    const studentsP = Student.find(query).sort({ displayName: 1 });

    const companiesP = Company.find({ fair: fairId, courses: course });

    const [students, companies] = await Promise.all([studentsP, companiesP]);

    res.render("students.hbs", {
      companies,
      students,
      fair: req.session.fair,
      course,
      error: req.flash("error")
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/fair/:fairId/students", check(), async (req, res) => {
  try {
    const { fairId } = req.params;
    const { course, displayName, lang, top3 } = req.body;

    if (top3.length > 3) {
      req.flash("error", "3 top choices max");
      return res.redirect(`/fair/${fairId}/students?course=${course}`);
    }

    await Student.create({
      fair: fairId,
      course,
      displayName,
      lang: !!lang,
      top3
    });

    res.redirect(`/fair/${fairId}/students?course=${course}`);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
