const router = require("express").Router();
const Student = require("../db/models/Student");
const Company = require("../db/models/Company");

router.get("/fair/:fairId/students", async (req, res) => {
  try {
    const { fairId } = req.params;
    const { course } = req.query;

    const studentsP = Student.find({ fair: fairId, course });

    const companiesP = Company.find({ fair: fairId, courses: course });

    const [students, companies] = await Promise.all([studentsP, companiesP]);

    res.render("students.hbs", { companies, students, fair: req.session.fair });
  } catch (err) {
    console.log(err);
  }
});

router.post("/fair/:fairId/students", async (req, res) => {
  try {
    const { fairId } = req.params;
    const { course, displayName, lang, top3 } = req.body;
    await Student.create({ fair: fairId, course, displayName, lang, top3 });

    res.redirect(`/fair/${fairId}/students?course=${course}`);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
