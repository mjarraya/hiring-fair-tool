const router = require("express").Router();
const Interview = require("../db/models/Interview");
const Company = require("../db/models/Company");
const Student = require("../db/models/Student");
const Fair = require("../db/models/Fair");
const { initSchedule, generateSchedule } = require("../utils/schedule");

router.get("/fair/:fairId/interviews", async (req, res) => {
  try {
    const { fairId: fair } = req.params;
    const interviews = Interview.find({ fair });

    res.render("interviews.hbs", {
      interviews,
      fair,
      course: req.query.course
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
    // generate interviews

    const students = await Student.find({ fair: fairId, course });
    const companies = await Company.find({ fair: fairId, courses: course });

    const fair = await Fair.findById(fairId);

    const { openingTimes } = fair;

    const schedule = initSchedule(openingTimes);

    generateSchedule(schedule, students, companies);

    res.send(schedule);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
