const {Router} = require(`express`);
const router = Router();

const Course = require(`../models/course`);

router.get(`/`, async (req, res) => {
  const courses = await Course.getAll(); 

  res.render(`courses`, {
    title: `Courses catalog`,
    isActiveCourses: true,
    courses,
  });
})

router.get(`/:id`, async (req, res) => {
  const course = await Course.getById(req.params.id); 

  res.render(`course`, {
    layout: `empty`,
    title: `Course: ${course.title}`,
    course,
  });
})

router.get(`/:id/edit`, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect(`/`);
  }

  const course = await Course.getById(req.params.id); 

  res.render(`course-edit`, {
    title: `Edit course ${course.title}`,
    course,
  })
})

router.post(`/edit`, async (req, res) => {
  res.redirect(`/courses`);
  await Course.update(req.body); 
})

module.exports = router;