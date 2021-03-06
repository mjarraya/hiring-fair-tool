const initSchedule = (timeRanges, nullFlag) => {
  const schedule = {};

  for (const range of timeRanges) {
    const [start, end] = range.split("|");

    let time = start;
    while (time !== end) {
      let [h, m] = time.split(".").map(Number);
      schedule[time] = nullFlag ? null : [];

      if (m <= 30) {
        m += 10;
      } else {
        h += 1;
        m = 0;
      }
      time = [h.toString().padStart(2, 0), m.toString().padEnd(2, 0)].join(".");
    }
  }

  return schedule;
};

const shuffle = array => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

    // swap elements array[i] and array[j]
    // we use "destructuring assignment" syntax to achieve that
    // you'll find more details about that syntax in later chapters
    // same can be written as:
    // let t = array[i]; array[i] = array[j]; array[j] = t
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const initialFilter = (schedule, student, company, timeSlot) => {
  if (company.langFilter && !student.lang) {
    return false;
  }
  if (
    Object.keys(schedule).find(slot => {
      return schedule[slot].find(itw => {
        return itw.student === student._id && itw.company === company._id;
      });
    })
  ) {
    return false;
  }
  if (
    Object.keys(schedule).find(slot => {
      if (
        schedule[slot].findIndex(el => el.student === student._id) !== -1 &&
        slot.split(".")[0] === timeSlot.split(".")[0]
      ) {
        return true;
      }
    })
  ) {
    return false;
  }

  return true;
};

const generateSchedule = (schedule, students, companies) => {
  Object.keys(schedule).forEach(timeSlot => {
    companies.forEach(company => {
      shuffle(students);
      let nextStudent = students.find(student => {
        if (!initialFilter(schedule, student, company, timeSlot)) {
          return false;
        }
        return student.top3.find(id => {
          return id.toString() === company._id.toString();
        });
      });
      if (!nextStudent) {
        nextStudent = students.find(student => {
          return initialFilter(schedule, student, company, timeSlot);
        });
      }

      if (!nextStudent) return;

      schedule[timeSlot].push({
        student: nextStudent._id,
        company: company._id,
        timeSlot,
        course: nextStudent.course
      });
    });
  });
};

module.exports = {
  initSchedule,
  generateSchedule,
  shuffle
};
