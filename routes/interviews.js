const router = require("express").Router();
const Interview = require("../db/models/Interview");
const Company = require("../db/models/Company");
const Student = require("../db/models/Student");
const Fair = require("../db/models/Fair");
const { initSchedule, generateSchedule } = require("../utils/schedule");
const { check } = require("../utils/auth");

router.get("/fair/:fairId/interviews", check(), async (req, res) => {
  try {
    const { fairId: fair } = req.params;
    const { course } = req.query;
    const interviews = await Interview.find({ fair, course })
      .populate("student company")
      .sort({ timeSlot: 1 });

    const schedule = interviews.length
      ? initSchedule(
          [
            interviews[0].timeSlot +
              "|" +
              interviews[interviews.length - 1].timeSlot
          ],
          null
        )
      : {};

    let companies = [
      ...new Set(interviews.map(itw => itw.company.displayName))
    ];

    Object.keys(schedule).forEach(timeSlot => {
      schedule[timeSlot] = interviews.filter(itw => itw.timeSlot === timeSlot);
    });

    const timeSlots = Object.keys(schedule).reduce((acc, val, i) => {
      acc[val] = [];
      companies.forEach(company => {
        acc[val].push(
          Object.values(schedule)[i].find(
            itw => itw.company.displayName === company
          ) || null
        );
      });
      return acc;
    }, {});

    companies = companies.map(company => {
      const found = interviews.find(itw => itw.company.displayName === company)
        .company;
      return {
        _id: found._id,
        displayName: company
      };
    });

    res.render("interviews.hbs", {
      companies,
      timeSlots,
      fair,
      course,
      showGenerate: true
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/fair/:fairId/interviews/company/:companyId", async (req, res) => {
  try {
    const { fairId, companyId } = req.params;
    const { course } = req.query;
    const interviewsP = Interview.find({
      fair: fairId,
      company: companyId,
      course
    })
      .populate("student company")
      .sort({ timeSlot: 1 });

    const companyP = Company.findById(companyId);

    const [interviews, company] = await Promise.all([interviewsP, companyP]);

    const schedule = initSchedule(
      [
        interviews[0].timeSlot +
          "|" +
          interviews[interviews.length - 1].timeSlot
      ],
      true
    );

    Object.keys(schedule).forEach(timeSlot => {
      schedule[timeSlot] = interviews.find(itw => itw.timeSlot === timeSlot);
      if (!schedule[timeSlot]) delete schedule[timeSlot];
    });

    res.render("interviews.hbs", {
      company: company.displayName,
      course,
      timeSlots: schedule,
      fair: fairId
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/fair/:fairId/interviews/student/:studentId", async (req, res) => {
  try {
    const { fairId, studentId } = req.params;

    const studentP = await Student.findById(studentId).populate("top3");
    const interviewsP = Interview.find({
      fair: fairId,
      student: studentId
    })
      .populate("company")
      .sort({ timeSlot: 1 });

    let [student, interviews] = await Promise.all([studentP, interviewsP]);

    const schedule = initSchedule(
      [
        interviews[0].timeSlot +
          "|" +
          interviews[interviews.length - 1].timeSlot
      ],
      true
    );

    Object.keys(schedule).forEach(timeSlot => {
      schedule[timeSlot] = interviews.find(itw => itw.timeSlot === timeSlot);
      if (!schedule[timeSlot]) delete schedule[timeSlot];
    });

    res.render("interviews.hbs", {
      timeSlots: schedule,
      fair: fairId,
      student: student.displayName
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/fair/:fairId/interviews", check(), async (req, res) => {
  try {
    const { course } = req.query;
    const { fairId } = req.params;
    await Interview.deleteMany({ fair: fairId, course });

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
