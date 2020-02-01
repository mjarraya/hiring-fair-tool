const router = require("express").Router();
const Interview = require("../db/models/Interview");
const Company = require("../db/models/Company");
const Student = require("../db/models/Student");
const Fair = require("../db/models/Fair");
const { initSchedule, generateSchedule } = require("../utils/schedule");

router.get("/fair/:fairId/interviews", async (req, res) => {
  try {
    const { fairId: fair } = req.params;
    const interviews = await Interview.find({ fair })
      .populate("student company")
      .sort({ timeSlot: 1 });

    res.render("interviews.hbs", {
      interviews,
      fair,
      course: req.query.course
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/fair/:fairId/interviews/company/:companyId", async (req, res) => {
  try {
    const { fairId, companyId } = req.params;

    const interviews = await Interview.find({
      fair: fairId,
      company: companyId
    })
      .populate("student company")
      .sort({ timeSlot: 1 });

    res.render("interviews.hbs", {
      interviews,
      fair: fairId
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/fair/:fairId/interviews/student/:studentId", async (req, res) => {
  try {
    const { fairId, studentId } = req.params;

    const interviews = await Interview.find({
      fair: fairId,
      student: studentId
    })
      .populate("student company")
      .sort({ timeSlot: 1 });

    res.render("interviews.hbs", {
      interviews,
      fair: fairId
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/fair/:fairId/interviews", async (req, res) => {
  try {
    const { course } = req.query;
    const { fairId } = req.params;
    await Interview.deleteMany({ fair: fairId });

    const students = await Student.find({ fair: fairId, course });
    const companies = await Company.find({ fair: fairId, courses: course });

    const fair = await Fair.findById(fairId);

    const { openingTimes } = fair;

    const schedule = initSchedule(openingTimes);

    generateSchedule(schedule, students, companies);

    const interviews = Object.values(schedule)
      .flat()
      .map(itw => ({ ...itw, fair: fairId }));
    Interview.create(interviews);

    res.redirect(`/fair/${fairId}/interviews?course=${course}`);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
