Overall interview format: Interviews are 10 minutes each, in each hour there are 5 interviews in a roll and then a 10 min break (or buffer if we are behind schedule). There are morning (9 am to 1 pm) and afternoon (2 pm to 6 pm) sessions. Therefore the max interviews company can have per session is 20.

The minimum viable version would create a schedule where:

-     	Student's and company's requirements are met (Students vote on top 3 companies they want to be interviewed by, they should get at least one of those (the more the better). Companies have language barriers e.g. "Only German-speaking", that must be met.
-     	Students are randomly allocated the rest of their interviews after their requirements are met
-     	All students have an equal amount of interviews (+1 or -1)
-     	There is a max of 1 meeting between the same student and the same company
-     	Students have only one meeting at a time and no subsequent interviews (Two interviews in a roll - unless there is no other choice)
-     	The outcome is a schedule in the form of a table, which shows "companies" as rows and "time" as columns, where names of the students are in the cells. It should be possible to export schedules for individual companies separately.
-     	As extra security - the schedule can be exported in a format that allows manual adjustments to be made easily.

```
companies: [
  {
    _id: "123xyz",
    displayName: "Amboss",
    langFilters: ["german"]
  }
]

students: [
  {
    _id: "456abc",
    displayName: "Paul O'Sullivan",
    lang: ["english"],
    course: "WebDev",
    top3: ["123xyz", "789def", "999foo"],
  }
]

interviews: [
  {
    timeSlot: "1030",
    company: "123xyz",
    student: "456abc"
  }
]

```

### The TOOL

Should:

- allow Kosta to create companies
- allow Kosta to create students
- generate interviews
