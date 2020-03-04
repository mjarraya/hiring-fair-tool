const router = require("express").Router();
const Student = require("../db/models/Student");
const Company = require("../db/models/Company");
const Interview = require("../db/models/Interview");

router.get("/fair/:fairId/students", async (req, res) => {
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
    res.redirect("/");
  }
});

router.post("/fair/:fairId/students", async (req, res) => {
  try {
    const { fairId } = req.params;
    const { course, displayName, lang, top3 = [] } = req.body;

    if (Array.isArray(top3) && top3.length > 3) {
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
    res.redirect("/");
  }
});

router.get("/fair/:fairId/delete/students", async (req, res) => {
  const { fairId } = req.params;
  const { course } = req.query;

  const deleteQuery = { fair: fairId };
  if (course) {
    deleteQuery.course = course;
  }
  await Student.deleteMany(deleteQuery);

  await Interview.deleteMany(deleteQuery);

  res.redirect(
    `/fair/${fairId}/students${
      req.query.course ? `?course=${req.query.course}` : ""
    }`
  );
});
module.exports = router;
